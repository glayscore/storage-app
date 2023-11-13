import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDecimal, IsNotEmpty } from 'class-validator';
import { IsProductIDCorrect } from '../../../common/validators/product-id.validator';

export class AddProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsProductIDCorrect({
    message:
      'Code must be in the format of Lxxxxx SM, where xxxx is a numeric id and SM is the size.',
  })
  readonly code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDecimal()
  readonly price: number;
}
