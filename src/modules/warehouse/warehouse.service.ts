import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { AddProductsToLocationDto } from './dto/add-products-to-location.dto';
import { Shelf } from './entities/shelf.entity';
import { Section } from './entities/section.entity';
import { Product } from '../product/entities/product.entity';
import { ProductLocation } from '../product/entities/product-location.entity';
import { RemoveProductsFromLocationDto } from './dto/remove-products-from-location.dto';
import { ProductLocationRepresentation } from '../product/representations/product-location.representation';
import { LogAction } from './enums/log-action.enum';
import { WarehouseLog } from './entities/log.entity';
import { CreateShelfDto } from './dto/create-shelf.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { IsProductIDCorrectConstraint } from 'src/common/validators/product-id.validator';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Shelf)
    private readonly shelfRepository: Repository<Shelf>,
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductLocation)
    private readonly productLocationRepository: Repository<ProductLocation>,
    @InjectRepository(WarehouseLog)
    private readonly logRepository: Repository<WarehouseLog>,
  ) {}

  private async logAction(
    action: LogAction,
    success: boolean,
    details: any,
  ): Promise<void> {
    const logEntry = this.logRepository.create({ action, success, details });
    await this.logRepository.save(logEntry);
  }

  async createSection(dto: CreateSectionDto): Promise<Section> {
    const shelf = await this.shelfRepository.findOne({
      where: { code: dto.shelfCode },
    });
    if (!shelf) {
      throw new NotFoundException(
        `Shelf with code ${dto.shelfCode} not found.`,
      );
    }

    const section = this.sectionRepository.create({
      number: dto.number,
      shelf: shelf,
    });

    await this.sectionRepository.save(section);
    return section;
  }

  async getSectionsByShelf(shelfId: string): Promise<Section[]> {
    const shelf = await this.shelfRepository.findOne({
      where: { id: shelfId },
    });
    if (!shelf) {
      throw new NotFoundException(`Shelf with id ${shelfId} not found.`);
    }

    const res = await this.sectionRepository.find({
      where: { shelf: { id: shelfId } },
      relations: ['shelf'],
    });

    console.log('res', res);

    return res;
  }

  async createShelf(dto: CreateShelfDto): Promise<Shelf> {
    const shelf = this.shelfRepository.create(dto);
    await this.shelfRepository.save(shelf);
    return shelf;
  }

  async getAllShelves(): Promise<Shelf[]> {
    return await this.shelfRepository.find({ relations: ['sections'] });
  }

  async addProductsToLocation(dto: AddProductsToLocationDto): Promise<void> {
    try {
      const shelf = await this.shelfRepository.findOne({
        where: { code: dto.shelf },
      });
      if (!shelf) {
        throw new NotFoundException(`Shelf ${dto.shelf} not found`);
      }

      const section = await this.sectionRepository.findOne({
        where: {
          number: dto.section,
          shelf: { id: shelf.id },
        },
      });
      if (!section) {
        throw new NotFoundException(
          `Section ${dto.section} on shelf ${dto.shelf} not found`,
        );
      }

      await Promise.all(
        dto.products.map(async (productDto) => {
          const product = await this.productRepository.findOne({
            where: { id: productDto.productId },
          });
          if (!product) {
            throw new NotFoundException(
              `Product with ID ${productDto.productId} not found`,
            );
          }

          let productLocation = await this.productLocationRepository.findOne({
            where: {
              product: { id: product.id },
              section: { id: section.id },
            },
          });

          if (productLocation) {
            productLocation.quantity += productDto.quantity;
          } else {
            productLocation = this.productLocationRepository.create({
              product: product,
              section: section,
              quantity: productDto.quantity,
            });
          }

          await this.productLocationRepository.save(productLocation);
        }),
      );
      await this.logAction(LogAction.ADD_PRODUCT_TO_LOCATION, true, { dto });
    } catch (error) {
      await this.logAction(LogAction.ADD_PRODUCT_TO_LOCATION, false, {
        dto,
        error: error.message,
      });
      throw error;
    }
  }

  async removeProductsFromLocation(
    dto: RemoveProductsFromLocationDto,
  ): Promise<void> {
    try {
      const shelf = await this.shelfRepository.findOneBy({ code: dto.shelf });
      if (!shelf) {
        throw new NotFoundException(`Shelf with code ${dto.shelf} not found.`);
      }

      const section = await this.sectionRepository.findOne({
        where: {
          number: dto.section,
          shelf: { id: shelf.id },
        },
        relations: ['shelf'],
      });
      if (!section) {
        throw new NotFoundException(
          `Section ${dto.section} not found on shelf ${dto.shelf}.`,
        );
      }

      await Promise.all(
        dto.products.map(async (productDto) => {
          const productLocation = await this.productLocationRepository.findOne({
            where: {
              product: { id: productDto.productId },
              section: { id: section.id },
            },
          });
          if (!productLocation) {
            throw new NotFoundException(
              `Product with ID ${productDto.productId} not found in section ${dto.section}.`,
            );
          }

          if (productLocation.quantity < productDto.quantity) {
            throw new Error(
              `Insufficient quantity of product ID ${productDto.productId} in section ${dto.section}.`,
            );
          }

          productLocation.quantity -= productDto.quantity;
          if (productLocation.quantity === 0) {
            await this.productLocationRepository.remove(productLocation);
          } else {
            await this.productLocationRepository.save(productLocation);
          }
        }),
      );
      await this.logAction(LogAction.REMOVE_PRODUCT_FROM_LOCATION, true, {
        dto,
      });
    } catch (error) {
      await this.logAction(LogAction.REMOVE_PRODUCT_FROM_LOCATION, false, {
        dto,
        error: error.message,
      });
      throw error;
    }
  }

  async getProductLocations(
    productCode: string,
    quantity: number,
  ): Promise<ProductLocationRepresentation[]> {
    try {
      const isProductCodeValid = new IsProductIDCorrectConstraint().validate(
        productCode,
      );
      if (!isProductCodeValid) {
        throw new NotFoundException(
          `Product code ${productCode} is not valid.`,
        );
      }

      const productNumber = productCode.match(/\d{5}/)[0];

      const product = await this.productRepository.findOne({
        where: { code: Like(`%${productNumber}%`) },
      });
      if (!product) {
        throw new NotFoundException(
          `Product with code ${productNumber} not found.`,
        );
      }

      const productLocations = await this.productLocationRepository.find({
        where: { product: { id: product.id } },
        relations: ['product', 'section', 'section.shelf'],
      });

      const totalAvailable = productLocations.reduce(
        (sum, loc) => sum + loc.quantity,
        0,
      );
      if (totalAvailable < quantity) {
        throw new NotFoundException(
          `Not enough quantity for product code ${productCode}. Required: ${quantity}, available: ${totalAvailable}.`,
        );
      }

      let remainingQuantity = quantity;
      const requiredLocations = [];
      for (const location of productLocations) {
        if (remainingQuantity <= 0) break;

        const availableQuantity = location.quantity;
        const takenQuantity = Math.min(availableQuantity, remainingQuantity);
        if (takenQuantity > 0) {
          requiredLocations.push({
            shelfCode: location.section.shelf.code,
            sectionNumber: location.section.number,
            quantity: takenQuantity,
          });
          remainingQuantity -= takenQuantity;
        }
      }

      return requiredLocations;
    } catch (error) {
      await this.logAction(LogAction.RETRIEVE_PRODUCT_LOCATION, false, {
        productCode,
        quantity,
        error: error.message,
      });
      throw error;
    }
  }
}
