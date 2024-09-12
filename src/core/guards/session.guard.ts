import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '@src/v1/auth/auth.service';
import { USER_SESSION_ID_HEADER } from '@src/v1/auth/auth.constant';
import { SKIP_AUTH_KEY } from '@src/core/decorators/skip-auth.decorator';
import { Reflector } from '@nestjs/core';
import * as typia from 'typia';
import { ISessionWithUser } from '@src/v1/auth/session.interface';
import { Request } from 'express';
import { GUEST_ACCESS_KEY } from '@src/core/decorators/guest-access.decorator';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const guestAccess = this.reflector.getAllAndOverride<boolean>(
      GUEST_ACCESS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (skipAuth) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const sessionId = this._getUserSessionId(req);

    if (!sessionId && !guestAccess) {
      throw new BadRequestException('Session id is required.');
    }

    const userWithSession = sessionId
      ? await this.authService.validateSession({
          sessionId,
        })
      : null;

    if (!userWithSession && !guestAccess) {
      throw new UnauthorizedException('Session user not found.');
    }

    if (userWithSession) {
      req['user'] = typia.assert<ISessionWithUser>(userWithSession);
    }

    return true;
  }

  private _getUserSessionId(request: Request): string | null {
    return (request.headers[USER_SESSION_ID_HEADER] as string) ?? null;
  }
}
