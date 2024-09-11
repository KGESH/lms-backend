import { Controller, Logger, UseGuards } from '@nestjs/common';
import { TypedHeaders, TypedParam, TypedRoute } from '@nestia/core';
import { S3Service } from '@src/infra/s3/s3.service';
import { PreSignedUrlDto } from '@src/v1/file/file.dto';
import { AuthHeaders } from '@src/v1/auth/auth.headers';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';

@Controller('v1/file')
export class FileController {
  private readonly logger = new Logger(FileController.name);
  constructor(private readonly s3Service: S3Service) {}

  @TypedRoute.Post('/:key/pre-signed')
  @Roles('user', 'admin', 'manager', 'teacher')
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
