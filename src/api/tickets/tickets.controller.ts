import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { API_TAG } from 'src/swagger';
import { JwtSystemGuard, RoleGuardFactory } from 'src/middlewares/guards';
import { name } from 'src/constants';

@ApiTags(API_TAG.Ticket)
@Controller('api/tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @UseGuards(JwtSystemGuard, RoleGuardFactory([]))
  @ApiBearerAuth(name.JWT)
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtSystemGuard, RoleGuardFactory([]))
  @ApiBearerAuth(name.JWT)
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(+id, updateTicketDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ticketsService.remove(+id);
  // }
}
