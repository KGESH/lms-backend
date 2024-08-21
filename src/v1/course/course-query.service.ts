import { Injectable } from '@nestjs/common';
import { CourseRepository } from './course.repository';
import { ICourse } from './course.interface';
import { CourseQueryRepository } from './course-query.repository';
import { ICourseWithRelations } from './course-with-relations.interface';
import { Pagination } from '../../shared/types/pagination';
import {
  DEFAULT_ORDER_BY,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from '../../core/pagination.constant';

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
