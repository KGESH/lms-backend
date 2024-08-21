import { Module } from '@nestjs/common';
import { UserModule } from '../../../src/v1/user/user.module';
import { AuthService } from '../../../src/v1/auth/auth.service';
import { KakaoAuthService } from '../../../src/v1/auth/kakao-auth.service';
import { SessionRepository } from '../../../src/v1/auth/session.repository';
import { AuthController } from '../../../src/v1/auth/auth.controller';

const modules = [UserModule];
const providers = [AuthService, KakaoAuthService, SessionRepository];
// Ignore guards for test
// const guards = [
//   SessionGuard,
//   {
//     provide: APP_GUARD,
//     useExisting: SessionGuard,
//   },
//   ApiGuard,
//   {
//     provide: APP_GUARD,
//     useExisting: ApiGuard,
//   },
// ];

@Module({
  imports: [...modules],
  controllers: [AuthController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class MockAuthModule {}
