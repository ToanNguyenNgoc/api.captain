import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, Productable } from './entities';
import { Ticket } from '../tickets/entities';
import { TicketsService } from '../tickets/tickets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Productable, Ticket])],
  controllers: [OrdersController],
  providers: [OrdersService, TicketsService],
})
export class OrdersModule {}
