import { Controller, UseGuards } from '@nestjs/common';
import { TermService } from '@src/v1/term/term.service';
import { SignupTermQueryService } from '@src/v1/term/signup-term-query.service';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import {
  CreateSignupTermDto,
  CreateTermWithSnapshotDto,
  CreateUserTermDto,
  SignupFormTermDto,
  SignupTermDto,
  TermWithSnapshotDto,
  UpdateTermWithContentDto,
  UserTermDto,
} from '@src/v1/term/term.dto';
import {
  signupFormTermToDto,
  SignupTermToDto,
  termWithSnapshotToDto,
  userTermToDto,
} from '@src/shared/helpers/transofrm/term';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { Uuid } from '@src/shared/types/primitive';
import { SignupTermService } from '@src/v1/term/signup-term.service';
import { UserTermService } from '@src/v1/term/user-term.service';
import { SessionUser } from '@src/core/decorators/session-user.decorator';
import { ISessionWithUser } from '@src/v1/auth/session.interface';

@Controller('/v1/term')
export class TermController {
  constructor(
    private readonly termService: TermService,
    private readonly signupTermService: SignupTermService,
    private readonly userTermService: UserTermService,
    private readonly signupTermQueryService: SignupTermQueryService,
  ) {}

  /**
   * 회원가입 페이지에서 체크박스로 보여줄 약관 목록을 조회합니다.
   *
   * 로그인 없이 조회할 수 있습니다.
   *
   * @tag term
   * @summary 회원가입 약관 동의 목록 조회 (public)
   */
  @TypedRoute.Get('/signup')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async getSignupFormTerms(
    @TypedHeaders() headers: ApiAuthHeaders,
  ): Promise<SignupFormTermDto[]> {
    const signupFormTerms =
      await this.signupTermQueryService.findSignupFormTerms();

    return signupFormTerms.map(signupFormTermToDto);
  }

  /**
   * 회원가입 페이지에서 체크박스로 보여줄 약관 목록을 생성합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag term
   * @summary 회원가입 약관 동의 목록 생성 (public)
   */
  @TypedRoute.Post('/signup')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<403>>({
    status: 403,
    description: 'Not enough [role] to access this resource.',
  })
  @TypedException<IErrorResponse<409>>({
    status: 409,
    description: 'Signup form term sequence conflict.',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async createSignupFormTerms(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreateSignupTermDto[],
  ): Promise<SignupTermDto[]> {
    const signupFormTerms =
      await this.signupTermService.createSignupFormTerms(body);

    return signupFormTerms.map(SignupTermToDto);
  }

  /**
   * 약관에 동의 또는 거부합니다.
   *
   * @tag term
   * @summary 회원가입 약관 동의 (public)
   */
  @TypedRoute.Post('/agree')
  @Roles('user', 'teacher')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<403>>({
    status: 403,
    description: 'Not enough [role] to access this resource.',
  })
  @TypedException<IErrorResponse<403>>({
    status: 409,
    description: 'User already agreed or disagreed terms.',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async agreeTerms(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreateUserTermDto[],
    @SessionUser() session: ISessionWithUser,
  ): Promise<UserTermDto[]> {
    const userTerms = await this.userTermService.createUserTerms(
      body.map((params) => ({
        ...params,
        userId: session.userId,
      })),
    );

    return userTerms.map(userTermToDto);
  }

  /**
   * 약관을 생성합니다.
   *
   * 약관 생성시 스냅샷(약관 본문)이 함께 생성됩니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag term
   * @summary 약관 생성
   */
  @TypedRoute.Post('/')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<403>>({
    status: 403,
    description: 'Not enough [role] to access this resource.',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async createTerm(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreateTermWithSnapshotDto,
  ): Promise<TermWithSnapshotDto> {
    const { snapshot: snapshotCreateParams, ...termCreateParams } = body;
    const createdTerm = await this.termService.createTerm(
      termCreateParams,
      snapshotCreateParams,
    );

    return termWithSnapshotToDto(createdTerm);
  }

  /**
   * 약관을 수정합니다.
   *
   * 기존 약관의 스냅샷을 생성합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag term
   * @summary 약관 수정 (스냅샷 생성)
   */
  @TypedRoute.Patch('/:termId')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<403>>({
    status: 403,
    description: 'Not enough [role] to access this resource.',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'Term not found.',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async updateTerm(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('termId') termId: Uuid,
    @TypedBody() body: UpdateTermWithContentDto,
  ): Promise<TermWithSnapshotDto> {
    const createdTerm = await this.termService.updateTerm(
      { id: termId },
      {
        termUpdateParams: body.termUpdateParams,
        termContentUpdateParams: body.termContentUpdateParams,
      },
    );

    return termWithSnapshotToDto(createdTerm);
  }
}
