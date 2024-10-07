import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, Matches } from 'class-validator';

export class UpdateTicketDto {
  @IsOptional()
  @ApiProperty()
  title: string;

  @IsOptional()
  @ApiProperty()
  content: string;

  @IsOptional()
  @ApiProperty({ example: '2024-01-01 00:00:00' })
  date_start: Date;

  @IsOptional()
  @ApiProperty({ example: '2024-02-01 00:00:00' })
  date_end: Date;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 10000 })
  price: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 9000 })
  price_sale: number;

  @ApiProperty()
  @IsOptional()
  note: string;

  @ApiProperty()
  @IsOptional()
  address: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  status: boolean;

  @ApiProperty()
  @IsOptional()
  @Matches(/\.(jpg|jpeg|png|gif|svg|HEIC)$/, {
    message:
      'Image URL must end with a valid image extension (jpg, jpeg, png, gif, svg, heic)',
  })
  image_url: string;
}
