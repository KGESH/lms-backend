import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserInfoRepository } from './user-info.repository';
import { UserAccountRepository } from './user-account.repository';
import { UserQueryRepository } from './user-query.repository';

const providers = [
  UserService,
  UserRepository,
  UserQueryRepository,
  UserInfoRepository,
  UserAccountRepository,
];

@Module({
  controllers: [UserController],
  providers: [...providers],
  exports: [...providers],
})
export class UserModule {}
