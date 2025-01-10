/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import axios from 'axios';
import { Observable } from 'rxjs';

@Injectable()
export class RecaptchaGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const remoteAddress = context.switchToHttp().getRequest()
      .connection.remoteAddress;
    const secretKey = String(process.env.RECAPTCHA_SERVER_KEY);
    const { recaptcha } = context.switchToHttp().getRequest().body;
    if (!recaptcha) {
      throw new HttpException('Recaptcha is required', HttpStatus.FORBIDDEN);
    }
    if (
      recaptcha === String(process.env.RECAPTCHA_FE_KEY) ||
      recaptcha === String(process.env.RECAPTCHA_FE_HARD_CODE)
    ) {
      return true;
    }
    const verificationURL =
      'https://www.google.com/recaptcha/api/siteverify?secret=' +
      secretKey +
      '&response=' +
      recaptcha +
      '&remoteip=' +
      remoteAddress;
    return this.verification(verificationURL);
  }
  async verification(verificationURL: string) {
    let active = false;
    try {
      const responseVerify = await axios.get(verificationURL);
      if (responseVerify.data.success) {
        active = true;
      } else {
        throw new HttpException('Recaptcha is invalid', HttpStatus.FORBIDDEN);
      }
    } catch (error) {
      throw new HttpException('Recaptcha is invalid', HttpStatus.FORBIDDEN);
    }
    return active;
  }
}
