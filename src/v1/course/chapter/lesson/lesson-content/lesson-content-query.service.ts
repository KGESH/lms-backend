import { Injectable } from '@nestjs/common';
import { ILessonContent } from './lesson-content.interface';
import { LessonContentQueryRepository } from './lesson-content-query.repository';

@Injectable()
export class LessonContentQueryService {
  constructor(
    private readonly lessonContentQueryRepository: LessonContentQueryRepository,
  ) {}

  async findLessonContents(
    where: Pick<ILessonContent, 'lessonId'>,
  ): Promise<ILessonContent[]> {
    return await this.lessonContentQueryRepository.findManyByLessonId(where);
  }

  async findLessonContentById(
    where: Pick<ILessonContent, 'id'>,
  ): Promise<ILessonContent | null> {
    return await this.lessonContentQueryRepository.findOne(where);
  }
}
