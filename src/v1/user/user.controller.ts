import { Controller, Logger, UseGuards } from '@nestjs/common';
import { UserService } from '@src/v1/user/user.service';
import { TypedException, TypedHeaders, TypedRoute } from '@nestia/core';
import { UserProfileDto } from './user.dto';
import { userProfileToDto } from '@src/shared/helpers/transofrm/user';
import { AuthHeaders } from '@src/v1/auth/auth.headers';
import { SessionUser } from '@src/core/decorators/session-user.decorator';
import { ISessionWithUser } from '@src/v1/auth/session.interface';
import { IErrorResponse } from '@src/shared/types/response';
import { TypeGuardError } from 'typia';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';
import { UserTermQueryService } from '@src/v1/term/user-term-query.service';
import { userAgreedTermToDto } from '@src/shared/helpers/transofrm/term';
import { UserAgreedTermDto } from '@src/v1/term/term.dto';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';

@Controller('v1/user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(
    private readonly userService: UserService,
    private readonly userTermQueryService: UserTermQueryService,
  ) {}

  /**
   * 현재 세션 사용자를 조회합니다.
   *
   * 조회할 대상의 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag user
   * @summary 현재 세션 사용자 조회
   */
  @TypedRoute.Get('/me')
  @Roles('user', 'admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<401>>({
    status: 401,
    description: 'Session user not found.',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'user relations not found.',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async getCurrentUser(
    @TypedHeaders() headers: AuthHeaders,
    @SessionUser() session: ISessionWithUser,
  ): Promise<UserProfileDto> {
    const userRelations = await this.userService.findUserRelationsByIdOrThrow({
      id: session.userId,
    });

    return userProfileToDto(userRelations);
  }

  /**
   * 현재 세션 사용자가 동의(또는 비동의)한 이용 약관 목록을 조회합니다.
   *
   * 조회할 대상의 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag user
   * @summary 현재 세션 사용자 조회
   */
  @TypedRoute.Get('/term')
  @Roles('user', 'admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<401>>({
    status: 401,
    description: 'Session user not found.',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async getCurrentUserTerms(
    @TypedHeaders() headers: AuthHeaders,
    @SessionUser() session: ISessionWithUser,
  ): Promise<UserAgreedTermDto[]> {
    const terms = await this.userTermQueryService.findUserTerms({
      userId: session.userId,
    });

    return terms.map(userAgreedTermToDto);
  }
}
