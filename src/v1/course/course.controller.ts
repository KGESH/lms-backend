import { Controller } from '@nestjs/common';
import { CourseService } from './course.service';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { CourseQueryService } from './course-query.service';
import { Uuid } from '../../shared/types/primitive';
import { CourseCreateDto, CourseDto, CourseUpdateDto } from './course.dto';
import { CourseWithRelationsDto } from './course-with-relations.dto';
import {
  courseRelationsToDto,
  courseToDto,
} from '../../shared/helpers/transofrm/course';

@Controller('v1/course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly courseQueryService: CourseQueryService,
  ) {}

  @TypedRoute.Get('/')
  async getCourses(): Promise<CourseDto[]> {
    const courses = await this.courseQueryService.findCourses();
    return courses.map(courseToDto);
  }

  @TypedRoute.Get('/:id')
  async getCourse(
    @TypedParam('id') id: Uuid,
  ): Promise<CourseWithRelationsDto | null> {
    const course = await this.courseQueryService.findCourseWithRelations({
      id,
    });

    if (!course) {
      return null;
    }

    return courseRelationsToDto(course);
  }

  @TypedRoute.Post('/')
  async createCourse(@TypedBody() body: CourseCreateDto): Promise<CourseDto> {
    const course = await this.courseService.createCourse(body);
    return courseToDto(course);
  }

  @TypedRoute.Patch('/:id')
  async updateCourse(
    @TypedParam('id') id: Uuid,
    @TypedBody() body: Partial<CourseUpdateDto>,
  ): Promise<CourseDto> {
    const course = await this.courseService.updateCourse({ id }, body);
    return courseToDto(course);
  }

  @TypedRoute.Delete('/:id')
  async deleteCourse(@TypedParam('id') id: Uuid): Promise<CourseDto> {
    const course = await this.courseService.deleteCourse({ id });
    return courseToDto(course);
  }
}
