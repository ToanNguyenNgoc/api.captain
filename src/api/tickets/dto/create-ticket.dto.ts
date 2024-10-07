import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, Matches } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  content: string;

  @IsNotEmpty()
  @ApiProperty({ example: '2024-01-01 00:00:00' })
  date_start: Date;

  @IsNotEmpty()
  @ApiProperty({ example: '2024-02-01 00:00:00' })
  date_end: Date;

  @IsNumber()
  @ApiProperty({ example: 10000 })
  price: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 9000 })
  price_sale: number;

  @ApiProperty()
  note: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  @IsOptional()
  @Matches(/\.(jpg|jpeg|png|gif|svg|HEIC)$/, {
    message:
      'Image URL must end with a valid image extension (jpg, jpeg, png, gif, svg, heic)',
  })
  image_url: string;
}
