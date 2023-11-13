import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { AddProductDto } from './dto/add-product.dto';
import { ProductRepresentation } from './representations/product.representation';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async addProduct(dto: AddProductDto): Promise<ProductRepresentation> {
    const existingProduct = await this.productRepository.findOne({
      where: { code: dto.code },
    });
    if (existingProduct) {
      throw new ConflictException(
        'A product with the given code already exists',
      );
    }

    const product = this.productRepository.create(dto);
    await this.productRepository.save(product);
    return new ProductRepresentation(product);
  }

  async findAll(): Promise<ProductRepresentation[]> {
    const products = await this.productRepository.find();
    return products.map((product) => new ProductRepresentation(product));
  }

  async remove(id: string): Promise<void> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    await this.productRepository.remove(product);
  }
}
