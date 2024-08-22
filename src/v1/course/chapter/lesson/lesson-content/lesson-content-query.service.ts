import { Injectable } from '@nestjs/common';
import { ILessonContent } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.interface';
import { LessonContentQueryRepository } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content-query.repository';

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
