import { Controller, UseGuards } from '@nestjs/common';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import {
  CouponQuery,
  CreateCouponDto,
  UpdateCouponDto,
  DeleteCouponDto,
} from '@src/v1/coupon/coupon.dto';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { IErrorResponse } from '@src/shared/types/response';
import typia, { TypeGuardError } from 'typia';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';
import { AuthHeaders } from '@src/v1/auth/auth.headers';
import { Uuid } from '@src/shared/types/primitive';
import { CouponService } from '@src/v1/coupon/coupon.service';
import * as date from '@src/shared/utils/date';
import { couponWithCriteriaToDto } from '@src/shared/helpers/transofrm/coupon';
import { withDefaultPagination } from '@src/core/pagination';
import { CouponQueryService } from '@src/v1/coupon/coupon-query.service';
import { Paginated } from '@src/shared/types/pagination';
import { CouponWithCriteriaDto } from '@src/v1/coupon/criteria/coupon-criteria.dto';

@Controller('v1/coupon')
export class CouponController {
  constructor(
    private readonly couponService: CouponService,
    private readonly couponQueryService: CouponQueryService,
  ) {}

  /**
   * 발행 가능한 쿠폰 목록을 조회합니다.
   *
   * 응답 결과로 받은 쿠폰 목록은 실제 발행된 쿠폰이 아닌, 발행 "가능"한 쿠폰의 정보입니다.
   *
   * 쿠폰을 발행하려면 쿠폰 발행 API를 호출해야 합니다.
   *
   * Query parameter 'orderByColumn' 속성을 설정해 정렬 기준을 변경할 수 있습니다. (default: expiredAt)
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag coupon
   * @summary 발행 가능한 쿠폰 목록 조회 - Role('admin', 'manager')
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
  async getCoupons(
    @TypedHeaders() headers: AuthHeaders,
    @TypedQuery() query: CouponQuery,
  ): Promise<Paginated<CouponWithCriteriaDto[]>> {
    const paginatedCoupons = await this.couponQueryService.findCoupons({
      ...withDefaultPagination(query),
      orderByColumn: query.orderByColumn ?? 'expiredAt',
    });

    return {
      pagination: paginatedCoupons.pagination,
      totalCount: paginatedCoupons.totalCount,
      data: paginatedCoupons.data.map(couponWithCriteriaToDto),
    };
  }

  /**
   * 발행 가능한 쿠폰을 조회합니다.
   *
   * 응답 결과로 받은 쿠폰은 실제 발행된 쿠폰이 아닌, 발행 "가능"한 쿠폰의 정보입니다.
   *
   * 쿠폰을 발행하려면 쿠폰 발행 API를 호출해야 합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag coupon
   * @summary 발행 가능한 쿠폰 정보 조회 - Role('admin', 'manager')
   */
  @TypedRoute.Get('/:couponId')
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
  async getCoupon(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('couponId') couponId: Uuid,
  ): Promise<CouponWithCriteriaDto | null> {
    const coupon = await this.couponQueryService.findCouponWithCriteria({
      id: couponId,
    });

    if (!coupon) {
      return null;
    }

    return couponWithCriteriaToDto(coupon);
  }

  /**
   * 쿠폰 정보를 생성합니다.
   *
   * 응답 결과로 받은 쿠폰 정보는 실제 발행된 쿠폰이 아닌, 발행 "가능"한 쿠폰의 정보입니다.
   *
   * 쿠폰을 발행하려면 쿠폰 발행 API를 호출해야 합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag coupon
   * @summary 쿠폰 정보 생성 - Role('admin', 'manager')
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
  async createCoupon(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreateCouponDto,
  ): Promise<CouponWithCriteriaDto> {
    const coupon = await this.couponService.createCoupon(
      {
        ...body,
        openedAt: body.openedAt ? date.toDate(body.openedAt) : null,
        closedAt: body.closedAt ? date.toDate(body.closedAt) : null,
        expiredAt: body.expiredAt ? date.toDate(body.expiredAt) : null,
      },
      [
        ...body.couponAllCriteria,
        ...body.couponCategoryCriteria,
        ...body.couponTeacherCriteria,
        ...body.couponCourseCriteria,
        ...body.couponEbookCriteria,
      ],
    );

    return couponWithCriteriaToDto(coupon);
  }

  /**
   * 쿠폰 정보를 수정합니다.
   *
   * 응답 결과로 받은 쿠폰 정보는 실제 발행된 쿠폰이 아닌, 발행 "가능"한 쿠폰의 정보입니다.
   *
   * 쿠폰을 발행하려면 쿠폰 발행 API를 호출해야 합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag coupon
   * @summary 쿠폰 정보 수정 - Role('admin', 'manager')
   */
  @TypedRoute.Patch('/:couponId')
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
  async updateCoupon(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('couponId') couponId: Uuid,
    @TypedBody() body: UpdateCouponDto,
  ): Promise<CouponWithCriteriaDto> {
    const coupon = await this.couponService.updateCoupon(
      {
        id: couponId,
      },
      {
        ...body,
        // undefined mean "DO NOT" update.
        // null mean infinity date
        // ex) openedAt: 2020-01-01. closedAt: null
        // open ~ close)  2020-01-01 ~ never close
        openedAt: typia.is<undefined>(body.openedAt)
          ? undefined
          : body.openedAt
            ? date.toDate(body.openedAt)
            : null,
        closedAt: typia.is<undefined>(body.closedAt)
          ? undefined
          : body.closedAt
            ? date.toDate(body.closedAt)
            : null,
        expiredAt: typia.is<undefined>(body.expiredAt)
          ? undefined
          : body.expiredAt
            ? date.toDate(body.expiredAt)
            : null,
      },
      {
        create: [
          ...(body?.criteriaUpdateParams?.create?.couponAllCriteria ?? []),
          ...(body?.criteriaUpdateParams?.create?.couponCategoryCriteria ?? []),
          ...(body?.criteriaUpdateParams?.create?.couponTeacherCriteria ?? []),
          ...(body?.criteriaUpdateParams?.create?.couponCourseCriteria ?? []),
          ...(body?.criteriaUpdateParams?.create?.couponEbookCriteria ?? []),
        ],
        update: [
          ...(body?.criteriaUpdateParams?.update?.couponAllCriteria ?? []),
          ...(body?.criteriaUpdateParams?.update?.couponCategoryCriteria ?? []),
          ...(body?.criteriaUpdateParams?.update?.couponTeacherCriteria ?? []),
          ...(body?.criteriaUpdateParams?.update?.couponCourseCriteria ?? []),
          ...(body?.criteriaUpdateParams?.update?.couponEbookCriteria ?? []),
        ],
      },
    );

    return couponWithCriteriaToDto(coupon);
  }

  /**
   * 쿠폰 정보를 삭제합니다.
   *
   * Hard delete로 구현되어 있습니다.
   *
   * 연관된 모든 데이터가 삭제됩니다. (실제 발행된 쿠폰 티켓, 실제 발행된 일회용 쿠폰 코드, 사용된 쿠폰 티켓 이력 등)
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag coupon
   * @summary 쿠폰 정보 삭제 - Role('admin', 'manager')
   */
  @TypedRoute.Delete('/:couponId')
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
  async deleteCoupon(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('couponId') couponId: Uuid,
  ): Promise<DeleteCouponDto> {
    const deletedCouponId = await this.couponService.deleteCoupon({
      id: couponId,
    });

    return { id: deletedCouponId };
  }
}
