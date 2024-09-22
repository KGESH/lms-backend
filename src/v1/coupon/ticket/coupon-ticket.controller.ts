import { Controller, UseGuards } from '@nestjs/common';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';
import { AuthHeaders } from '@src/v1/auth/auth.headers';
import { Uuid } from '@src/shared/types/primitive';
import { couponTicketRelationsToDto } from '@src/shared/helpers/transofrm/coupon';
import {
  CouponTicketDto,
  CouponTicketRelationsDto,
  CreatePrivateCouponTicketDto,
  CreatePublicCouponTicketDto,
} from '@src/v1/coupon/ticket/coupon-ticket.dto';
import { CouponTicketService } from '@src/v1/coupon/ticket/coupon-ticket.service';

@Controller('v1/coupon/:couponId/ticket')
export class CouponTicketController {
  constructor(private readonly couponTicketService: CouponTicketService) {}

  /**
   * 발행한 쿠폰 목록을 조회합니다. (미완성)
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag coupon
   * @summary 발행한 쿠폰 목록 조회 - Role('admin', 'manager')
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
  async getCouponTickets(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('couponId') couponId: Uuid,
  ): Promise<CouponTicketDto[]> {
    return [];
  }

  /**
   * 발행한 쿠폰을 조회합니다. (미완성)
   *
   * @tag coupon
   * @summary 발행한 쿠폰 조회
   */
  @TypedRoute.Get('/:ticketId')
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
  ): Promise<CouponTicketDto | null> {
    return null;
  }

  /**
   * 특정 사용자에게 공개 쿠폰을 발급합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * 현재 사용자에게 쿠폰 발급을 원하면 v1/user/coupon/ticket 엔드포인트를 사용하세요.
   *
   * Request Body의 type에 따라 발급되는 쿠폰의 종류가 결정됩니다.
   *
   * - type: 'public' - 공개 쿠폰 (쿠폰 코드 미입력. 클릭만으로 발급)
   *
   * 응답 결과로 받은 쿠폰은 실제 사용 가능한 쿠폰의 정보입니다.
   *
   * 발급된 쿠폰의 사용 기한은 쿠폰 정보의 만료 날짜(expiredAt)와 쿠폰의 만료 기간(expiredIn) 중 빠른 것을 선택합니다.
   *
   * ex) 현재 날짜: 2020-01-01 쿠폰 정보의 만료 날짜(expiredAt): 2020-01-31, 쿠폰의 만료 기간(expiredIn): 7일
   *
   * - 발급된 쿠폰의 사용 기한은 '2020-01-08'이 됩니다.
   *
   * - expiredAt과 expiredIn 둘 중 하나가 null인 경우, null이 아닌 값이 사용됩니다.
   *
   * - expiredAt과 expiredIn 둘 다 null인 경우, 쿠폰의 만료 기간은 무제한입니다.
   *
   * 쿠폰이 최대 발행수 이상 발행되면 409 예외를 반환합니다. (volume, volumePerCitizen)
   *
   * @tag coupon
   * @summary 쿠폰 발급 - Role('admin', 'manager')
   */
  @TypedRoute.Post('/')
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
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'invalid coupon code',
  })
  @TypedException<IErrorResponse<409>>({
    status: 409,
    description: 'Coupon limit exceeded',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async createPublicCouponTicket(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('couponId') couponId: Uuid,
    @TypedBody() body: Omit<CreatePublicCouponTicketDto, 'couponId'>,
  ): Promise<CouponTicketRelationsDto> {
    const couponTicket = await this.couponTicketService.createCouponTicket({
      ...body,
      couponId,
    });

    return couponTicketRelationsToDto(couponTicket);
  }

  /**
   * 특정 사용자에게 비공개 쿠폰을 발급합니다. (쿠폰 코드 필요)
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * 현재 사용자에게 쿠폰 발급을 원하면 v1/user/coupon/ticket 엔드포인트를 사용하세요.
   *
   * Request Body의 type에 따라 발급되는 쿠폰의 종류가 결정됩니다.
   *
   * - type: 'private' - 비공개 쿠폰 (쿠폰 번호 입력. 올바른 쿠폰 번호를 입력해야 발급)
   *
   * 응답 결과로 받은 쿠폰은 실제 사용 가능한 쿠폰의 정보입니다.
   *
   * 발급된 쿠폰의 사용 기한은 쿠폰 정보의 만료 날짜(expiredAt)와 쿠폰의 만료 기간(expiredIn) 중 빠른 것을 선택합니다.
   *
   * ex) 현재 날짜: 2020-01-01 쿠폰 정보의 만료 날짜(expiredAt): 2020-01-31, 쿠폰의 만료 기간(expiredIn): 7일
   *
   * - 발급된 쿠폰의 사용 기한은 '2020-01-08'이 됩니다.
   *
   * - expiredAt과 expiredIn 둘 중 하나가 null인 경우, null이 아닌 값이 사용됩니다.
   *
   * - expiredAt과 expiredIn 둘 다 null인 경우, 쿠폰의 만료 기간은 무제한입니다.
   *
   * 쿠폰이 최대 발행수 이상 발행되면 409 예외를 반환합니다. (volume, volumePerCitizen)
   *
   * @tag coupon
   * @summary 비공개 쿠폰 발급 - Role('admin', 'manager')
   */
  @TypedRoute.Post('/disposable')
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
    description: 'invalid coupon code',
  })
  @TypedException<IErrorResponse<409>>({
    status: 409,
    description: 'Coupon limit exceeded',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async createPrivateCouponTicket(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('couponId') couponId: Uuid,
    @TypedBody() body: Omit<CreatePrivateCouponTicketDto, 'couponId'>,
  ): Promise<CouponTicketRelationsDto> {
    const couponTicket = await this.couponTicketService.createCouponTicket({
      ...body,
      couponId,
    });

    return couponTicketRelationsToDto(couponTicket);
  }
}
