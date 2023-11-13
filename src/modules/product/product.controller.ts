import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  Delete,
  Get,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AddProductDto } from './dto/add-product.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductRepresentation } from './representations/product.representation';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new product' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The product has been successfully created.',
    type: ProductRepresentation,
  })
  async addProduct(
    @Body() addProductDto: AddProductDto,
  ): Promise<ProductRepresentation> {
    return this.productService.addProduct(addProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returned all products',
    type: [ProductRepresentation],
  })
  findAll(): Promise<ProductRepresentation[]> {
    return this.productService.findAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The product has been successfully deleted.',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.productService.remove(id);
  }
}
