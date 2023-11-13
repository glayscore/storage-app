import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShelfDto {
  @ApiProperty({ description: 'Unique code for the shelf' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  code: string;
}
