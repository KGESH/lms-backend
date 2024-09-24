import { Controller, UseGuards } from '@nestjs/common';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';
import { AuthHeaders } from '@src/v1/auth/auth.headers';
import { Uuid } from '@src/shared/types/primitive';
import { CouponDisposableQueryService } from '@src/v1/coupon/disposable/coupon-disposable-query.service';
import {
  CouponDisposableDto,
  CouponDisposableQuery,
  CreateCouponDisposableDto,
} from '@src/v1/coupon/disposable/coupon-disposable.dto';
import { couponDisposableToDto } from '@src/shared/helpers/transofrm/coupon';
import { withDefaultPagination } from '@src/core/pagination';
import { CouponDisposableService } from '@src/v1/coupon/disposable/coupon-disposable.service';
import * as date from '@src/shared/utils/date';
import { Paginated } from '@src/shared/types/pagination';

@Controller('v1/coupon/:couponId/disposable')
export class CouponDisposableController {
  constructor(
    private readonly couponDisposableService: CouponDisposableService,
    private readonly couponDisposableQueryService: CouponDisposableQueryService,
  ) {}

  /**
   * 발행한 일회용 쿠폰 code 목록을 조회합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * Query parameter 'code' 속성을 설정해 쿠폰 코드로 필터링할 수 있습니다.
   *
   * @tag coupon
   * @summary 발행한 일회용 쿠폰 code 목록 조회 - Role('admin', 'manager')
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
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async getCouponDisposables(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('couponId') couponId: Uuid,
    @TypedQuery() query: CouponDisposableQuery,
  ): Promise<Paginated<CouponDisposableDto[]>> {
    const paginatedCouponDisposables =
      await this.couponDisposableQueryService.findCouponDisposables(
        { ...query, couponId },
        withDefaultPagination(query),
      );

    return {
      totalCount: paginatedCouponDisposables.totalCount,
      pagination: paginatedCouponDisposables.pagination,
      data: paginatedCouponDisposables.data.map(couponDisposableToDto),
    };
  }

  /**
   * 발행한 일회용 쿠폰 code를 조회합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag coupon
   * @summary 발행한 일회용 쿠폰 code 정보 조회 - Role('admin', 'manager')
   */
  @TypedRoute.Get('/:disposableId')
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
  async getCouponDisposableById(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('couponId') couponId: Uuid,
    @TypedParam('disposableId') disposableId: Uuid,
  ): Promise<CouponDisposableDto | null> {
    const couponDisposable =
      await this.couponDisposableQueryService.findCouponDisposable({
        id: disposableId,
      });

    if (!couponDisposable) {
      return null;
    }

    return couponDisposableToDto(couponDisposable);
  }

  /**
   * 일회용 쿠폰 코드 목록을 생성합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag coupon
   * @summary 쿠폰 코드 생성 - Role('admin', 'manager')
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
    description: 'CouponDisposable code already exist',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async createCouponDisposables(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('couponId') couponId: Uuid,
    @TypedBody() body: CreateCouponDisposableDto,
  ): Promise<CouponDisposableDto[]> {
    const couponDisposables =
      await this.couponDisposableService.createCouponDisposables(
        {
          couponId,
          expiredAt: body.expiredAt ? date.toDate(body.expiredAt) : null,
        },
        body.count,
      );

    return couponDisposables.map(couponDisposableToDto);
  }
}
