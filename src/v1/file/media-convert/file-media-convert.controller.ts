import { Controller, Logger, Sse, MessageEvent, Body } from '@nestjs/common';
import { SwaggerExample, TypedHeaders, TypedRoute } from '@nestia/core';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Observable, fromEvent, map } from 'rxjs';
import * as typia from 'typia';
import { SkipApiGuard } from '@src/core/decorators/skip-api.decorator';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { ApiAuthHeaders } from '@src/v1/auth/auth.headers';
import {
  MediaConvertDoneDto,
  MediaConvertDoneNoticeDto,
} from '@src/v1/file/media-convert/file-media-convert.dto';
import {
  MEDIA_CONVERT_DONE_EVENT,
  MEDIA_CONVERT_STATUS,
  SEND_MEDIA_CONVERT_DONE_EVENT,
} from '@src/v1/file/media-convert/file-media-convert.constant';
import { FileMediaConvertService } from '@src/v1/file/media-convert/file-media-convert.service';
import { VideoFileDto } from '@src/v1/file/file.dto';
import { fileToDto } from '@src/shared/helpers/transofrm/file';

@Controller('v1/file/media-convert')
export class FileMediaConvertController {
  private readonly logger = new Logger(FileMediaConvertController.name);
  constructor(
    private readonly fileMediaConvertService: FileMediaConvertService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * AWS media convert 작업이 완료되면 트리거되는 웹훅입니다.
   *
   * 동영상 변환 작업이 완료되면 해당 파일의 여러 해상도 동영상이 s3 output 버킷에 저장 됩니다.
   *
   * 관리자에게 변환 완료 알림을 전송합니다.
   *
   * AWS lambda 에서 전달받는 Body 타입은 다음과 같습니다.
   * {
   *   "version": "0",
   *   "id": "dd6dc4c5-07b1-2a92-135a-141ab46df7f5",
   *   "detail-type": "MediaConvert Job State Change",
   *   "source": "aws.mediaconvert",
   *   "account": "912305628761",
   *   "time": "2024-10-28T06:11:06Z",
   *   "region": "ap-northeast-2",
   *   "resources": [
   *     "arn:aws:mediaconvert:ap-northeast-2:912305628761:jobs/1730095815875-vkiqh5"
   *   ],
   *   "detail": {
   *     "timestamp": 1730095866867,
   *     "accountId": "912305628761",
   *     "queue": "arn:aws:mediaconvert:ap-northeast-2:912305628761:queues/Default",
   *     "jobId": "1730095815875-vkiqh5",
   *     "status": "COMPLETE",
   *     "userMetadata": {},
   *     "outputGroupDetails": [
   *       {
   *         "outputDetails": [
   *           {
   *             "outputFilePaths": [
   *               "s3://gal-video-output/997b1b3b-3b7b-4b3b-8b3b-3b7b1b3b7b3b480x270.m3u8"
   *             ],
   *             "durationInMs": 170840,
   *             "videoDetails": {
   *               "widthInPx": 480,
   *               "heightInPx": 270,
   *               "averageBitrate": 220046,
   *               "qvbrAvgQuality": 6.89,
   *               "qvbrMinQuality": 5,
   *               "qvbrMaxQuality": 7,
   *               "qvbrMinQualityLocation": 164600,
   *               "qvbrMaxQualityLocation": 1520
   *             }
   *           },
   *           {
   *             "outputFilePaths": [
   *               "s3://gal-video-output/997b1b3b-3b7b-4b3b-8b3b-3b7b1b3b7b3b720x480.m3u8"
   *             ],
   *             "durationInMs": 170840,
   *             "videoDetails": {
   *               "widthInPx": 720,
   *               "heightInPx": 480,
   *               "averageBitrate": 578630,
   *               "qvbrAvgQuality": 8.46,
   *               "qvbrMinQuality": 7,
   *               "qvbrMaxQuality": 9,
   *               "qvbrMinQualityLocation": 29280,
   *               "qvbrMaxQualityLocation": 5880
   *             }
   *           },
   *           {
   *             "outputFilePaths": [
   *               "s3://gal-video-output/997b1b3b-3b7b-4b3b-8b3b-3b7b1b3b7b3b1280x720.m3u8"
   *             ],
   *             "durationInMs": 170840,
   *             "videoDetails": {
   *               "widthInPx": 1280,
   *               "heightInPx": 720,
   *               "averageBitrate": 1607070,
   *               "qvbrAvgQuality": 9.43,
   *               "qvbrMinQuality": 7,
   *               "qvbrMaxQuality": 10,
   *               "qvbrMinQualityLocation": 164000,
   *               "qvbrMaxQualityLocation": 8000
   *             }
   *           },
   *           {
   *             "outputFilePaths": [
   *               "s3://gal-video-output/997b1b3b-3b7b-4b3b-8b3b-3b7b1b3b7b3b1920x1080.m3u8"
   *             ],
   *             "durationInMs": 170840,
   *             "videoDetails": {
   *               "widthInPx": 1920,
   *               "heightInPx": 1080,
   *               "averageBitrate": 3654435,
   *               "qvbrAvgQuality": 9.86,
   *               "qvbrMinQuality": 7.33,
   *               "qvbrMaxQuality": 10,
   *               "qvbrMinQualityLocation": 163920,
   *               "qvbrMaxQualityLocation": 2880
   *             }
   *           }
   *         ],
   *         "playlistFilePaths": [
   *           "s3://gal-video-output/997b1b3b-3b7b-4b3b-8b3b-3b7b1b3b7b3b.m3u8"
   *         ],
   *         "type": "HLS_GROUP"
   *       }
   *     ],
   *     "paddingInserted": 0,
   *     "blackVideoDetected": 0,
   *     "warnings": [
   *       {
   *         "code": 230001,
   *         "count": 1
   *       },
   *       {
   *         "code": 230005,
   *         "count": 1
   *       }
   *     ]
   *   }
   * }
   *
   * @tag file
   * @summary 동영상 변환 완료 웹훅
   */
  @TypedRoute.Post('/webhook')
  @SkipAuth()
  async mediaConvertWebhook(
    @TypedHeaders() headers: ApiAuthHeaders,
    @Body() body: Record<string, unknown>,
  ) {
    this.logger.log('Media convert webhook triggered.', body);

    const payload: MediaConvertDoneDto = body;

    this.eventEmitter.emit(MEDIA_CONVERT_DONE_EVENT, payload);
  }

  @OnEvent(MEDIA_CONVERT_DONE_EVENT)
  async onMediaConvertDone(payload: MediaConvertDoneDto) {
    this.logger.log('Media convert done event triggered.', payload);
    const data = typia.assert<MediaConvertDoneDto>(payload);
    const playlistFilePath = typia.assert<string>(
      data.detail.outputGroupDetails[0].playlistFilePaths[0],
    );
    const fileKey = typia.assert<string>(playlistFilePath.split('/').pop());
    const [fileId, extension] = fileKey.split('.');

    this.logger.debug('Media convert done event fileKey.', fileKey);
    this.logger.debug('Media convert done event fileId.', fileId);
    this.logger.debug('Media convert done event extension.', extension);

    const updatedFile =
      await this.fileMediaConvertService.updateVideoConvertStatus(
        { id: fileId },
        'done',
      );
    this.logger.debug('Media convert done. updatedFile: ', updatedFile);

    this.eventEmitter.emit(
      SEND_MEDIA_CONVERT_DONE_EVENT,
      fileToDto(updatedFile),
    );
  }

  /**
   * 관리자에게 변환 완료 알림을 전송합니다.
   *
   * SSE (Server-Sent Events) 를 통해 변환 완료 알림을 전송합니다.
   *
   * 클라이언트에서 이벤트를 수신하려면 다음과 같이 구독하세요.
   *
   * const eventSource = new EventSource(`${BACKEND_URL}/v1/file/media-convert/sse`);
   *
   * eventSource.onmessage = (event) => {
   *
   *  console.log(event);
   *
   *  eventSource.close();
   *
   *  // eventSource.close() 를 호출하여 연결을 종료합니다.
   *
   *  }
   *
   *
   * @tag file
   * @summary 동영상 변환 완료 SSE
   */
  @Sse('/sse')
  @SkipApiGuard()
  @SkipAuth()
  @SwaggerExample.Response({
    data: {
      id: 'Uuid',
      filename: 'string',
      type: 'video',
      metadata: `${MEDIA_CONVERT_STATUS.PROGRESSING} | ${MEDIA_CONVERT_STATUS.DONE} | ${MEDIA_CONVERT_STATUS.ERROR}`,
      finishedAt: 'ISO8601',
    },
  })
  mediaConvertCompleteSse(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, SEND_MEDIA_CONVERT_DONE_EVENT).pipe(
      map((data) => {
        this.logger.log('Media convert done SSE triggered.', data);
        const fileDto = typia.assert<VideoFileDto>(data);
        return fileDto;
      }),
      map((fileDto) => {
        const data: MediaConvertDoneNoticeDto = {
          id: fileDto.id,
          filename: fileDto.filename,
          type: fileDto.type,
          metadata: fileDto.metadata,
          finishedAt: fileDto.updatedAt,
        };
        return { data } satisfies MessageEvent;
      }),
    );
  }
}
