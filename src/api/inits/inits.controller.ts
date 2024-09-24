import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InitsService } from './inits.service';
import { CreateInitDto } from './dto/create-init.dto';
import { UpdateInitDto } from './dto/update-init.dto';
import { ApiTags } from '@nestjs/swagger';
import { API_TAG } from 'src/swagger';

@ApiTags(API_TAG.Init)
@Controller('api/inits')
export class InitsController {
  constructor(private readonly initsService: InitsService) {}

  @Post('/user')
  create(@Body() createInitDto: CreateInitDto) {
    return this.initsService.create(createInitDto);
  }

  // @Get()
  // findAll() {
  //   return this.initsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.initsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateInitDto: UpdateInitDto) {
  //   return this.initsService.update(+id, updateInitDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.initsService.remove(+id);
  // }
}
