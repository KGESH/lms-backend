import { Controller, Logger, UseGuards } from '@nestjs/common';
import { TypedBody, TypedHeaders, TypedParam, TypedRoute } from '@nestia/core';
import { S3Service } from '@src/infra/s3/s3.service';
import {
  CreateFileDto,
  CreatePreSignedUrlDto,
  FileDto,
  FilePreSignedUrlDto,
  PreSignedUrlDto,
} from '@src/v1/file/file.dto';
import { AuthHeaders } from '@src/v1/auth/auth.headers';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { FileService } from '@src/v1/file/file.service';
import * as date from '@src/shared/utils/date';
import { fileToDto } from '@src/shared/helpers/transofrm/file';

@Controller('v1/file')
export class FileController {
  private readonly logger = new Logger(FileController.name);
  constructor(
    private readonly s3Service: S3Service,
    private readonly fileService: FileService,
  ) {}

  /**
   * 파일 엔티티 목록을 생성합니다.
   *
   * pre-signed URL을 사용한 파일 업로드 성공 이후 호출해야합니다.
   *
   * @tag file
   * @summary 파일 엔티티 목록을 생성
   */
  @TypedRoute.Post('/')
  @Roles('user', 'admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  async createFiles(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreateFileDto[],
  ): Promise<FileDto[]> {
    const files = await this.fileService.createManyFiles(body);

    return files.map(fileToDto);
  }

  /**
   * 파일 업로드를 위한 pre-signed URL 목록을 생성합니다.
   *
   * @tag file
   * @summary pre-signed URL 목록 생성.
   */
  @TypedRoute.Post('/pre-signed')
  @Roles('user', 'admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  async createPreSignedUrls(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreatePreSignedUrlDto[],
  ): Promise<FilePreSignedUrlDto[]> {
    const preSignedUrls = await this.fileService.createPreSignedUrls(
      body.map((params) => ({
        ...params,
        id: params.fileId,
      })),
    );

    return preSignedUrls.map((preSignedUrl) => ({
      fileId: preSignedUrl.id,
      filename: preSignedUrl.filename,
      url: preSignedUrl.url,
    }));
  }

  /**
   * 파일 업로드를 위한 pre-signed URL을 생성합니다.
   *
   * @tag file
   * @summary pre-signed URL 생성.
   */
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
