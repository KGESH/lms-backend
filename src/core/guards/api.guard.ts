import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigsService } from '../../configs/configs.service';
import { LMS_API_HEADER } from '../../v1/auth/auth.constant';
import { Reflector } from '@nestjs/core';
import { SKIP_API_GUARD_KEY } from '../decorators/skip-api-guard';

@Injectable()
export class ApiGuard implements CanActivate {
  private readonly logger = new Logger(ApiGuard.name);
  constructor(
    private readonly configsService: ConfigsService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const skipApiGuard = this.reflector.getAllAndOverride<boolean>(
      SKIP_API_GUARD_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (skipApiGuard) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const apiSecret = this._getApiSecret(req);

    if (apiSecret === this.configsService.env.LMS_SECRET) {
      return true;
    }

    throw new UnauthorizedException('Invalid LMS api secret');
  }

  private _getApiSecret(request: Request): string | null {
    return request.headers[LMS_API_HEADER];
  }
}
