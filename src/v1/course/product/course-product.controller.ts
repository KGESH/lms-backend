import { Controller } from '@nestjs/common';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { CourseProductService } from './course-product.service';
import { Uuid } from '../../../shared/types/primitive';
import { CourseProductCreateDto, CourseProductDto } from './course-product.dto';

@Controller('v1/course/:courseId/product')
export class CourseProductController {
  constructor(private readonly courseProductService: CourseProductService) {}

  // @TypedRoute.Post('/')
  // async createProductCourse(
  //   @TypedParam('courseId') courseId: Uuid,
  //   @TypedBody() body: CourseProductCreateDto,
  // ): Promise<CourseProductDto | null> {
  //   const product = await this.courseProductService.createCourseProduct({
  //     courseId,
  //   });
  //
  //   return {
  //     ...product,
  //   };
  // }
}
