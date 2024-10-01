import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductablesService } from './productables.service';
import { CreateProductableDto } from './dto/create-productable.dto';
import { UpdateProductableDto } from './dto/update-productable.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { API_TAG } from 'src/swagger';
import { name, ROLE } from 'src/constants';
import { JwtSystemGuard, RoleGuardFactory } from 'src/middlewares/guards';

@ApiTags(API_TAG.Order)
@Controller('api/productables')
export class ProductablesController {
  constructor(private readonly productablesService: ProductablesService) {}

  // @Post()
  // create(@Body() createProductableDto: CreateProductableDto) {
  //   return this.productablesService.create(createProductableDto);
  // }

  // @Get()
  // findAll() {
  //   return this.productablesService.findAll();
  // }

  @Get(':id')
  @ApiBearerAuth(name.JWT)
  @UseGuards(JwtSystemGuard, RoleGuardFactory([ROLE.EMPLOYEE]))
  findOne(@Param('id') id: string) {
    return this.productablesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth(name.JWT)
  @UseGuards(JwtSystemGuard, RoleGuardFactory([ROLE.EMPLOYEE]))
  update(
    @Param('id') id: string,
    @Body() updateProductableDto: UpdateProductableDto,
  ) {
    return this.productablesService.update(id, updateProductableDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productablesService.remove(+id);
  // }
}
