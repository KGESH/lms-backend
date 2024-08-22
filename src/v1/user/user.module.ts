import { Module } from '@nestjs/common';
import { UserController } from '@src/v1/user/user.controller';
import { UserService } from '@src/v1/user/user.service';
import { UserRepository } from '@src/v1/user/user.repository';
import { UserInfoRepository } from '@src/v1/user/user-info.repository';
import { UserAccountRepository } from '@src/v1/user/user-account.repository';
import { UserQueryRepository } from '@src/v1/user/user-query.repository';

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
