import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CheckInOrderDto, UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { API_TAG } from 'src/swagger';
import { QrOrderDto } from './dto';
import { JwtSystemGuard, RoleGuardFactory } from 'src/middlewares/guards';
import { name, ROLE } from 'src/constants';

@ApiTags(API_TAG.Order)
@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiBearerAuth(name.JWT)
  @UseGuards(JwtSystemGuard, RoleGuardFactory([ROLE.SPA]))
  findAll(@Query() qr: QrOrderDto) {
    return this.ordersService.findAll(qr);
  }

  @Get(':id')
  @ApiBearerAuth(name.JWT)
  @UseGuards(JwtSystemGuard, RoleGuardFactory([ROLE.EMPLOYEE]))
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth(name.JWT)
  @UseGuards(JwtSystemGuard, RoleGuardFactory([]))
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Patch(':id')
  @ApiBearerAuth(name.JWT)
  @UseGuards(JwtSystemGuard, RoleGuardFactory([ROLE.EMPLOYEE]))
  checking(@Param('id') id: string, @Body() checkinOrderDto: CheckInOrderDto) {
    return this.ordersService.checking(+id, checkinOrderDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
