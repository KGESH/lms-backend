import { userDbSchemas } from './user';
import { courseDbSchemas } from './course';
import { uiDbSchemas } from './ui';
import { orderDbSchema } from './order';
import { reviewDbSchema } from './review';
import { teacherDbSchema } from './teacher';
import { ebookDbSchema } from './ebook';

export const dbSchema = {
  // 사용자 (일반 사용자, 관리자(매니저), 최고 관리자)
  ...userDbSchemas,

  //   // 강사 (강의, 전자책 판매자)
  ...teacherDbSchema,

  // 동영상 강의
  ...courseDbSchemas,

  // 전자책
  ...ebookDbSchema,

  // 강의 상품 주문
  ...orderDbSchema,

  // 리뷰
  ...reviewDbSchema,

  // UI 빌더
  ...uiDbSchemas,
};
