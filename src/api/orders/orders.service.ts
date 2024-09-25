import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { CheckInOrderDto, UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from '../tickets/entities';
import { Like, Repository } from 'typeorm';
import { Order, Productable } from './entities';
import { HttpResponse } from 'src/helpers';
import { TicketsService } from '../tickets/tickets.service';
import { QrOrderDto, sortOrder } from './dto';
import { getQrPageLimit } from 'src/utils';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ticketService: TicketsService,

    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(Productable)
    private readonly productableRepo: Repository<Productable>,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    const {
      fullname,
      date_of_birth,
      email,
      facebook,
      telephone,
      note,
      productable,
    } = createOrderDto;
    let amount = 0;
    const order = new Order();
    order.tran_uid = new Date().getTime().toString();
    order.fullname = fullname;
    order.date_of_birth = date_of_birth;
    order.email = email;
    order.facebook = facebook;
    order.telephone = telephone;
    order.note = note;
    order.amount = amount;
    const newOrder = await this.orderRepo.save(order);
    for (let i = 0; i < productable.length; i++) {
      const ticket = await this.ticketService.getTicketDetail(
        productable[i].id,
      );
      if (ticket) {
        const amount_price = ticket.price_sale || ticket.price;
        amount += amount_price * productable[i].quantity;
        const newProductable = new Productable();
        newProductable.order = newOrder;
        newProductable.base_price = amount_price;
        newProductable.quantity = productable[i].quantity;
        newProductable.ticket = ticket;
        await this.productableRepo.save(newProductable);
      }
    }
    await this.orderRepo
      .createQueryBuilder('tb_order')
      .where({ id: newOrder.id })
      .update(Order)
      .set({ amount })
      .execute();
    const response = await this.findOne(newOrder.id);
    return HttpResponse.detail(response);
  }

  async findAll(qr: QrOrderDto) {
    const { page, limit, offset } = getQrPageLimit(qr);
    // const response = await this.productableRepo
    //   .createQueryBuilder('tb_productable')
    //   .where('tb_productable.order = :order_id', { order_id: 1 })
    //   .getMany();
    const queryBuilder = this.orderRepo
      .createQueryBuilder('tb_order')
      .leftJoinAndSelect('tb_order.productable', 'tb_productable')
      .leftJoinAndSelect('tb_productable.ticket', 'tb_ticket');
    if (qr.search) {
      queryBuilder
        .where({ fullname: Like(`%${qr.search}%`) })
        .orWhere({ telephone: Like(`%${qr.search}%`) })
        .orWhere({ email: Like(`%${qr.search}%`) })
        .orWhere({ tran_uid: Like(`%${qr.search}%`) });
    }
    if (qr.status) {
      queryBuilder.where({ status: qr.status });
    }
    if (qr.sort) {
      if (qr.sort === sortOrder._amount) {
        queryBuilder.orderBy('tb_order.amount', 'DESC');
      } else if (qr.sort === sortOrder.amount) {
        queryBuilder.orderBy('tb_order.amount', 'ASC');
      } else if (qr.sort === sortOrder._created_at) {
        queryBuilder.orderBy('tb_order.created_at', 'DESC');
      } else if (qr.sort === sortOrder.created_at) {
        queryBuilder.orderBy('tb_order.created_at', 'ASC');
      }
    }
    const [data, total] = await queryBuilder
      .offset(offset)
      .limit(limit)
      .getManyAndCount();
    return HttpResponse.paginate(data, total, page, limit);
  }

  async findOne(id: number) {
    const response = await this.orderRepo
      .createQueryBuilder('tb_order')
      .where({ id })
      .orWhere({ tran_uid: id })
      .leftJoinAndSelect('tb_order.productable', 'tb_productable')
      .leftJoinAndSelect('tb_productable.ticket', 'tb_ticket')
      .getOne();
    if (!response) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return HttpResponse.detail(response);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = (await this.findOne(id)).context;
    const newOrder = Object.assign(order, updateOrderDto);
    await this.orderRepo
      .createQueryBuilder('tb_order')
      .where({ id })
      .orWhere({ tran_uid: id })
      .update({
        fullname: newOrder.fullname,
        date_of_birth: newOrder.date_of_birth,
        email: newOrder.email,
        facebook: newOrder.facebook,
        telephone: newOrder.telephone,
        note: newOrder.note,
        status: newOrder.status,
        check_in: newOrder.check_in,
      })
      .execute();
    return HttpResponse.detail(newOrder);
  }

  async checking(id: number, checkinOrderDto: CheckInOrderDto) {
    const order = (await this.findOne(id)).context;
    if (order.check_in) {
      throw new HttpException('Order is checked', HttpStatus.FORBIDDEN);
    }
    await this.orderRepo
      .createQueryBuilder('tb_order')
      .where({ id })
      .orWhere({ tran_uid: id })
      .update({ check_in: checkinOrderDto.check_in })
      .execute();
    return HttpResponse.detail({ message: 'Check in success' });
  }

  async remove(id: number) {
    await this.orderRepo.softDelete({ id });
    return HttpResponse.detail({ message: 'Delete success' });
  }
}
