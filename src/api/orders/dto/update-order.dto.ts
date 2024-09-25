import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsUrl,
  Matches,
  MaxLength,
} from 'class-validator';
import { ORDER_STATUS } from 'src/constants';

export class UpdateOrderDto {
  @ApiProperty()
  @IsOptional()
  fullname: string;

  @IsOptional()
  @ApiProperty({ example: '2024-01-01 00:00:00' })
  date_of_birth: Date;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  facebook: string;

  @ApiProperty()
  @Matches(/^[0-9\s\-()+]+$/, { message: 'Telephone number is invalid' })
  @IsOptional()
  telephone: string;

  @ApiProperty()
  @MaxLength(500, { message: 'Note is too long' })
  @IsOptional()
  note: string;

  @ApiProperty()
  @IsOptional()
  @IsIn(Object.values(ORDER_STATUS))
  status: string;

  @ApiProperty()
  @IsOptional()
  check_in: boolean;
}

export class CheckInOrderDto {
  @ApiProperty()
  @IsBoolean()
  check_in: true;
}
