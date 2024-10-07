import { Productable } from 'src/api/orders/entities';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_ticket' })
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  content: string;

  @Column({ default: true })
  status: boolean;

  @Column({ nullable: true })
  date_start: Date;

  @Column({ nullable: true })
  date_end: Date;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: true })
  price_sale: number;

  @Column({ nullable: true })
  note: string;

  @Column({ nullable: true })
  address: string;

  @DeleteDateColumn()
  deleted_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Productable, (productable) => productable.ticket, {
    nullable: true,
  })
  productable: Productable[];

  @Column({ nullable: true })
  image_url: string;
}
