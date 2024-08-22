import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as typia from 'typia';
import { ISessionWithUser } from '@src/v1/auth/session.interface';

export const SessionUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    if (!req['user']) {
      throw new UnauthorizedException('User not found in session');
    }

    const sessionWithUser = typia.assert<ISessionWithUser>(req['user']);
    return sessionWithUser;
  },
);
