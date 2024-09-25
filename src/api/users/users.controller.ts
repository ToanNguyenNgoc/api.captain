import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { API_TAG } from 'src/swagger';
import { name, ROLE } from 'src/constants';
import { JwtSystemGuard, RoleGuardFactory } from 'src/middlewares/guards';
import { QrUserDto } from './dto';

@ApiTags(API_TAG.User)
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBearerAuth(name.JWT)
  @UseGuards(JwtSystemGuard, RoleGuardFactory([ROLE.SPA]))
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiBearerAuth(name.JWT)
  @UseGuards(JwtSystemGuard, RoleGuardFactory([ROLE.SPA]))
  findAll(@Query() qr: QrUserDto) {
    return this.usersService.findAll(qr);
  }

  @Get(':id')
  @ApiBearerAuth(name.JWT)
  @UseGuards(JwtSystemGuard, RoleGuardFactory([ROLE.SPA]))
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth(name.JWT)
  @UseGuards(JwtSystemGuard, RoleGuardFactory([ROLE.SPA]))
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
