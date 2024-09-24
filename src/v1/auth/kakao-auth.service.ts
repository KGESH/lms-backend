import { Injectable } from '@nestjs/common';
import { AuthService } from '@src/v1/auth/auth.service';
import { IKakaoLogin } from '@src/v1/auth/kakao-auth.interface';
import { UserService } from '@src/v1/user/user.service';
import { IUserWithoutPassword } from '@src/v1/user/user.interface';

@Injectable()
export class KakaoAuthService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async login(params: IKakaoLogin): Promise<IUserWithoutPassword> {
    const existUser = await this.userService.findUserByEmail(params);

    if (!existUser) {
      const user = await this.authService.signUpUser({
        userCreateParams: {
          email: params.email,
          password: null,
          displayName: params.name,
          role: 'user',
          image: params.image,
        },
        infoCreateParams: {
          name: params.name,
          gender: params.gender,
          phoneNumber: params.phoneNumber,
          birthDate: params.birthDate,
          connectingInformation: params.connectingInformation,
          duplicationInformation: params.duplicationInformation,
        },
        accountCreateParams: {
          providerId: params.providerId,
          providerType: 'kakao',
        },
        userTerms: [],
      });
      return user;
    }

    return existUser;
  }
}
