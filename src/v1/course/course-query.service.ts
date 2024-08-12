import { Injectable } from '@nestjs/common';
import { CourseRepository } from './course.repository';
import { ICourse } from './course.interface';
import { CourseQueryRepository } from './course-query.repository';
import { ICourseWithRelations } from './course-with-relations.interface';

@Injectable()
export class CourseQueryService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly courseQueryRepository: CourseQueryRepository,
  ) {}

  async findCourses(): Promise<ICourse[]> {
    return await this.courseRepository.findMany();
  }

  async findCourseById(where: Pick<ICourse, 'id'>): Promise<ICourse | null> {
    return await this.courseRepository.findOne(where);
  }

  async findCourseWithRelations(
    where: Pick<ICourse, 'id'>,
  ): Promise<ICourseWithRelations | null> {
    return await this.courseQueryRepository.findCourseWithRelations(where);
  }
}
