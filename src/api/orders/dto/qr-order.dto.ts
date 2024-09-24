import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { ORDER_STATUS } from 'src/constants';
import { QrBaseDto } from 'src/utils';

export const sortOrder = {
  _created_at: '-created_at',
  created_at: 'created_at',
  _amount: '-amount',
  amount: 'amount',
};

export class QrOrderDto extends QrBaseDto {
  @ApiProperty({
    required: false,
    description: 'Suport search: fullname, telephone, email, tran_uid',
  })
  @IsOptional()
  search: string;

  @ApiProperty({ required: false, enum: Object.values(ORDER_STATUS) })
  @IsIn(Object.values(ORDER_STATUS))
  @IsOptional()
  status: string;

  @ApiProperty({ required: false, enum: Object.values(sortOrder) })
  @IsIn(Object.values(sortOrder))
  @IsOptional()
  sort: string;
}
