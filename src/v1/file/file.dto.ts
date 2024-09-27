import { FileType, ISO8601, Uri, Uuid } from '@src/shared/types/primitive';

export type PreSignedUrlDto = {
  url: Uri;
};

export type FilePreSignedUrlDto = {
  fileId: Uuid;
  filename: string;
  url: Uri;
};

export type CreatePreSignedUrlDto = Pick<
  FilePreSignedUrlDto,
  'fileId' | 'filename'
>;

export type FileDto = {
  /**
   * 파일 ID. (pre-signed URL 생성시 사용한 파일 ID)
   */
  id: Uuid;

  /**
   * S3에 업로드된 파일의 url. (pre-signed URL)
   */
  url: Uri;

  /**
   * 파일의 타입 입니다.
   */
  type: FileType;

  /**
   * 파일의 이름.
   */
  filename: string | null;

  /**
   * 파일의 메타데이터.
   */
  metadata: string | null;

  /**
   * 파일의 생성 시간.
   */
  createdAt: ISO8601;
};

export type CreateFileDto = Omit<FileDto, 'createdAt'>;
