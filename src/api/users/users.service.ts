import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HttpResponse, PasswordHelper } from 'src/helpers';
import { ROLE } from 'src/constants';

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

  async findAll() {
    const page = 1;
    const limit = 15;
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
      .offset(page * limit - limit)
      .limit(limit)
      .getManyAndCount();
    return HttpResponse.paginate<User[]>(data, total, page, limit);
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
