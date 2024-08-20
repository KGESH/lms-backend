import { Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypedBody, TypedException, TypedRoute } from '@nestia/core';
import { LoginUserDto, SignUpUserDto, UpdateUserRoleDto } from './auth.dto';
import { KakaoLoginDto } from './kakao-auth.dto';
import { KakaoAuthService } from './kakao-auth.service';
import { UserWithoutPasswordDto } from '../user/user.dto';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '../../shared/types/response';
import * as date from '../../shared/utils/date';
import { IUserWithoutPassword } from '../user/user.interface';

@Controller('v1/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly kakaoAuthService: KakaoAuthService,
  ) {}

  private _transform(user: IUserWithoutPassword): UserWithoutPasswordDto {
    return {
      ...user,
      createdAt: date.toISOString(user.createdAt),
      updatedAt: date.toISOString(user.updatedAt),
      deletedAt: user.deletedAt ? date.toISOString(user.deletedAt) : null,
    };
  }

  @TypedRoute.Post('/kakao/login')
  async kakaoLogin(
    @TypedBody() body: KakaoLoginDto,
  ): Promise<UserWithoutPasswordDto> {
    const user = await this.kakaoAuthService.login(body);
    return this._transform(user);
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
    return this._transform(user);
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
    return this._transform(user);
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
    return this._transform(updated);
  }
}
