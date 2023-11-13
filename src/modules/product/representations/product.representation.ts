import { ApiResponseProperty } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';

export class ProductRepresentation {
  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.code = product.code;
    this.price = product.price;
    this.createdAt = product.createdAt.toISOString();
    this.updatedAt = product.updatedAt.toISOString();
  }

  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  code: string;

  @ApiResponseProperty()
  price: number;

  @ApiResponseProperty()
  createdAt: string;

  @ApiResponseProperty()
  updatedAt: string;
}
