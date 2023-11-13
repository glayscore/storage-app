import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProductToLocationDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class AddProductsToLocationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  shelf: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(10)
  section: number;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductToLocationDto)
  products: ProductToLocationDto[];
}
