import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserInfoRepository } from './user-info.repository';

const providers = [UserService, UserRepository, UserInfoRepository];

@Module({
  controllers: [UserController],
  providers: [...providers],
  exports: [...providers],
})
export class UserModule {}
