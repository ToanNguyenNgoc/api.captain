import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export const validatorFile = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 30000000 }),
    new FileTypeValidator({ fileType: /^(image|video)\// }),
  ],
});
