import { AuthGuard } from '@nestjs/passport';
import { name } from 'src/constants';

export class JwtSystemGuard extends AuthGuard(name.MIDDLEWARE_NAME_JWT) {}
