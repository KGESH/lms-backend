import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { TeacherService } from '@src/v1/teacher/teacher.service';
import { CourseRepository } from '@src/v1/course/course.repository';
import {
  ICourse,
  ICourseCreate,
  ICourseUpdate,
} from '@src/v1/course/course.interface';
import { CourseCategoryService } from '@src/v1/course/category/course-category.service';

@Injectable()
export class CourseService {
  constructor(
    private readonly courseCategoryService: CourseCategoryService,
    private readonly teacherService: TeacherService,
    private readonly courseRepository: CourseRepository,
  ) {}

  async createCourse(
    params: ICourseCreate,
    tx?: TransactionClient,
  ): Promise<ICourse> {
    const { teacherId, categoryId } = params;

    await this.courseCategoryService.findCourseCategoryOrThrow({
      id: categoryId,
    });

    await this.teacherService.findTeacherOrThrow({
      id: teacherId,
    });

    return await this.courseRepository.createCourse(params, tx);
  }

  async updateCourse(
    where: Pick<ICourse, 'id'>,
    params: ICourseUpdate,
    tx?: TransactionClient,
  ): Promise<ICourse> {
    const exist = await this.courseRepository.findCourse({ id: where.id });

    if (!exist) {
      throw new NotFoundException('Course not found');
    }

    return await this.courseRepository.updateCourse(where, params, tx);
  }

  async deleteCourse(
    where: Pick<ICourse, 'id'>,
    tx?: TransactionClient,
  ): Promise<ICourse> {
    const exist = await this.courseRepository.findCourse({ id: where.id });

    if (!exist) {
      throw new NotFoundException('Course not found');
    }

    return await this.courseRepository.deleteCourse(where, tx);
  }
}
