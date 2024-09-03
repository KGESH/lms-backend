import { Injectable, NotFoundException } from '@nestjs/common';
import { ICourse } from '@src/v1/course/course.interface';
import { CourseQueryRepository } from '@src/v1/course/course-query.repository';
import { ICourseWithRelations } from '@src/v1/course/course-with-relations.interface';
import { Paginated, Pagination } from '@src/shared/types/pagination';
import { OptionalPick } from '@src/shared/types/optional';

@Injectable()
export class CourseQueryService {
  constructor(private readonly courseQueryRepository: CourseQueryRepository) {}

  async findCoursesWithRelations(
    where: OptionalPick<ICourse, 'categoryId'>,
    pagination: Pagination,
  ): Promise<Paginated<ICourseWithRelations[]>> {
    return await this.courseQueryRepository.findManyCoursesWithRelations(
      where,
      pagination,
    );
  }

  async findCourseById(where: Pick<ICourse, 'id'>): Promise<ICourse | null> {
    return await this.courseQueryRepository.findCourse(where);
  }

  async findCourseByIdOrThrow(where: Pick<ICourse, 'id'>): Promise<ICourse> {
    const course = await this.findCourseById(where);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async findCourseWithRelations(
    where: Pick<ICourse, 'id'>,
  ): Promise<ICourseWithRelations | null> {
    return await this.courseQueryRepository.findCourseWithRelations(where);
  }
}
