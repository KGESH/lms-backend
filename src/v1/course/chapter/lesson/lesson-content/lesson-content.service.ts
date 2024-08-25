import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import {
  ILessonContent,
  ILessonContentCreate,
  ILessonContentUpdate,
} from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.interface';
import { LessonContentQueryRepository } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content-query.repository';
import { LessonContentRepository } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.repository';
import { LessonQueryService } from '@src/v1/course/chapter/lesson/lesson-query.service';
import { Uuid } from '@src/shared/types/primitive';

@Injectable()
export class LessonContentService {
  constructor(
    private readonly lessonQueryService: LessonQueryService,
    private readonly lessonContentRepository: LessonContentRepository,
    private readonly lessonContentQueryRepository: LessonContentQueryRepository,
  ) {}

  async createLessonContents(
    lessonId: Uuid,
    params: Omit<ILessonContentCreate, 'sequence'>[],
    tx?: TransactionClient,
  ): Promise<ILessonContent[]> {
    if (params.length === 0) {
      return [];
    }

    const lesson = await this.lessonQueryService.findLessonById({
      id: lessonId,
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const existContents =
      await this.lessonContentQueryRepository.findManyByLessonId({
        lessonId,
      });

    const fileContents = params.filter(
      (content) => content.contentType === 'file',
    );
    const existFileContents = existContents.filter(
      (content) => content.contentType === 'file',
    );
    const fileContentMaxSequence = Math.max(
      ...existFileContents.map((content) => content.sequence ?? 0),
      0,
    );
    const fileContentCreateParams = fileContents.map((content, index) => ({
      ...content,
      sequence: fileContentMaxSequence + index + 1,
    }));

    const imageContents = params.filter(
      (content) => content.contentType === 'image',
    );
    const existImageContents = existContents.filter(
      (content) => content.contentType === 'image',
    );
    const imageContentMaxSequence = Math.max(
      ...existImageContents.map((content) => content.sequence ?? 0),
      0,
    );
    const imageContentCreateParams = imageContents.map((content, index) => ({
      ...content,
      sequence: imageContentMaxSequence + index + 1,
    }));

    const textContents = params.filter(
      (content) => content.contentType === 'text',
    );
    const existTextContents = existContents.filter(
      (content) => content.contentType === 'text',
    );
    const textContentMaxSequence = Math.max(
      ...existTextContents.map((content) => content.sequence ?? 0),
      0,
    );
    const textContentCreateParams = textContents.map((content, index) => ({
      ...content,
      sequence: textContentMaxSequence + index + 1,
    }));

    const videoContents = params.filter(
      (content) => content.contentType === 'video',
    );
    const existVideoContents = existContents.filter(
      (content) => content.contentType === 'video',
    );
    const videoContentMaxSequence = Math.max(
      ...existVideoContents.map((content) => content.sequence ?? 0),
      0,
    );
    const videoContentCreateParams = videoContents.map((content, index) => ({
      ...content,
      sequence: videoContentMaxSequence + index + 1,
    }));

    return await this.lessonContentRepository.createLessonContents(
      [
        ...fileContentCreateParams,
        ...imageContentCreateParams,
        ...textContentCreateParams,
        ...videoContentCreateParams,
      ],
      tx,
    );
  }

  async updateLessonContent(
    where: Pick<ILessonContent, 'id'>,
    params: ILessonContentUpdate,
    tx?: TransactionClient,
  ): Promise<ILessonContent> {
    await this.lessonContentQueryRepository.findOneOrThrow({ id: where.id });
    return await this.lessonContentRepository.updateLessonContent(
      where,
      params,
      tx,
    );
  }

  async deleteLessonContent(
    where: Pick<ILessonContent, 'id'>,
    tx?: TransactionClient,
  ): Promise<ILessonContent> {
    await this.lessonContentQueryRepository.findOneOrThrow({ id: where.id });
    return await this.lessonContentRepository.deleteLessonContent(where, tx);
  }
}
