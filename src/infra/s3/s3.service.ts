import { Inject, Injectable, Logger } from '@nestjs/common';
import { S3_CLIENT } from './s3.client';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigsService } from '@src/configs/configs.service';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { HttpClientService } from '../http/http-client.service';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);

  constructor(
    @Inject(S3_CLIENT) private readonly s3: S3Client,
    private readonly configsService: ConfigsService,
    private readonly http: HttpClientService,
  ) {}

  async getPreSignedUrl(
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

    const url = await getSignedUrl(this.s3, command, {
      expiresIn: this.configsService.env.AWS_S3_PRESIGNED_URL_EXPIRE_SECONDS,
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

    const url = await getSignedUrl(this.s3, command, {
      expiresIn: this.configsService.env.AWS_S3_PRESIGNED_URL_EXPIRE_SECONDS,
    });

    return url;
  }

  async getVideoSourcePreSignedUrl(fileId: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.configsService.env.AWS_S3_VIDEO_INPUT_BUCKET,
      Key: fileId,
    });

    const url = await getSignedUrl(this.s3, command, {
      expiresIn: this.configsService.env.AWS_S3_PRESIGNED_URL_EXPIRE_SECONDS,
    });

    return url;
  }

  async createVideoPreSignedUrl(fileId: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.configsService.env.AWS_S3_VIDEO_INPUT_BUCKET,
      Key: fileId,
    });

    const url = await getSignedUrl(this.s3, command, {
      expiresIn: this.configsService.env.AWS_S3_PRESIGNED_URL_EXPIRE_SECONDS,
    });

    return url;
  }
}
