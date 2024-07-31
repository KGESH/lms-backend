import { Injectable } from '@nestjs/common';
import { CourseRepository } from './course.repository';
import { ICourse } from './course.interface';

@Injectable()
export class CourseQueryService {
  constructor(private readonly courseRepository: CourseRepository) {}

  async findCourses(): Promise<ICourse[]> {
    return await this.courseRepository.findMany();
  }

  async findCourseById(where: Pick<ICourse, 'id'>): Promise<ICourse | null> {
    return await this.courseRepository.findOne(where);
  }
}
