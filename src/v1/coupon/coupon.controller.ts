import { Controller, UseGuards } from '@nestjs/common';
import {
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { CouponDto, CouponRelationsDto } from '@src/v1/coupon/coupon.dto';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { IErrorResponse } from '@src/shared/types/response';
import { TypeGuardError } from 'typia';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';
import { AuthHeaders } from '@src/v1/auth/auth.headers';
import { Uuid } from '@src/shared/types/primitive';

@Controller('v1/coupon')
export class CouponController {
  constructor() {}

  /**
   * 발행 가능한 쿠폰 목록을 조회합니다.
   *
   * 응답 결과로 받은 쿠폰 목록은 실제 발행된 쿠폰이 아닌, 발행 "가능"한 쿠폰의 정보입니다.
   *
   * 쿠폰을 발행하려면 쿠폰 발행 API를 호출해야 합니다.
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
  async getCoupons(@TypedHeaders() headers: AuthHeaders): Promise<CouponDto[]> {
    return [];
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
  ): Promise<CouponRelationsDto | null> {
    return null;
  }

  /**
   * 발행한 일회용 쿠폰 code 목록을 조회합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag coupon
   * @summary 발행한 일회용 쿠폰 code 목록 조회 - Role('admin', 'manager')
   */
  @TypedRoute.Get('/:couponId/disposable')
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
  ): Promise<unknown[]> {
    return [];
  }

  /**
   * 발행한 일회용 쿠폰 code를 조회합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag coupon
   * @summary 발행한 일회용 쿠폰 code 정보 조회 - Role('admin', 'manager')
   */
  @TypedRoute.Get('/:couponId/disposable/:disposableId')
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
  async getCouponDisposable(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('couponId') couponId: Uuid,
    @TypedParam('disposableId') disposableId: Uuid,
  ): Promise<unknown | null> {
    return null;
  }

  /**
   * 발행한 쿠폰 목록을 조회합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag coupon
   * @summary 발행한 쿠폰 목록 조회 - Role('admin', 'manager')
   */
  @TypedRoute.Get('/:couponId/ticket')
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
  async getCouponTickets(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('couponId') couponId: Uuid,
  ): Promise<unknown[]> {
    return [];
  }

  /**
   * 발행한 쿠폰을 조회합니다.
   *
   * @tag coupon
   * @summary 발행한 쿠폰 조회
   */
  @TypedRoute.Get('/:couponId/ticket/:ticketId')
  @Roles('user', 'admin', 'manager')
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
  async getCouponTicket(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('couponId') couponId: Uuid,
    @TypedParam('ticketId') ticketId: Uuid,
  ): Promise<unknown | null> {
    return null;
  }
}
