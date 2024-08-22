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

    if (skipAuth) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const sessionId = this._getUserSessionId(req);

    if (!sessionId) {
      throw new BadRequestException('Session id is required.');
    }

    const userWithSession = await this.authService.validateSession({
      sessionId,
    });

    if (!userWithSession) {
      throw new UnauthorizedException('Session user not found.');
    }

    req['user'] = typia.assert<ISessionWithUser>(userWithSession);

    return true;
  }

  private _getUserSessionId(request: Request): string | null {
    return request.headers[USER_SESSION_ID_HEADER];
  }
}
