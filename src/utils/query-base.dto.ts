import { ApiProperty } from '@nestjs/swagger';

export class QrBaseDto {
  @ApiProperty({ required: false, default: 1 })
  page: number;

  @ApiProperty({ required: false, default: 15 })
  limit: number;
}

export const getQrPageLimit = (query: QrBaseDto) => {
  const page = parseInt(`${query.page ?? 1}`);
  const limit = parseInt(`${query.limit ?? 15}`);
  return {
    page,
    limit,
    offset: page * limit - limit,
  };
};
