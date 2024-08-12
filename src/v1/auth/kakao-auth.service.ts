import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { IKakaoLogin } from './kakao-auth.interface';
import { IUserWithoutPassword } from '../user/user.interface';

@Injectable()
export class KakaoAuthService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async login(params: IKakaoLogin): Promise<IUserWithoutPassword> {
    const existUser = await this.userService.findUserByEmail(params);

    if (!existUser) {
      const user = await this.authService.signupUser({
        userCreateParams: {
          email: params.email,
          password: null,
          displayName: params.name,
        },
        infoCreateParams: {
          name: params.name,
          gender: params.gender,
          phoneNumber: params.phoneNumber,
          birthDate: params.birthDate,
          connectingInformation: params.connectingInformation,
          duplicationInformation: params.duplicationInformation,
        },
      });
      return user;
    }

    return existUser;
  }
}
