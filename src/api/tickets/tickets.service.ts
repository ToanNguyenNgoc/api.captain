import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities';
import { Repository } from 'typeorm';
import { HttpResponse } from 'src/helpers';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
  ) {}
  async create(createTicketDto: CreateTicketDto) {
    const ticket = new Ticket();
    ticket.address = createTicketDto.address;
    ticket.content = createTicketDto.content;
    ticket.date_end = createTicketDto.date_end;
    ticket.date_start = createTicketDto.date_start;
    ticket.note = createTicketDto.note;
    ticket.price = createTicketDto.price;
    ticket.price_sale = createTicketDto.price_sale;
    ticket.status = true;
    ticket.title = createTicketDto.title;
    const response = await this.ticketRepo.save(ticket);
    return HttpResponse.detail(response);
  }

  async findAll() {
    const [data, total] = await this.ticketRepo
      .createQueryBuilder('tb_ticker')
      .getManyAndCount();
    return HttpResponse.paginate(data, total, 1, 15);
  }

  async findOne(id: number) {
    const ticket = await this.getTicketDetail(id);
    return HttpResponse.detail(ticket);
  }

  async update(id: number, updateTicketDto: UpdateTicketDto) {
    const ticket = await this.getTicketDetail(id);
    const ticketUpdate = Object.assign(ticket, updateTicketDto);
    await this.ticketRepo
      .createQueryBuilder('tb_ticket')
      .where({ id })
      .update(Ticket)
      .set(ticketUpdate)
      .execute();
    return HttpResponse.detail(ticketUpdate);
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }

  async getTicketDetail(id: number) {
    const ticket = await this.ticketRepo
      .createQueryBuilder('tb_ticket')
      .where({ id })
      .getOne();
    if (!ticket) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return ticket;
  }
}
