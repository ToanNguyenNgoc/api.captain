import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HttpResponse, PasswordHelper } from 'src/helpers';
import { ROLE } from 'src/constants';
import { QrUserDto } from './dto';
import { getQrPageLimit } from 'src/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const userEmail = await this.userRepo
      .createQueryBuilder('tb_user')
      .where({ email: createUserDto.email })
      .getOne();
    if (userEmail) {
      throw new ForbiddenException('The email has already been taken');
    }
    const userPhone = await this.userRepo
      .createQueryBuilder('tb_user')
      .where({ telephone: createUserDto.telephone })
      .getOne();
    if (userPhone) {
      throw new ForbiddenException('The telephone has already been taken');
    }
    const user = new User();
    user.email = createUserDto.email;
    user.fullname = createUserDto.fullname;
    user.password = await PasswordHelper.generatePassword(
      createUserDto.password,
    );
    user.role = ROLE.EMPLOYEE;
    user.telephone = createUserDto.telephone;
    const response = await this.userRepo.save(user);
    delete response.password;
    return HttpResponse.detail<User>(response);
  }

  async findAll(qr: QrUserDto) {
    const { page, limit, offset } = getQrPageLimit(qr);
    const queryBuilder = this.userRepo
      .createQueryBuilder('tb_user')
      .select([
        'tb_user.id',
        'tb_user.telephone',
        'tb_user.email',
        'tb_user.fullname',
        'tb_user.role',
        'tb_user.deleted_at',
        'tb_user.created_at',
        'tb_user.updated_at',
      ]);
    const [data, total] = await queryBuilder
      .offset(offset)
      .limit(limit)
      .orderBy('tb_user.created_at', 'DESC')
      .getManyAndCount();
    return HttpResponse.paginate<User[]>(data, total, page, limit);
  }

  async findOne(id: number) {
    const user = await this.userRepo
      .createQueryBuilder('tb_user')
      .where({ id })
      .getOne();
    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return HttpResponse.detail(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await (await this.findOne(id)).response;
    await this.userRepo
      .createQueryBuilder('tb_user')
      .where({ id })
      .update({
        fullname: updateUserDto.fullname,
        email: updateUserDto.email,
        role: updateUserDto.role,
        password: updateUserDto.password
          ? await PasswordHelper.generatePassword(updateUserDto.password)
          : undefined,
      })
      .execute();
    const newUser = Object.assign(user, updateUserDto);
    delete newUser.password;
    return HttpResponse.detail(newUser);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
