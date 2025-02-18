import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { CheckInOrderDto, UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from '../tickets/entities';
import { Brackets, Like, Repository } from 'typeorm';
import { Order, Productable } from './entities';
import { HttpResponse } from 'src/helpers';
import { TicketsService } from '../tickets/tickets.service';
import { QrOrderDto, sortOrder } from './dto';
import { getQrPageLimit } from 'src/utils';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import * as QRCode from 'qrcode';
import * as path from 'path';

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

    private readonly mailerService: MailerService,
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
        for (let j = 0; j < productable[i].quantity; j++) {
          const newProductable = new Productable();
          newProductable.order = newOrder;
          newProductable.base_price = amount_price;
          newProductable.quantity = 1;
          newProductable.ticket = ticket;
          newProductable.uuid = uuidv4();
          await this.productableRepo.save(newProductable);
        }
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
    const queryBuilder = this.orderRepo
      .createQueryBuilder('tb_order')
      .leftJoinAndSelect('tb_order.productable', 'tb_productable')
      .leftJoinAndSelect('tb_productable.ticket', 'tb_ticket');

    // Điều kiện tìm kiếm
    if (qr.search) {
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where('tb_order.fullname LIKE :search', {
            search: `%${qr.search}%`,
          })
            .orWhere('tb_order.telephone LIKE :search', {
              search: `%${qr.search}%`,
            })
            .orWhere('tb_order.email LIKE :search', {
              search: `%${qr.search}%`,
            })
            .orWhere('tb_order.tran_uid LIKE :search', {
              search: `%${qr.search}%`,
            });
        }),
      );
    }

    if (qr.ticket_id) {
      queryBuilder.andWhere('tb_ticket.id = :ticketId', {
        ticketId: qr.ticket_id,
      });
    }

    // Điều kiện trạng thái
    if (qr.status) {
      queryBuilder.andWhere('tb_order.status = :status', { status: qr.status });
    }

    // Sắp xếp
    if (qr.sort) {
      switch (qr.sort) {
        case sortOrder._amount:
          queryBuilder.orderBy('tb_order.amount', 'DESC');
          break;
        case sortOrder.amount:
          queryBuilder.orderBy('tb_order.amount', 'ASC');
          break;
        case sortOrder._created_at:
          queryBuilder.orderBy('tb_order.created_at', 'DESC');
          break;
        case sortOrder.created_at:
          queryBuilder.orderBy('tb_order.created_at', 'ASC');
          break;
        default:
          // Thêm một điều kiện sắp xếp mặc định nếu cần
          break;
      }
    }

    // Phân trang
    const [data, total] = await queryBuilder
      .skip(offset)
      .take(limit)
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

  async generateQRCode(uuid: string) {
    // Lưu trong thư mục 'src/uploads' hoặc nơi nào khác trong thư mục root
    const qrCodePath = path.join(process.cwd(), 'uploads', `${uuid}.png`);
    // Tạo mã QR và lưu vào file
    await QRCode.toFile(qrCodePath, uuid);

    return qrCodePath; // Trả về đường dẫn của file mã QR
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
    if (updateOrderDto.status === 'PAID') {
      const items = await Promise.all(
        order.productable.map(async (i) => ({
          ...i,
          qr_code: await QRCode.toDataURL(i.uuid), // Sử dụng await cho QR code
        })),
      );
      const itemsWithQRCode = await Promise.all(
        items.map(async (item) => {
          const qrCodePath = await this.generateQRCode(item.uuid); // Tạo mã QR và lấy đường dẫn
          return {
            ...item,
            qrCodePath: `${process.env.APP_DOMAIN}/media/${item.uuid}.png`,
          };
        }),
      );
      await this.mailerService.sendMail({
        to: order.email,
        from: String(process.env.MAIL_FROM),
        subject: 'TICKET QR CODE',
        template: 'mail_ticker',
        context: {
          order,
          count_ticket: order.productable.length,
          items: itemsWithQRCode,
        },
      });
    }
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
