import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FileService } from '@src/v1/file/file.service';
import { IFile } from '@src/v1/file/file.interface';
import { ConfigsService } from '@src/configs/configs.service';
import { FileQueryService } from '@src/v1/file/file-query.service';
import { checkVideoEncodingStatus } from '@src/shared/helpers/check-video-encoding';
import { MEDIA_CONVERT_STATUS } from '@src/v1/file/media-convert/file-media-convert.constant';

@Injectable()
export class FileMediaConvertService {
  constructor(
    private readonly fileService: FileService,
    private readonly fileQueryService: FileQueryService,
    private readonly configsService: ConfigsService,
  ) {}

  async updateVideoUrlToCdn(
    where: Pick<IFile, 'id'>,
    fileKey: string,
  ): Promise<IFile> {
    const file = await this.fileQueryService.findFile(where);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const status = checkVideoEncodingStatus(file);

    if (status === 'done') {
      throw new ConflictException(
        `This video file is already uploaded to CDN. File ID: [${file.id}]`,
      );
    }

    const fileCdnUrl = new URL(
      fileKey,
      this.configsService.env.AWS_VIDEO_CDN_BASE_URL,
    );

    return await this.fileService.updateFile(where, {
      url: fileCdnUrl.href,
      metadata: MEDIA_CONVERT_STATUS.DONE,
    });
  }
}
