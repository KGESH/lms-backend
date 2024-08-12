import { Injectable } from '@nestjs/common';
import { LessonRepository } from './lesson.repository';
import { ILesson } from './lesson.interface';

@Injectable()
export class LessonQueryService {
  constructor(private readonly lessonRepository: LessonRepository) {}

  async findLessons(): Promise<ILesson[]> {
    return await this.lessonRepository.findMany();
  }

  async findLessonById(where: Pick<ILesson, 'id'>): Promise<ILesson | null> {
    return await this.lessonRepository.findOne(where);
  }
}
