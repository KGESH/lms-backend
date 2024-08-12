import { Injectable } from '@nestjs/common';
import { LessonContentRepository } from './lesson-content.repository';
import { ILessonContent } from './lesson-content.interface';

@Injectable()
export class LessonContentQueryService {
  constructor(
    private readonly lessonContentRepository: LessonContentRepository,
  ) {}

  async findLessons(): Promise<ILessonContent[]> {
    return await this.lessonContentRepository.findMany();
  }

  async findLessonContentById(
    where: Pick<ILessonContent, 'id'>,
  ): Promise<ILessonContent | null> {
    return await this.lessonContentRepository.findOne(where);
  }
}
