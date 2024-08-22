import { Controller, Logger, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedRoute,
} from '@nestia/core';
import { LoginUserDto, SignUpUserDto, UpdateUserRoleDto } from './auth.dto';
import { KakaoLoginDto } from '@src/v1/auth/kakao-auth.dto';
import { KakaoAuthService } from '@src/v1/auth/kakao-auth.service';
import { UserWithoutPasswordDto } from '@src/v1/user/user.dto';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { userToDto } from '@src/shared/helpers/transofrm/user';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { Roles } from '@src/core/decorators/roles.decorator';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';

@Controller('v1/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly kakaoAuthService: KakaoAuthService,
  ) {}

  @TypedRoute.Post('/kakao/login')
  @SkipAuth()
  async kakaoLogin(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedBody() body: KakaoLoginDto,
  ): Promise<UserWithoutPasswordDto> {
    const user = await this.kakaoAuthService.login(body);
    return userToDto(user);
  }

  @TypedRoute.Post('/login')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'user not found',
  })
  async login(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedBody() body: LoginUserDto,
  ): Promise<UserWithoutPasswordDto> {
    this.logger.log('Login request received', body);

    const user = await this.authService.login(body);
    return userToDto(user);
  }

  @TypedRoute.Post('/signup')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<409>>({
    status: 409,
    description: 'user already exists',
  })
  async signup(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedBody() body: SignUpUserDto,
  ): Promise<UserWithoutPasswordDto> {
    this.logger.log('Signup request received', body);
    const user = await this.authService.signUpUser(body);
    return userToDto(user);
  }

  @TypedRoute.Patch('/role')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'user not found',
  })
  async updateUserRole(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: UpdateUserRoleDto,
  ): Promise<UserWithoutPasswordDto> {
    const updated = await this.authService.updateUserRole(body);
    return userToDto(updated);
  }
}
