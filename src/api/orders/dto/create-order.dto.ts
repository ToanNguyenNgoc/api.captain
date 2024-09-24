import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUrl,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';

class ProductableDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  fullname: string;

  @IsOptional()
  @ApiProperty({ example: '2024-01-01 00:00:00' })
  date_of_birth: Date;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  // @IsUrl()
  facebook: string;

  @ApiProperty()
  // @Matches(/^[0-9\s\-()+]+$/, { message: 'Telephone number is invalid' })
  telephone: string;

  @ApiProperty()
  @MaxLength(500, { message: 'Note is too long' })
  note: string;

  @ApiProperty({ type: [ProductableDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductableDto) // This helps with validation of nested objects
  productable: ProductableDto[];
}
