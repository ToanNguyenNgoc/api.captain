import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductableDto } from './dto/create-productable.dto';
import { UpdateProductableDto } from './dto/update-productable.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Productable } from '../orders/entities';
import { Repository } from 'typeorm';
import { HttpResponse } from 'src/helpers';

@Injectable()
export class ProductablesService {
  constructor(
    @InjectRepository(Productable)
    private readonly productableRepo: Repository<Productable>,
  ) {}
  create(createProductableDto: CreateProductableDto) {
    return 'This action adds a new productable';
  }

  findAll() {
    return `This action returns all productables`;
  }

  async findOne(id: string) {
    const productable = await this.productableRepo
      .createQueryBuilder('tb_productable')
      .leftJoinAndSelect('tb_productable.order', 'tb_order')
      .leftJoinAndSelect('tb_productable.ticket', 'tb_ticket')
      .where({ uuid: id })
      .getOne();
    if (!productable) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return HttpResponse.detail(productable);
  }

  async update(id: string, updateProductableDto: UpdateProductableDto) {
    const productable = await (await this.findOne(id)).context;
    if (productable.is_check_in === true) {
      throw new HttpException(
        'Productable order is checked',
        HttpStatus.FORBIDDEN,
      );
    }
    await this.productableRepo
      .createQueryBuilder('tb_productable')
      // .where({ id })
      .where({ uuid: id })
      .update({ is_check_in: updateProductableDto.is_check_in })
      .execute();
    return HttpResponse.detail({ message: 'Check in success' });
  }

  remove(id: number) {
    return `This action removes a #${id} productable`;
  }
}
