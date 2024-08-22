import { Injectable } from '@nestjs/common';
import { CourseRepository } from '@src/v1/course/course.repository';
import { ICourse } from '@src/v1/course/course.interface';
import { CourseQueryRepository } from '@src/v1/course/course-query.repository';
import { ICourseWithRelations } from '@src/v1/course/course-with-relations.interface';
import { Pagination } from '@src/shared/types/pagination';
import {
  DEFAULT_ORDER_BY,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from '@src/core/pagination.constant';

@Injectable()
export class CourseQueryService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly courseQueryRepository: CourseQueryRepository,
  ) {}

  async findCourses(
    pagination: Pagination = {
      page: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
      orderBy: DEFAULT_ORDER_BY,
    },
  ): Promise<ICourse[]> {
    return await this.courseRepository.findManyCourses(pagination);
  }

  async findCourseById(where: Pick<ICourse, 'id'>): Promise<ICourse | null> {
    return await this.courseRepository.findCourse(where);
  }

  async findCourseWithRelations(
    where: Pick<ICourse, 'id'>,
  ): Promise<ICourseWithRelations | null> {
    return await this.courseQueryRepository.findCourseWithRelations(where);
  }
}
