import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { KakaoAuthService } from './kakao-auth.service';

const providers = [AuthService, KakaoAuthService];

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [...providers],
  exports: [...providers],
})
export class AuthModule {}
