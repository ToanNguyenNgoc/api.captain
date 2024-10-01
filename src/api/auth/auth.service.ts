import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { HttpResponse, PasswordHelper } from 'src/helpers';
import { JwtService } from '@nestjs/jwt';
import { aesEncode } from 'src/utils';
import { RequestHeader } from 'src/interfaces';
import { ROLE } from 'src/constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async login(body: LoginAuthDto, check_is_employee: boolean) {
    const user = await this.userRepo
      .createQueryBuilder('tb_user')
      .where({ email: body.email })
      .getOne();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.role !== ROLE.SPA && check_is_employee) {
      throw new HttpException(
        'User does not have the right roles.',
        HttpStatus.FORBIDDEN,
      );
    }
    const passwordMatched = await PasswordHelper.comparePassword(
      body.password,
      user.password,
    );
    if (!passwordMatched) {
      throw new HttpException('Wrong password', HttpStatus.FORBIDDEN);
    }
    delete user.password;
    const response = Object.assign(user, {
      access_token: await this.createToken(user.id, user.email, user.role),
    });
    return HttpResponse.detail(response);
  }
  async createToken(id: number, email: string, role: string) {
    const code = JSON.stringify({ id, email, role });
    return this.jwtService.signAsync(
      { code: aesEncode(code) },
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
        secret: process.env.JWT_SECRET,
      },
    );
  }
  async profile(request: RequestHeader<User>) {
    console.log(request.user);
    const user = await this.userRepo
      .createQueryBuilder('tb_user')
      .where({ id: request.user.id })
      .getOne();
    return HttpResponse.detail(user);
  }
}
