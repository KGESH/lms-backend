import { Inject, Injectable, Logger } from '@nestjs/common';
import { S3_CLIENT } from './s3.client';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigsService } from '@src/configs/configs.service';
import * as S3Signer from '@aws-sdk/s3-request-presigner';
import * as CloudfrontSigner from '@aws-sdk/cloudfront-signer';
import * as date from '@src/shared/utils/date';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);

  constructor(
    @Inject(S3_CLIENT) private readonly s3: S3Client,
    private readonly configsService: ConfigsService,
  ) {}

  getVideoPreSignedCookies(fileId: string) {
    const folderPath = new URL(
      fileId + '/*',
      this.configsService.env.AWS_VIDEO_CDN_BASE_URL,
    );
    this.logger.debug('[Folder Path]', folderPath);
    const expDate = date.addDate(
      new Date(),
      this.configsService.env.AWS_CDN_PRE_SIGNED_URL_VALID_DAYS_DURATION,
      'day',
      'date',
    );
    const policy = JSON.stringify({
      Statement: [
        {
          Resource: folderPath.href,
          Condition: {
            DateLessThan: {
              'AWS:EpochTime': expDate.getTime(),
            },
          },
        },
      ],
    });

    console.log('policy', policy);

    // Generate signed cookies
    return CloudfrontSigner.getSignedCookies({
      policy,
      keyPairId: this.configsService.env.AWS_CDN_PRE_SIGNED_URL_KEY_GROUP_ID,
      privateKey: this.configsService.env.AWS_CDN_PRE_SIGNED_URL_PRIVATE_KEY,
    });
  }

  /**
   * AWS S3 또는 CDN에 업로드된 파일의 Pre-signed URL을 반환합니다.
   * 주의사항: 강의 동영상 파일은 'getVideoSourcePreSignedUrl' 또는 'getVideoOutputPreSignedUrl' 메서드를 사용해야합니다.
   */
  async getResourcePreSignedUrl(
    fileId: string,
    access: 'public' | 'private',
    from: 's3' | 'cdn' = 'cdn',
  ): Promise<string> {
    if (from === 's3') {
      return this._getS3PreSignedUrl(fileId, access);
    } else {
      return this._getCdnPreSignedUrl(fileId, access);
    }
  }

  private async _getS3PreSignedUrl(
    fileId: string,
    access: 'public' | 'private',
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket:
        access === 'public'
          ? this.configsService.env.AWS_S3_BUCKET
          : this.configsService.env.AWS_S3_PRIVATE_BUCKET,
      Key: fileId,
    });

    const url = await S3Signer.getSignedUrl(this.s3, command, {
      expiresIn: this.configsService.env.AWS_S3_PRESIGNED_URL_EXPIRE_SECONDS,
    });

    return url;
  }

  private _getCdnPreSignedUrl(fileId: string, access: 'public' | 'private') {
    const cdnBaseUrl =
      access === 'public'
        ? this.configsService.env.AWS_PUBLIC_RESOURCE_CDN_BASE_URL
        : this.configsService.env.AWS_PRIVATE_RESOURCE_CDN_BASE_URL;
    const cdnFileUrl = new URL(fileId, cdnBaseUrl).href;
    const expDate = date.endOf(
      date.addDate(
        new Date(),
        this.configsService.env.AWS_CDN_PRE_SIGNED_URL_VALID_DAYS_DURATION,
        'day',
        'date',
      ),
      'day',
      'date',
    );

    const url = CloudfrontSigner.getSignedUrl({
      url: cdnFileUrl,
      dateLessThan: date.format(expDate, 'YYYY-MM-DD'),
      keyPairId: this.configsService.env.AWS_CDN_PRE_SIGNED_URL_KEY_GROUP_ID,
      privateKey: this.configsService.env.AWS_CDN_PRE_SIGNED_URL_PRIVATE_KEY,
    });

    return url;
  }

  async createPreSignedUrl(
    fileId: string,
    access: 'public' | 'private' = 'public',
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket:
        access === 'public'
          ? this.configsService.env.AWS_S3_BUCKET
          : this.configsService.env.AWS_S3_PRIVATE_BUCKET,
      Key: fileId,
    });

    const url = await S3Signer.getSignedUrl(this.s3, command, {
      expiresIn: this.configsService.env.AWS_S3_PRESIGNED_URL_EXPIRE_SECONDS,
    });

    return url;
  }

  getVideoOutputCdnUrl(fileId: string): string {
    const cdnFileUrl = new URL(
      fileId,
      this.configsService.env.AWS_VIDEO_CDN_BASE_URL,
    );
    return cdnFileUrl.href;
  }

  /**
   * CDN에 업로드된 동영상 파일의 Pre-signed URL을 반환합니다. (.m3u8 해상도 변환된 동영상)
   */
  getVideoOutputPreSignedUrl(fileId: string): string {
    const cdnFileUrl = this.getVideoOutputCdnUrl(fileId);
    const expDate = date.endOf(
      date.addDate(
        new Date(),
        this.configsService.env.AWS_CDN_PRE_SIGNED_URL_VALID_DAYS_DURATION,
        'day',
        'date',
      ),
      'day',
      'date',
    );

    const url = CloudfrontSigner.getSignedUrl({
      url: cdnFileUrl,
      dateLessThan: date.format(expDate, 'YYYY-MM-DD'),
      keyPairId: this.configsService.env.AWS_CDN_PRE_SIGNED_URL_KEY_GROUP_ID,
      privateKey: this.configsService.env.AWS_CDN_PRE_SIGNED_URL_PRIVATE_KEY,
    });

    return url;
  }

  /**
   * S3 동영상 input 버킷에 업로드된 파일의 Pre-signed URL을 반환합니다. (원본 동영상)
   */
  async getVideoSourcePreSignedUrl(fileId: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.configsService.env.AWS_S3_VIDEO_INPUT_BUCKET,
      Key: fileId,
    });

    const url = await S3Signer.getSignedUrl(this.s3, command, {
      expiresIn: this.configsService.env.AWS_S3_PRESIGNED_URL_EXPIRE_SECONDS,
    });

    return url;
  }

  async createVideoPreSignedUrl(fileId: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.configsService.env.AWS_S3_VIDEO_INPUT_BUCKET,
      Key: fileId,
    });

    const url = await S3Signer.getSignedUrl(this.s3, command, {
      expiresIn: this.configsService.env.AWS_S3_PRESIGNED_URL_EXPIRE_SECONDS,
    });

    return url;
  }
}
