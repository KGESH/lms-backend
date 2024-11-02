import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EbookContentQueryRepository } from '@src/v1/ebook/ebook-content/ebook-content-query.repository';
import {
  IEbookContent,
  IEbookContentWithFile,
} from '@src/v1/ebook/ebook-content/ebook-content.interface';
import { IUserWithoutPassword } from '@src/v1/user/user.interface';
import {
  IEbookContentHistory,
  IEbookContentWithHistory,
} from '@src/v1/ebook/ebook-content/history/ebook-content-history.interface';
import { EbookContentHistoryQueryRepository } from '@src/v1/ebook/ebook-content/history/ebook-content-history-query.repository';
import { EbookContentHistoryRepository } from '@src/v1/ebook/ebook-content/history/ebook-content-history.repository';
import { S3Service } from '@src/infra/s3/s3.service';

@Injectable()
export class EbookContentQueryService {
  constructor(
    private readonly ebookContentQueryRepository: EbookContentQueryRepository,
    private readonly ebookContentHistoryRepository: EbookContentHistoryRepository,
    private readonly ebookContentHistoryQueryRepository: EbookContentHistoryQueryRepository,
    private readonly s3Service: S3Service,
  ) {}

  async findEbookContents(
    where: Pick<IEbookContent, 'ebookId'>,
  ): Promise<IEbookContent[]> {
    return await this.ebookContentQueryRepository.findEbookContents(where);
  }

  async findEbookContentWithFileOrThrow(
    where: Pick<IEbookContent, 'id'>,
  ): Promise<IEbookContentWithFile> {
    const ebookContentWithFile =
      await this.ebookContentQueryRepository.findEbookContentWithFile(where);

    if (!ebookContentWithFile) {
      throw new NotFoundException('EbookContent not found');
    }

    return ebookContentWithFile;
  }

  async getEbookContentWithHistory(
    user: IUserWithoutPassword,
    where: Pick<IEbookContentHistory, 'ebookContentId'>,
  ): Promise<IEbookContentWithHistory> {
    const ebookContentSource = await this.findEbookContentWithFileOrThrow({
      id: where.ebookContentId,
    });

    const ebookContent =
      await this._replaceFileUrlToPreSignedUrl(ebookContentSource);

    if (user.role !== 'user') {
      return {
        ...ebookContent,
        history: null,
      };
    }

    const existHistory =
      await this.ebookContentHistoryQueryRepository.findEbookContentAccessHistory(
        {
          userId: user.id,
          ebookContentId: where.ebookContentId,
        },
      );

    const history =
      existHistory ??
      (await this.ebookContentHistoryRepository.createEbookContentHistory({
        userId: user.id,
        ebookContentId: where.ebookContentId,
      }));

    return {
      ...ebookContent,
      history,
    };
  }

  private async _replaceFileUrlToPreSignedUrl(
    content: IEbookContentWithFile,
  ): Promise<IEbookContentWithFile> {
    if (!content.file) {
      return content;
    }

    switch (content.contentType) {
      case 'image':
      case 'file':
        const resourceUrl = await this.s3Service.getResourcePreSignedUrl(
          content.file.id,
          'private',
          's3',
        );
        return {
          ...content,
          file: {
            ...content.file,
            url: resourceUrl,
          },
        };

      case 'video':
      case 'text':
      default:
        throw new InternalServerErrorException(
          `Not supported ebook content file type. ${content.contentType}`,
        );
    }
  }
}
