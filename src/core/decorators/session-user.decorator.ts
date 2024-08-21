import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as typia from 'typia';
import { ISessionWithUser } from '../../v1/auth/session.interface';

export const SessionUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const sessionWithUser = typia.assert<ISessionWithUser>(request['user']);
    return sessionWithUser;
  },
);
