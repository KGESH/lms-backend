/**
 * Next 백엔드에서 Nest 백엔드 API 요청시 헤더에 LmsSecret 필드가 없을 경우.
 */
export const INVALID_LMS_SECRET = 486 as const;

export type INVALID_LMS_SECRET = typeof INVALID_LMS_SECRET;
