import { Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypedBody, TypedException, TypedRoute } from '@nestia/core';
import { LoginUserDto, SignUpUserDto, UpdateUserRoleDto } from './auth.dto';
import { KakaoLoginDto } from './kakao-auth.dto';
import { KakaoAuthService } from './kakao-auth.service';
import { UserWithoutPasswordDto } from '../user/user.dto';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '../../shared/types/response';

@Controller('v1/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly kakaoAuthService: KakaoAuthService,
  ) {}

  @TypedRoute.Post('/kakao/login')
  async kakaoLogin(
    @TypedBody() body: KakaoLoginDto,
  ): Promise<UserWithoutPasswordDto> {
    this.logger.log('Kakao login request received', body);

    const user = await this.kakaoAuthService.login(body);
    return user;
  }

  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'user not found',
  })
  @TypedRoute.Post('/login')
  async login(
    @TypedBody() body: LoginUserDto,
  ): Promise<UserWithoutPasswordDto> {
    this.logger.log('Login request received', body);

    const user = await this.authService.login(body);
    return user;
  }

  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<409>>({
    status: 409,
    description: 'user already exists',
  })
  @TypedRoute.Post('/signup')
  async signup(
    @TypedBody() body: SignUpUserDto,
  ): Promise<UserWithoutPasswordDto> {
    this.logger.log('Signup request received', body);
    const user = await this.authService.signUpUser(body);
    return user;
  }

  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'user not found',
  })
  @TypedRoute.Patch('/role')
  async updateUserRole(
    @TypedBody() body: UpdateUserRoleDto,
  ): Promise<UserWithoutPasswordDto> {
    const updated = await this.authService.updateUserRole(body);
    return updated;
  }
}
