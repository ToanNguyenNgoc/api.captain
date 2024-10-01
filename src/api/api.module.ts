import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { InitsModule } from './inits/inits.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtSystemStrategy } from 'src/middlewares';
import { TicketsModule } from './tickets/tickets.module';
import { OrdersModule } from './orders/orders.module';
import { ProductablesModule } from './productables/productables.module';

@Module({
  imports: [
    UsersModule,
    InitsModule,
    AuthModule,
    JwtModule.register({}),
    TicketsModule,
    OrdersModule,
    ProductablesModule,
  ],
  providers: [JwtSystemStrategy],
})
export class ApiModule {}
