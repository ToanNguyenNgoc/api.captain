import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  telephone: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  fullname: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  role: string;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
