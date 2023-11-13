import { IsNumber, Min, Max, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSectionDto {
  @ApiProperty({ description: 'Number of the section' })
  @IsNumber()
  @Min(1)
  @Max(100)
  number: number;

  @ApiProperty({ description: 'Code of the shelf this section belongs to' })
  @IsString()
  shelfCode: string;
}
