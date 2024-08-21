import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseRepository } from './course.repository';
import { ICourse, ICourseCreate, ICourseUpdate } from './course.interface';
import { TransactionClient } from '../../infra/db/drizzle.types';
import { TeacherRepository } from '../teacher/teacher.repository';
import { CategoryService } from '../category/category.service';
import { TeacherService } from '../teacher/teacher.service';

@Injectable()
export class CourseService {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly teacherService: TeacherService,
    private readonly courseRepository: CourseRepository,
  ) {}

  async createCourse(
    params: ICourseCreate,
    tx?: TransactionClient,
  ): Promise<ICourse> {
    const { teacherId, categoryId } = params;

    const category = await this.categoryService.findCategory({
      id: categoryId,
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const teacher = await this.teacherService.findTeacher({ id: teacherId });
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return await this.courseRepository.create(params, tx);
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

    return await this.courseRepository.update(where, params, tx);
  }

  async deleteCourse(
    where: Pick<ICourse, 'id'>,
    tx?: TransactionClient,
  ): Promise<ICourse> {
    const exist = await this.courseRepository.findCourse({ id: where.id });

    if (!exist) {
      throw new NotFoundException('Course not found');
    }

    return await this.courseRepository.delete(where, tx);
  }
}
