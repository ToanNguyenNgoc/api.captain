/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInitDto } from './dto/create-init.dto';
import { UpdateInitDto } from './dto/update-init.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { HttpResponse, PasswordHelper } from 'src/helpers';

@Injectable()
export class InitsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  async create(createInitDto: CreateInitDto) {
    try {
      const userCount = await this.userRepo
        .createQueryBuilder('tb_user')
        .getCount();
      if (userCount > 0) {
        return new HttpException('User is instanced', HttpStatus.FORBIDDEN);
      }
      const user = new User();
      user.email = String(process.env.INIT_EMAIL);
      user.fullname = String(process.env.INIT_FULLNAME);
      user.password = await PasswordHelper.generatePassword(
        String(process.env.INIT_PASSWORD),
      );
      user.role = String(process.env.INIT_ROLE);
      user.telephone = String(process.env.INIT_TELEPHONE);
      const response = await this.userRepo.save(user);
      delete response.password;
      return HttpResponse.detail<User>(response);
    } catch (error) {
      throw new HttpException('Something error', HttpStatus.BAD_REQUEST);
    }
  }

  findAll() {
    return `This action returns all inits`;
  }

  findOne(id: number) {
    return `This action returns a #${id} init`;
  }

  update(id: number, updateInitDto: UpdateInitDto) {
    return `This action updates a #${id} init`;
  }

  remove(id: number) {
    return `This action removes a #${id} init`;
  }
}
