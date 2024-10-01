import { Module } from '@nestjs/common';
import { ProductablesService } from './productables.service';
import { ProductablesController } from './productables.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, Productable } from '../orders/entities';
import { Ticket } from '../tickets/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Productable, Ticket])],
  controllers: [ProductablesController],
  providers: [ProductablesService],
})
export class ProductablesModule {}
