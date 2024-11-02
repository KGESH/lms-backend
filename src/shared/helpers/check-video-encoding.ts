import { IFile } from '@src/v1/file/file.interface';
import { MEDIA_CONVERT_STATUS, MediaConvertStatus } from '@src/v1/file/media-convert/file-media-convert.constant';

/**
 * 비디오 파일의 인코딩 상태를 확인합니다.
 *
 * s3에 비디오 파일 업로드 성공 이후 파일 엔티티 생성시 반드시 'metadata' 필드를 'progressing'으로 설정해야 합니다.
 *
 * 파일 엔티티의 'metadata' 필드는 다음과 같은 값 중 하나를 가집니다.
 *
 * - 'progressing': 인코딩 중인 상태
 *
 * - 'done': 인코딩이 완료된 상태
 *
 * - 'error': 인코딩 중 오류가 발생한 상태
 */
export const checkVideoEncodingStatus = (file: IFile): MediaConvertStatus => {
  if (file.type !== 'video') {
    throw new Error('This file is not a video type.');
  }

  const status = file.metadata;

  switch (status) {
    case MEDIA_CONVERT_STATUS.DONE:
      return MEDIA_CONVERT_STATUS.DONE;

    case MEDIA_CONVERT_STATUS.PROGRESSING:
      return MEDIA_CONVERT_STATUS.PROGRESSING;

    case MEDIA_CONVERT_STATUS.ERROR:
      return MEDIA_CONVERT_STATUS.ERROR;

    default:
      throw new Error(`Unknown video encoding status: [${status}]`);
  }
};
