import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { HttpResponse, PasswordHelper } from 'src/helpers';
import { JwtService } from '@nestjs/jwt';
import { aesEncode } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async login(body: LoginAuthDto) {
    const user = await this.userRepo
      .createQueryBuilder('tb_user')
      .where({ email: body.email })
      .getOne();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
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
}
