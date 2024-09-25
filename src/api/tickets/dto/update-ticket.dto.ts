import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

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
}