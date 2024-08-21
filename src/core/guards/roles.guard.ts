import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as typia from 'typia';
import { ISessionWithUser } from '../../v1/auth/session.interface';
import { UserRole } from '../../shared/types/primitive';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const req = context.switchToHttp().getRequest();

    if (!req['user']) {
      throw new InternalServerErrorException(
        'No user found in the request (role guard)',
      );
    }

    const sessionWithUser = typia.assert<ISessionWithUser>(req['user']);
    const hasRequiredRole = requiredRoles.some(
      (role) => role === sessionWithUser.user.role,
    );

    if (!hasRequiredRole) {
      throw new ForbiddenException(
        `You do not have the required role. Accessible roles: [${requiredRoles.join(', ')}] Your role: [${sessionWithUser.user.role}]`,
      );
    }

    return hasRequiredRole;
  }
}
