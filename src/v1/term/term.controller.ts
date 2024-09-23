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
  SignupFormTermDto,
  SignupTermDto,
  TermWithSnapshotDto,
  UpdateTermWithContentDto,
} from '@src/v1/term/term.dto';
import {
  signupFormTermToDto,
  SignupTermToDto,
  termWithSnapshotToDto,
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

@Controller('/v1/term')
export class TermController {
  constructor(
    private readonly termService: TermService,
    private readonly signupTermService: SignupTermService,
    private readonly signupTermQueryService: SignupTermQueryService,
  ) {}

  /**
   * 회원가입시 필요한 약관 목록을 조회합니다.
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
