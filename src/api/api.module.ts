import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { InitsModule } from './inits/inits.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtSystemStrategy } from 'src/middlewares';

@Module({
  imports: [UsersModule, InitsModule, AuthModule, JwtModule.register({})],
  providers: [JwtSystemStrategy],
})
export class ApiModule {}
