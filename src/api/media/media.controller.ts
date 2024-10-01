import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { ApiTags } from '@nestjs/swagger';
import { API_TAG } from 'src/swagger';
import { join } from 'path';
import { of } from 'rxjs';
import { Response } from 'express';

@ApiTags(API_TAG.Media)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}
  @Get(':imagename')
  getImageByName(@Param('imagename') imagename: string, @Res() res: Response) {
    return of(res.sendFile(join(process.cwd(), '/src/uploads/' + imagename)));
  }

  // @Post()
  // create(@Body() createMediaDto: CreateMediaDto) {
  //   return this.mediaService.create(createMediaDto);
  // }

  // @Get()
  // findAll() {
  //   return this.mediaService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.mediaService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
  //   return this.mediaService.update(+id, updateMediaDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.mediaService.remove(+id);
  // }
}
