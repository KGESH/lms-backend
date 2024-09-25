import { FileType, ISO8601, Uri, Uuid } from '@src/shared/types/primitive';

export type ProductThumbnailDto = {
  /**
   * 프론트엔드에서 업로드시 사용한 파일의 ID
   */
  id: Uuid;

  /**
   * 파일 URL
   */
  url: Uri;

  /**
   * 파일 타입
   * */
  type: FileType;

  /**
   * 파일 메타데이터
   */
  metadata: string | null;

  /**
   * DB 저장 시간
   */
  createdAt: ISO8601;
};
