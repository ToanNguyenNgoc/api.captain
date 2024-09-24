import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { name } from 'src/constants';
import { aesDecode } from 'src/utils';

export class JwtSystemStrategy extends PassportStrategy(
  Strategy,
  name.MIDDLEWARE_NAME_JWT,
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  validate(payload: any) {
    const aesDe = aesDecode(payload.code);
    const obj = JSON.parse(aesDe);
    return obj;
  }
}
