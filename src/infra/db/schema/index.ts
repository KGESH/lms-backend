import { userDbSchemas } from './user';
import { courseDbSchemas } from './course';
import { uiDbSchemas } from './ui';
import { orderDbSchema } from './order';
import { reviewDbSchema } from './review';
import { teacherDbSchema } from './teacher';
import { ebookDbSchema } from './ebook';
import { postDbSchemas } from './post';
import { mockReviewDbSchema } from './mock-review';
import { couponDbSchema } from './coupon';
import { termDbSchema } from './term';
import { fileDbSchemas } from './file';
import { otpDbSchemas } from './otp';
import { promoDbSchema } from './promo';
import { policyDbSchema } from '@src/infra/db/schema/policy';

export const dbSchema = {
  // 사용자 (일반 사용자, 관리자(매니저), 최고 관리자)
  ...userDbSchemas,

  // 강사 (강의, 전자책 판매자)
  ...teacherDbSchema,

  // 동영상 강의
  ...courseDbSchemas,

  // 전자책
  ...ebookDbSchema,

  // 강의 상품 주문
  ...orderDbSchema,

  // 리뷰
  ...reviewDbSchema,

  // 게시글
  ...postDbSchemas,

  // UI 빌더
  ...uiDbSchemas,

  // Mock 리뷰
  ...mockReviewDbSchema,

  // 쿠폰
  ...couponDbSchema,

  // 약관
  ...termDbSchema,

  // 이용 정책
  ...policyDbSchema,

  // 파일
  ...fileDbSchemas,

  // OTP
  ...otpDbSchemas,

  // 프로모션 페이지
  ...promoDbSchema,
};
