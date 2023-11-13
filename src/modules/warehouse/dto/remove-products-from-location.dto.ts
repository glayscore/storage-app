import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProductFromLocationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  quantity: number;
}

export class RemoveProductsFromLocationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  shelf: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  section: number;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductFromLocationDto)
  products: ProductFromLocationDto[];
}
