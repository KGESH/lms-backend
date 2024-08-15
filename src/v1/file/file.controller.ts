import { Controller, Logger } from '@nestjs/common';
import { S3Service } from '../../infra/s3/s3.service';
import { TypedParam, TypedRoute } from '@nestia/core';
import { PreSignedUrlDto } from './file.dto';

@Controller('v1/file')
export class FileController {
  private readonly logger = new Logger(FileController.name);
  constructor(private readonly s3Service: S3Service) {}

  @TypedRoute.Post('/:key/pre-signed')
  async createPreSignedUrl(
    @TypedParam('key') key: string,
  ): Promise<PreSignedUrlDto> {
    const url = await this.s3Service.createPreSignedUrl(key);
    this.logger.debug(`Created pre-signed URL for key ${key}: ${url}`);
    return { url };
  }
}
