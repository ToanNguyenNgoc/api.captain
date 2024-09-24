import { Module } from '@nestjs/common';
import { InitsService } from './inits.service';
import { InitsController } from './inits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [InitsController],
  providers: [InitsService],
})
export class InitsModule {}
