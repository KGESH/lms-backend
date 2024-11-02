import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FileService } from '@src/v1/file/file.service';
import { IFile } from '@src/v1/file/file.interface';
import { FileQueryService } from '@src/v1/file/file-query.service';
import { checkVideoEncodingStatus } from '@src/shared/helpers/check-video-encoding';

import { MediaConvertStatus } from '@src/v1/file/media-convert/file-media-convert.constant';

@Injectable()
export class FileMediaConvertService {
  constructor(
    private readonly fileService: FileService,
    private readonly fileQueryService: FileQueryService,
  ) {}

  async updateVideoConvertStatus(
    where: Pick<IFile, 'id'>,
    updateStatus: MediaConvertStatus,
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

    return await this.fileService.updateFile(where, {
      metadata: updateStatus,
    });
  }
}
