import { Module } from '@nestjs/common';
import { UserModule } from '@src/v1/user/user.module';
import { AuthService } from '@src/v1/auth/auth.service';
import { AuthController } from '@src/v1/auth/auth.controller';
import { KakaoAuthService } from '@src/v1/auth/kakao-auth.service';
import { SessionRepository } from '@src/v1/auth/session.repository';
import { SessionGuard } from '@src/core/guards/session.guard';
import { APP_GUARD } from '@nestjs/core';
import { ApiGuard } from '@src/core/guards/api.guard';
import { AuthAdminService } from '@src/v1/auth/auth-admin.service';
import { AuthAdminController } from '@src/v1/auth/admin/auth-admin.controller';
import { TermModule } from '@src/v1/term/term.module';

const modules = [UserModule, TermModule];

const providers = [
  AuthService,
  AuthAdminService,
  KakaoAuthService,
  SessionRepository,
];

const guards = [
  SessionGuard,
  {
    provide: APP_GUARD,
    useExisting: SessionGuard,
  },
  ApiGuard,
  {
    provide: APP_GUARD,
    useExisting: ApiGuard,
  },
];

@Module({
  imports: [...modules],
  controllers: [AuthController, AuthAdminController],
  providers: [...providers, ...guards],
  exports: [...modules, ...providers],
})
export class AuthModule {}
