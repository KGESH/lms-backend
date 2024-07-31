import { Inject, Injectable, Logger } from '@nestjs/common';
import { S3_CLIENT } from './s3.client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigsService } from '../../configs/configs.service';
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

  async createPreSignedUrl(key: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.configsService.env.AWS_S3_BUCKET,
      Key: key,
    });

    const url = await getSignedUrl(this.s3, command, {
      expiresIn: this.configsService.env.AWS_S3_PRESIGNED_URL_EXPIRE_SECONDS,
    });

    return url;
  }

  async upload(key: string, data: any) {
    try {
      const url = await this.createPreSignedUrl(key);
      return await this.http.put(url, data);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
