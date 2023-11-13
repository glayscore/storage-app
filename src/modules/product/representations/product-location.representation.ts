import { ApiResponseProperty } from '@nestjs/swagger';
import { ProductLocation } from '../entities/product-location.entity';

export class ProductLocationRepresentation {
  constructor(productLocation: ProductLocation) {
    this.id = productLocation.id;
    this.productId = productLocation.product.id;
    this.sectionId = productLocation.section.id;
    this.quantity = productLocation.quantity;
    this.createdAt = productLocation.createdAt.toISOString();
    this.updatedAt = productLocation.updatedAt.toISOString();
    this.shelfCode = productLocation.section.shelf.code;
    this.sectionNumber = productLocation.section.number;
  }
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  productId: string;

  @ApiResponseProperty()
  sectionId: string;

  @ApiResponseProperty()
  quantity: number;

  @ApiResponseProperty()
  createdAt: string;

  @ApiResponseProperty()
  updatedAt: string;

  @ApiResponseProperty()
  shelfCode: string;

  @ApiResponseProperty()
  sectionNumber: number;
}
