import { Controller, UseGuards } from '@nestjs/common';
import { PolicyService } from '@src/v1/policy/policy.service';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import {
  CreateNewPolicyDto,
  LatestPolicyDto,
  PolicyDto,
  PolicyHistoriesDto,
  PolicySnapshotDto,
  UpdatePolicyDto,
} from '@src/v1/policy/policy.dto';
import {
  policyHistoriesToDto,
  policyWithSnapshotToDto,
} from '@src/shared/helpers/transofrm/policy';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';

@Controller('v1/policy')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  /**
   * 모든 이용 정책 목록을 조회합니다.
   *
   * 최신 스냅샷을 함께 조회합니다.
   *
   * @tag policy
   * @summary 정책 목록 조회
   */
  @TypedRoute.Get('/')
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
    description: 'user already exists',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async getEveryPolicies(
    @TypedHeaders() headers: AuthHeaders,
  ): Promise<LatestPolicyDto[]> {
    const policies = await this.policyService.findPolicies();
    return policies.map(policyWithSnapshotToDto);
  }

  /**
   * 이용 정책을 조회합니다.
   *
   * 최신 스냅샷을 함께 조회합니다.
   *
   * 로그인 없이 조회할 수 있습니다.
   *
   * @tag policy
   * @summary 이용 정책 조회 (public)
   */
  @TypedRoute.Get('/:policyType')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'Policy not found.',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async getLatestPolicy(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('policyType') policyType: PolicyDto['type'],
  ): Promise<LatestPolicyDto> {
    const policy = await this.policyService.findPolicyByTypeOrThrow({
      type: policyType,
    });
    return policyWithSnapshotToDto(policy);
  }

  /**
   * 특정 이용 정책의 모든 개정 기록(스냅샷 목록)을 조회합니다.
   *
   * @tag policy
   * @summary 특정 정책 스냅샷 목록 조회
   */
  @TypedRoute.Get('/:policyId/histories')
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
  async getPolicyHistories(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('policyId') policyId: PolicyDto['id'],
  ): Promise<PolicyHistoriesDto> {
    const policy = await this.policyService.findPolicyHistoriesOrThrow({
      id: policyId,
    });
    return policyHistoriesToDto(policy);
  }

  /**
   * 이용 정책을 생성합니다.
   *
   * 이용 정책 생성시 스냅샷(이용 정책 본문)이 함께 생성됩니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag policy
   * @summary 이용 정책 생성
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
  @TypedException<IErrorResponse<409>>({
    status: 409,
    description: 'Policy already exist.',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async createPolicy(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreateNewPolicyDto,
  ): Promise<LatestPolicyDto> {
    const newPolicy = await this.policyService.createPolicy({
      policyParams: body.policy,
      snapshotParams: body.content,
    });
    return policyWithSnapshotToDto(newPolicy);
  }

  /**
   * 이용 정책을 수정합니다.
   *
   * 이용 정책 정보는 수정되고, 이용 정책의 본문은 스냅샷 형태로 생성됩니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag policy
   * @summary 이용 정책 수정 (스냅샷 생성)
   */
  @TypedRoute.Patch('/:policyId')
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
    description: 'Policy not found.',
  })
  @TypedException<IErrorResponse<409>>({
    status: 409,
    description: 'Policy type must be unique.',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async updatePolicy(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('policyId') policyId: PolicyDto['id'],
    @TypedBody() body: UpdatePolicyDto,
  ): Promise<LatestPolicyDto> {
    const updatedPolicy = await this.policyService.updatePolicy({
      where: { id: policyId },
      policyParams: body.policy,
      snapshotParams: body.content,
    });
    return policyWithSnapshotToDto(updatedPolicy);
  }

  /**
   * 이용 정책을 삭제합니다.
   *
   * 연관된 모든 스냅샷이 함꼐 사라집니다.
   *
   * Hard delete로 구현되어 있습니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag policy
   * @summary 이용 정책 삭제
   */
  @TypedRoute.Delete('/:policyId')
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
    description: 'Policy not found',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async deletePolicy(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('policyId') policyId: PolicyDto['id'],
  ): Promise<Pick<PolicyDto, 'id'>> {
    const deletedId = await this.policyService.deletePolicy({
      id: policyId,
    });
    return { id: deletedId };
  }

  /**
   * 특정 이용 정책의 가장 최신 스냅샷을 삭제합니다.
   *
   * Hard delete로 구현되어 있습니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag policy
   * @summary 특정 이용 정책 최신 스냅샷 삭제
   */
  @TypedRoute.Delete('/:policyId/latest')
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
    description: 'Policy not found',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async deleteLatestPolicySnapshot(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('policyId') policyId: PolicyDto['id'],
  ): Promise<Pick<PolicySnapshotDto, 'id'>> {
    const deletedSnapshotId = await this.policyService.deleteLatestSnapshot({
      id: policyId,
    });
    return { id: deletedSnapshotId };
  }
}
