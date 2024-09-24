/*
https://docs.nestjs.com/guards#guards
*/

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ROLE } from 'src/constants';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly roles: string[]) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user } = context.switchToHttp().getRequest();
    if (user.role === ROLE.SPA || this.roles.includes(user.role)) {
      return true;
    } else {
      throw new ForbiddenException('User does not have the right roles.');
    }
  }
}

export const RoleGuardFactory = (roles: string[]): CanActivate => {
  return new RoleGuard(roles);
};
