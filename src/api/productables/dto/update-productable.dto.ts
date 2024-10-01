import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductableDto } from './create-productable.dto';
import { IsBoolean } from 'class-validator';

export class UpdateProductableDto {
  @ApiProperty()
  @IsBoolean()
  is_check_in: boolean;
}
