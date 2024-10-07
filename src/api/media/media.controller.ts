/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Controller,
  Get,
  Post,
  Param,
  Res,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { MediaService } from './media.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { API_TAG } from 'src/swagger';
import { join } from 'path';
import { of } from 'rxjs';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { validatorFile } from 'src/utils';
import { name, ROLE } from 'src/constants';
import { JwtSystemGuard, RoleGuardFactory } from 'src/middlewares/guards';

@ApiTags(API_TAG.Media)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @ApiBearerAuth(name.JWT)
  @UseGuards(JwtSystemGuard, RoleGuardFactory([ROLE.SPA]))
  @ApiOkResponse({ description: 'Upload image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const filename =
            path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
          const extensions = path.parse(file.originalname).ext;
          callback(null, `${filename}${extensions}`);
        },
      }),
    }),
  )
  create(@UploadedFile(validatorFile) file: any) {
    return this.mediaService.create(file);
  }

  @Get(':imagename')
  getImageByName(@Param('imagename') imagename: string, @Res() res: Response) {
    return of(res.sendFile(join(process.cwd(), '/uploads/' + imagename)));
  }

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
