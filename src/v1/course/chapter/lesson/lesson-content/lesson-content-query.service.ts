import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  ILessonContent,
  ILessonContentWithFile,
} from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.interface';
import { LessonContentQueryRepository } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content-query.repository';
import { LessonContentHistoryRepository } from '@src/v1/course/chapter/lesson/lesson-content/history/lesson-content-history.repository';
import { LessonContentHistoryQueryRepository } from '@src/v1/course/chapter/lesson/lesson-content/history/lesson-content-history-query.repository';
import {
  ILessonContentHistory,
  ILessonContentWithHistory,
} from '@src/v1/course/chapter/lesson/lesson-content/history/lesson-content-history.interface';
import { IUserWithoutPassword } from '@src/v1/user/user.interface';
import { S3Service } from '@src/infra/s3/s3.service';

@Injectable()
export class LessonContentQueryService {
  constructor(
    private readonly lessonContentQueryRepository: LessonContentQueryRepository,
    private readonly lessonContentHistoryRepository: LessonContentHistoryRepository,
    private readonly lessonContentHistoryQueryRepository: LessonContentHistoryQueryRepository,
    private readonly s3Service: S3Service,
  ) {}

  async findLessonContents(
    where: Pick<ILessonContent, 'lessonId'>,
  ): Promise<ILessonContent[]> {
    return await this.lessonContentQueryRepository.findManyByLessonId(where);
  }

  async findLessonContentWithFileOrThrow(
    where: Pick<ILessonContent, 'id'>,
  ): Promise<ILessonContentWithFile> {
    const lessonContentWithFile =
      await this.lessonContentQueryRepository.findLessonContentWithFile(where);

    if (!lessonContentWithFile) {
      throw new NotFoundException('LessonContent not found');
    }

    return lessonContentWithFile;
  }

  async getLessonContentWithHistory(
    user: IUserWithoutPassword,
    where: Pick<ILessonContentHistory, 'lessonContentId'>,
  ): Promise<ILessonContentWithHistory> {
    const lessonContentSource = await this.findLessonContentWithFileOrThrow({
      id: where.lessonContentId,
    });

    const lessonContent =
      await this._replaceFileUrlToPreSignedUrl(lessonContentSource);

    if (user.role !== 'user') {
      return {
        ...lessonContent,
        history: null,
      };
    }

    const existHistory =
      await this.lessonContentHistoryQueryRepository.findLessonContentAccessHistory(
        {
          userId: user.id,
          lessonContentId: where.lessonContentId,
        },
      );

    const history =
      existHistory ??
      (await this.lessonContentHistoryRepository.createLessonContentHistory({
        userId: user.id,
        lessonContentId: where.lessonContentId,
      }));

    return {
      ...lessonContent,
      history,
    };
  }

  async getVideoLessonContentAccessCookies(
    user: IUserWithoutPassword,
    where: Pick<ILessonContentHistory, 'lessonContentId'>,
  ) {
    const lessonContentSource = await this.findLessonContentWithFileOrThrow({
      id: where.lessonContentId,
    });

    if (!lessonContentSource.fileId) {
      throw new InternalServerErrorException(
        'LessonContent has no file id. Cannot get access cookies.',
      );
    }

    const accessCookies = this.s3Service.getVideoPreSignedCookies(
      lessonContentSource.fileId,
    );

    return accessCookies;
  }

  private async _replaceFileUrlToPreSignedUrl(
    content: ILessonContentWithFile,
  ): Promise<ILessonContentWithFile> {
    if (!content.file) {
      return content;
    }

    switch (content.contentType) {
      case 'video':
        const videoUrl = this.s3Service.getVideoOutputCdnUrl(content.file.id); // CDN Url without pre-signed
        return {
          ...content,
          file: {
            ...content.file,
            url: videoUrl,
          },
        };

      case 'image':
      case 'file':
        const resourceUrl = await this.s3Service.getResourcePreSignedUrl(
          content.file.id,
          'private',
          'cdn',
        );
        return {
          ...content,
          file: {
            ...content.file,
            url: resourceUrl,
          },
        };

      case 'text':
      default:
        throw new InternalServerErrorException(
          `Not supported lesson content file type. ${content.contentType}`,
        );
    }
  }
}
