import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WarehouseService } from './warehouse.service';
import { AddProductsToLocationDto } from './dto/add-products-to-location.dto';
import { RemoveProductsFromLocationDto } from './dto/remove-products-from-location.dto';
import { ProductLocationRepresentation } from '../product/representations/product-location.representation';
import { Shelf } from './entities/shelf.entity';
import { CreateShelfDto } from './dto/create-shelf.dto';
import { Section } from './entities/section.entity';
import { CreateSectionDto } from './dto/create-section.dto';

@ApiTags('warehouse')
@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post('add-products')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add products to a location' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Products added to location successfully.',
  })
  async addProductsToLocation(
    @Body() addProductsToLocationDto: AddProductsToLocationDto,
  ): Promise<void> {
    await this.warehouseService.addProductsToLocation(addProductsToLocationDto);
  }

  @Post('remove-products')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove products from a location' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Products removed from location successfully.',
  })
  async removeProductsFromLocation(
    @Body() removeProductsFromLocationDto: RemoveProductsFromLocationDto,
  ): Promise<void> {
    await this.warehouseService.removeProductsFromLocation(
      removeProductsFromLocationDto,
    );
  }

  @Get('product-locations/:productId/:quantity')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get locations of a product' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The locations of the product retrieved successfully.',
    type: ProductLocationRepresentation,
  })
  async getProductLocations(
    @Param('productId') productId: string,
    @Param('quantity') quantity: number,
  ): Promise<ProductLocationRepresentation[]> {
    return this.warehouseService.getProductLocations(productId, quantity);
  }

  @Post('shelves')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new shelf' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The shelf has been successfully created.',
  })
  async createShelf(@Body() createShelfDto: CreateShelfDto): Promise<Shelf> {
    return await this.warehouseService.createShelf(createShelfDto);
  }

  @Get('shelves')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get list of all shelves' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of shelves retrieved successfully.',
    type: [Shelf],
  })
  async getAllShelves(): Promise<Shelf[]> {
    return await this.warehouseService.getAllShelves();
  }

  @Post('sections')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new section' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The section has been successfully created.',
    type: Section,
  })
  async createSection(
    @Body() createSectionDto: CreateSectionDto,
  ): Promise<Section> {
    return await this.warehouseService.createSection(createSectionDto);
  }

  @Get('shelves/:shelfId/sections')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get list of all sections on a shelf' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of sections retrieved successfully.',
    type: [Section],
  })
  async getSectionsByShelf(
    @Param('shelfId') shelfId: string,
  ): Promise<Section[]> {
    return await this.warehouseService.getSectionsByShelf(shelfId);
  }
}
