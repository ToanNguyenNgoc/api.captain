import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateMediaDto } from './dto/update-media.dto';
import { HttpResponse } from 'src/helpers';

@Injectable()
export class MediaService {
  create(file: any) {
    try {
      const original_url = `${process.env.APP_DOMAIN}/media/${file.filename}`;
      return HttpResponse.detail({ original_url: original_url });
    } catch (error) {
      console.log(error);
      throw new HttpException('Update error', HttpStatus.BAD_REQUEST);
    }
  }

  findAll() {
    return `This action returns all media`;
  }

  findOne(id: number) {
    return `This action returns a #${id} media`;
  }

  update(id: number, updateMediaDto: UpdateMediaDto) {
    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}
