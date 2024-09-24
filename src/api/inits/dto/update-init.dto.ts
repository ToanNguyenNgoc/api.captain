import { PartialType } from '@nestjs/swagger';
import { CreateInitDto } from './create-init.dto';

export class UpdateInitDto extends PartialType(CreateInitDto) {}
