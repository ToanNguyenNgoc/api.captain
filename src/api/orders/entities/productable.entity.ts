import { Ticket } from 'src/api/tickets/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'tb_productable' })
export class Productable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column()
  base_price: number;

  @ManyToOne(() => Order, (order) => order.productable)
  order: Order;

  @ManyToOne(() => Ticket, (ticket) => ticket.productable)
  ticket: Ticket;
}
