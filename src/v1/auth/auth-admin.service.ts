import { ConflictException, Injectable } from '@nestjs/common';
import { UserService } from '@src/v1/user/user.service';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IUserSignUp } from '@src/v1/auth/auth.interface';
import { IUserWithoutPassword } from '@src/v1/user/user.interface';
import * as date from '@src/shared/utils/date';

@Injectable()
export class AuthAdminService {
  constructor(
    private readonly userService: UserService,
    private readonly drizzle: DrizzleService,
  ) {}

  async createEmailUser(params: IUserSignUp): Promise<IUserWithoutPassword> {
    const exist = await this.userService.findUserByEmailIncludedSoftDeletedUser({
      email: params.userCreateParams.email,
    });

    if (exist) {
      throw new ConflictException('User already exists');
    }

    return await this.userService.createUser({
      ...params,
      userCreateParams: {
        ...params.userCreateParams,
        emailVerified: date.now('date'),
      },
    });
  }
}
