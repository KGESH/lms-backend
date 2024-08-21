import { Controller, Logger, UseGuards } from '@nestjs/common';
import { S3Service } from '../../infra/s3/s3.service';
import { TypedHeaders, TypedParam, TypedRoute } from '@nestia/core';
import { PreSignedUrlDto } from './file.dto';
import { AuthHeaders } from '../auth/auth.headers';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';

@Controller('v1/file')
export class FileController {
  private readonly logger = new Logger(FileController.name);
  constructor(private readonly s3Service: S3Service) {}

  @TypedRoute.Post('/:key/pre-signed')
  @Roles('admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  async createPreSignedUrl(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('key') key: string,
  ): Promise<PreSignedUrlDto> {
    const url = await this.s3Service.createPreSignedUrl(key);
    this.logger.debug(`Created pre-signed URL for key ${key}: ${url}`);
    return { url };
  }
}
