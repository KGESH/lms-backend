import { Module } from '@nestjs/common';
import { UserController } from '@src/v1/user/user.controller';
import { UserService } from '@src/v1/user/user.service';
import { UserRepository } from '@src/v1/user/user.repository';
import { UserInfoRepository } from '@src/v1/user/user-info.repository';
import { UserAccountRepository } from '@src/v1/user/user-account.repository';
import { UserQueryRepository } from '@src/v1/user/user-query.repository';
import { TermModule } from '@src/v1/term/term.module';

const modules = [TermModule];

const providers = [
  UserService,
  UserRepository,
  UserQueryRepository,
  UserInfoRepository,
  UserAccountRepository,
];

@Module({
  imports: [...modules],
  controllers: [UserController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class UserModule {}
