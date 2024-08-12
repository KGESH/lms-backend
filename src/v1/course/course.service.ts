import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseRepository } from './course.repository';
import { ICourse, ICourseCreate, ICourseUpdate } from './course.interface';
import { TransactionClient } from '../../infra/db/drizzle.types';

@Injectable()
export class CourseService {
  constructor(private readonly courseRepository: CourseRepository) {}

  async createCourse(
    params: ICourseCreate,
    tx?: TransactionClient,
  ): Promise<ICourse> {
    return await this.courseRepository.create(params, tx);
  }

  async updateCourse(
    where: Pick<ICourse, 'id'>,
    params: ICourseUpdate,
    tx?: TransactionClient,
  ): Promise<ICourse> {
    const exist = await this.courseRepository.findOne({ id: where.id });

    if (!exist) {
      throw new NotFoundException('Course not found');
    }

    return await this.courseRepository.update(where, params, tx);
  }

  async deleteCourse(
    where: Pick<ICourse, 'id'>,
    tx?: TransactionClient,
  ): Promise<ICourse> {
    const exist = await this.courseRepository.findOne({ id: where.id });

    if (!exist) {
      throw new NotFoundException('Course not found');
    }

    return await this.courseRepository.delete(where, tx);
  }
}
