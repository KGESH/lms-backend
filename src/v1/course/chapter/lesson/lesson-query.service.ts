import { Injectable } from '@nestjs/common';
import { ILesson } from './lesson.interface';
import { LessonQueryRepository } from './lesson-query.repository';

@Injectable()
export class LessonQueryService {
  constructor(private readonly lessonQueryRepository: LessonQueryRepository) {}

  async findLessonById(where: Pick<ILesson, 'id'>): Promise<ILesson | null> {
    return await this.lessonQueryRepository.findOne(where);
  }

  async findLessonsByChapterId(
    where: Pick<ILesson, 'chapterId'>,
  ): Promise<ILesson[]> {
    return await this.lessonQueryRepository.findManyByChapterId(where);
  }
}
