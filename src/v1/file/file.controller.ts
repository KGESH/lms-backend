import { Controller, Logger, UseGuards } from '@nestjs/common';
import { TypedBody, TypedHeaders, TypedParam, TypedRoute } from '@nestia/core';
import { S3Service } from '@src/infra/s3/s3.service';
import {
  CreateFileDto,
  CreatePreSignedUrlDto,
  DeleteFileDto,
  FileDto,
  FilePreSignedUrlDto,
  PreSignedUrlDto,
  UpdateFileDto,
} from '@src/v1/file/file.dto';
import { AuthHeaders } from '@src/v1/auth/auth.headers';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { FileService } from '@src/v1/file/file.service';
import { fileToDto } from '@src/shared/helpers/transofrm/file';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { SkipApiGuard } from '@src/core/decorators/skip-api.decorator';

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
   * 파일 엔티티 목록을 생성합니다.
   *
   * pre-signed URL을 사용한 파일 업로드 성공 이후 호출해야합니다.
   *
   * @tag file
   * @summary 파일 엔티티 목록을 생성
   */
  @TypedRoute.Patch('/:fileId')
  @Roles('user', 'admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  async updateFile(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('fileId') fileId: FileDto['id'],
    @TypedBody() body: UpdateFileDto,
  ): Promise<FileDto> {
    const file = await this.fileService.updateFile({ id: fileId }, body);

    return fileToDto(file);
  }

  /**
   * 파일 엔티티 목록을 삭제합니다.
   *
   * Soft delete로 구현되어 있습니다.
   *
   * deletedAt 필드에 삭제 시간이 기록된 엔티티는 batch job을 통해 추후 삭제됩니다.
   *
   * @tag file
   * @summary 파일 엔티티 목록을 삭제
   */
  @TypedRoute.Delete('/')
  @Roles('user', 'admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  async deleteFiles(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: DeleteFileDto[],
  ): Promise<FileDto['id'][]> {
    const fileIds = body.map(({ id }) => id);
    const deletedIds =
      await this.fileService.softDeleteManyFilesOrRollback(fileIds);

    return deletedIds;
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
      'public',
    );

    return preSignedUrls.map((preSignedUrl) => ({
      fileId: preSignedUrl.id,
      filename: preSignedUrl.filename,
      url: preSignedUrl.url,
    }));
  }

  /**
   * 비공개 파일 업로드를 위한 pre-signed URL 목록을 생성합니다.
   *
   * @tag file
   * @summary pre-signed URL 목록 생성.
   */
  @TypedRoute.Post('/private/pre-signed')
  @Roles('user', 'admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  async createPrivatePreSignedUrls(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreatePreSignedUrlDto[],
  ): Promise<FilePreSignedUrlDto[]> {
    const preSignedUrls = await this.fileService.createPreSignedUrls(
      body.map((params) => ({
        ...params,
        id: params.fileId,
      })),
      'private',
    );

    return preSignedUrls.map((preSignedUrl) => ({
      fileId: preSignedUrl.id,
      filename: preSignedUrl.filename,
      url: preSignedUrl.url,
    }));
  }

  /**
   * 비공개 비디오 업로드를 위한 pre-signed URL 목록을 생성합니다.
   *
   * 생성된 pre-signed URL을 사용하여 비디오 업로드가 완료되면 해상도 변환 작업이 시작됩니다. (lambda trigger)
   *
   * @tag file
   * @summary 비디오 전용 pre-signed URL 목록 생성.
   */
  @TypedRoute.Post('/private/pre-signed/video')
  @SkipAuth()
  @SkipApiGuard()
  @Roles('admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  async createPrivateVideoPreSignedUrls(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreatePreSignedUrlDto[],
  ): Promise<FilePreSignedUrlDto[]> {
    const preSignedUrls = await this.fileService.createVideoPreSignedUrl(
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
   * 비공개 파일 다운로드를 위한 pre-signed URL을 조회합니다.
   *
   * 파일 ID를 통해 조회합니다.
   *
   * URL의 만료 시간은 **30**분 입니다.
   *
   * @tag file
   * @summary 비공개 파일 다운로드 pre-signed URL 조회.
   */
  @TypedRoute.Get('/private/pre-signed/:fileId')
  @Roles('user', 'admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  async getPrivatePreSignedUrl(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('fileId') fileId: string,
  ): Promise<FilePreSignedUrlDto> {
    const preSignedUrl = await this.s3Service.getPreSignedUrl(
      fileId,
      'private',
    );

    return {
      fileId,
      filename: fileId,
      url: preSignedUrl,
    };
  }

  /**
   * 파일 업로드를 위한 pre-signed URL을 생성합니다.
   *
   * @tag file
   * @summary pre-signed URL 생성.
   * @deprecated Use createPreSignedUrls instead.
   */
  @TypedRoute.Post('/pre-signed/:fileId')
  @Roles('user', 'admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  async createPreSignedUrl(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('fileId') fileId: string,
  ): Promise<PreSignedUrlDto> {
    const url = await this.s3Service.createPreSignedUrl(fileId, 'public');
    this.logger.debug(`Created pre-signed URL for fileId ${fileId}: ${url}`);
    return { url };
  }
}
