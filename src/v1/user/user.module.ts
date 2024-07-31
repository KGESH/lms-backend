import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

const providers = [UserService, UserRepository];

@Module({
  controllers: [UserController],
  providers: [...providers],
  exports: [...providers],
})
export class UserModule {}
