import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { KakaoAuthService } from './kakao-auth.service';
import { SessionRepository } from './session.repository';
import { SessionGuard } from '../../core/guards/session.guard';
import { APP_GUARD } from '@nestjs/core';
import { ApiGuard } from '../../core/guards/api.guard';

const modules = [UserModule];
const providers = [AuthService, KakaoAuthService, SessionRepository];
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
  controllers: [AuthController],
  providers: [...providers, ...guards],
  exports: [...modules, ...providers],
})
export class AuthModule {}
