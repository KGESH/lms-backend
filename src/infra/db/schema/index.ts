import { userDbSchemas } from './user';
import { teacherDbSchema } from './teacher';
import { courseDbSchemas } from './course';
import { uiDbSchemas } from './ui';

export const dbSchema = {
  // 사용자 (일반 사용자, 관리자(매니저), 최고 관리자)
  ...userDbSchemas,
  // 강사 (강의, 전자책 판매자)
  ...teacherDbSchema,
  // 동영상 강의
  ...courseDbSchemas,
  // UI 빌더
  ...uiDbSchemas,
};
