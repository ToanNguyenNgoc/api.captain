import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Productable } from './productable.entity';
import { ORDER_STATUS } from 'src/constants';

@Entity({ name: 'tb_order' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  tran_uid: string;

  @Column()
  fullname: string;

  @Column({ nullable: true })
  date_of_birth: Date;

  @Column()
  email: string;

  @Column({ nullable: true })
  facebook: string;

  @Column()
  telephone: string;

  @Column({ nullable: true })
  note: string;

  @Column({ default: ORDER_STATUS.PENDING })
  status: string;

  @Column()
  amount: number;

  @Column({ default: false })
  check_in: boolean;

  @DeleteDateColumn()
  deleted_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Productable, (productable) => productable.order)
  productable: Productable[];
}
