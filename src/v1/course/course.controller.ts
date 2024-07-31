import { Controller } from '@nestjs/common';
import { CourseService } from './course.service';
import { TypedParam, TypedRoute } from '@nestia/core';
import { CourseQueryService } from './course-query.service';
import { ICourse } from './course.interface';
import { IResponse } from '../../shared/types/response';
import { Uuid } from '../../shared/types/primitive';

@Controller('v1/course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly courseQueryService: CourseQueryService,
  ) {}

  @TypedRoute.Get('/')
  async getCourses(): Promise<IResponse<ICourse[]>> {
    const courses = await this.courseQueryService.findCourses();
    return { data: courses };
  }

  @TypedRoute.Get('/:id')
  async getCourse(
    @TypedParam('id') id: Uuid,
  ): Promise<IResponse<ICourse | null>> {
    const course = await this.courseQueryService.findCourseById({ id });
    return { data: course };
  }
}
