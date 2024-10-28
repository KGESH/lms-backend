import { FileType, ISO8601, Uri, Uuid } from '@src/shared/types/primitive';
import { MEDIA_CONVERT_STATUS } from '@src/v1/file/media-convert/file-media-convert.constant';

export type MediaConvertStatus =
  (typeof MEDIA_CONVERT_STATUS)[keyof typeof MEDIA_CONVERT_STATUS];

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

export type FileBaseDto = {
  /**
   * 파일 ID. (pre-signed URL 생성시 사용한 파일 ID)
   */
  id: Uuid;

  /**
   * S3에 업로드된 파일의 url. (pre-signed URL)
   */
  url: Uri;

  /**
   * 파일의 이름.
   */
  filename: string;

  /**
   * 파일의 생성 시간.
   */
  createdAt: ISO8601;

  /**
   * 파일의 수정 시간.
   */
  updatedAt: ISO8601;

  /**
   * 파일의 삭제 시간.
   */
  deletedAt: ISO8601 | null;
};

export type ImageFileDto = FileBaseDto & {
  /**
   * 파일의 타입 입니다.
   */
  type: Extract<FileType, 'image'>;

  /**
   * 파일의 메타데이터.
   */
  metadata: string | null;
};

export type VideoFileDto = FileBaseDto & {
  /**
   * 파일의 타입 입니다.
   */
  type: Extract<FileType, 'video'>;

  /**
   * 파일의 메타데이터.
   */
  metadata: MediaConvertStatus;
};

export type TextFileDto = FileBaseDto & {
  /**
   * 파일의 타입 입니다.
   */
  type: Extract<FileType, 'text'>;

  /**
   * 파일의 메타데이터.
   */
  metadata: string | null;
};

export type DefaultFileDto = FileBaseDto & {
  /**
   * 파일의 타입 입니다.
   */
  type: Extract<FileType, 'file'>;

  /**
   * 파일의 메타데이터.
   */
  metadata: string | null;
};

export type FileDto =
  | DefaultFileDto
  | ImageFileDto
  | TextFileDto
  | VideoFileDto;

export type CreateFileDto = Omit<
  FileDto,
  'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type UpdateFileDto = Partial<
  Omit<FileDto, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
>;

export type DeleteFileDto = Pick<FileDto, 'id'>;
