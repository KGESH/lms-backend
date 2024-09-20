import { Controller, NotFoundException } from '@nestjs/common';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedRoute,
} from '@nestia/core';
import { AuthHeaders } from '@src/v1/auth/auth.headers';
import { UserCouponService } from '@src/v1/user/coupon/user-coupon.service';
import { SessionUser } from '@src/core/decorators/session-user.decorator';
import { ISessionWithUser } from '@src/v1/auth/session.interface';
import {
  CouponTicketRelationsDto,
  CouponTicketWithPaymentHistoryDto,
  CreatePrivateCouponTicketDto,
  CreatePublicCouponTicketDto,
} from '@src/v1/coupon/ticket/coupon-ticket.dto';
import {
  couponTicketPaymentHistoryToDto,
  couponTicketRelationsToDto,
} from '@src/shared/helpers/transofrm/coupon';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';

@Controller('v1/user/coupon/ticket')
export class UserCouponController {
  constructor(private readonly userCouponService: UserCouponService) {}

  /**
   * 현재 사용자가 사용 발급한 쿠폰 목록을 조회합니다.
   *
   * 현재 사용자의 세션 id를 헤더에 담아서 요청합니다.
   *
   * 응답받은 쿠폰 목록의 'payment' 필드는 해당 쿠폰의 사용 이력을 나타냅니다.
   *
   * 'payment' 필드가 null인 경우, 해당 쿠폰은 아직 사용되지 않았습니다.
   *
   * 'payment' 필드가 null이 아닌 경우, 해당 쿠폰은 사용되었습니다.
   *
   * @tag user
   * @summary 사용 가능한 쿠폰 목록 조회 - Role('user')
   */
  @TypedRoute.Get('/')
  async getUserCoupons(
    @TypedHeaders() headers: AuthHeaders,
    @SessionUser() session: ISessionWithUser,
  ): Promise<CouponTicketWithPaymentHistoryDto[]> {
    const couponTickets = await this.userCouponService.getUserCoupons({
      userId: session.userId,
    });

    return couponTickets.map(couponTicketPaymentHistoryToDto);
  }

  /**
   * 현재 세션 사용자에게 쿠폰을 발급합니다.
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
   * @tag user
   * @summary 사용 가능한 쿠폰 발급
   */
  @TypedRoute.Post('/')
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<403>>({
    status: 403,
    description: 'coupon expired',
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
  async issuePublicCouponTicket(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: Omit<CreatePublicCouponTicketDto, 'userId'>,
    @SessionUser() session: ISessionWithUser,
  ): Promise<CouponTicketRelationsDto> {
    const couponTicket = await this.userCouponService.issueCouponTicket({
      ...body,
      userId: session.userId,
    });

    return couponTicketRelationsToDto(couponTicket);
  }

  /**
   * 현재 세션 사용자에게 비공개 쿠폰을 발급합니다. (쿠폰 코드 필요)
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
   * @tag user
   * @summary 올바른 쿠폰 코드 입력시, 사용 가능한 쿠폰 발급
   */
  @TypedRoute.Post('/disposable')
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<403>>({
    status: 403,
    description: 'coupon expired',
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
  async issuePrivateCouponTicket(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody()
    body: Omit<CreatePrivateCouponTicketDto, 'userId' | 'couponId'>,
    @SessionUser() session: ISessionWithUser,
  ): Promise<CouponTicketRelationsDto> {
    const disposable = await this.userCouponService.findCouponDisposableByCode({
      code: body.code,
    });

    if (!disposable) {
      throw new NotFoundException('Invalid coupon code');
    }

    const couponTicket = await this.userCouponService.issueCouponTicket({
      ...body,
      userId: session.userId,
      couponId: disposable.couponId,
    });

    return couponTicketRelationsToDto(couponTicket);
  }
}
