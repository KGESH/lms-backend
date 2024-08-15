import { Controller } from '@nestjs/common';
import {
  TypedBody,
  TypedException,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { CourseProductService } from './course-product.service';
import { Uuid } from '../../../shared/types/primitive';
import { CourseProductCreateDto, CourseProductDto } from './course-product.dto';
import * as date from '../../../shared/utils/date';
import { TypeGuardError } from 'typia';

@Controller('v1/product/course')
export class CourseProductController {
  constructor(private readonly courseProductService: CourseProductService) {}

  @TypedException<TypeGuardError>(400, 'invalid request')
  @TypedRoute.Get('/:courseId')
  async getCourseProduct(
    @TypedParam('courseId') courseId: Uuid,
  ): Promise<CourseProductDto | null> {
    const product = await this.courseProductService.findCourseProduct({
      courseId,
    });

    if (!product?.lastSnapshot) {
      return null;
    }

    return {
      id: product.id,
      courseId: product.courseId,
      snapshotId: product.lastSnapshot.id,
      title: product.lastSnapshot.title,
      description: product.lastSnapshot.description,
      createdAt: date.toISOString(product.lastSnapshot.createdAt),
      updatedAt: date.toISOString(product.lastSnapshot.updatedAt),
      deletedAt: product.lastSnapshot.deletedAt
        ? date.toISOString(product.lastSnapshot.deletedAt)
        : null,
      pricing: product.lastSnapshot.pricing,
      discount: product.lastSnapshot.discount
        ? {
            ...product.lastSnapshot.discount,
            validFrom: product.lastSnapshot.discount?.validFrom
              ? date.toISOString(product.lastSnapshot.discount.validFrom)
              : null,
            validTo: product.lastSnapshot.discount?.validTo
              ? date.toISOString(product.lastSnapshot.discount.validTo)
              : null,
          }
        : null,
    };
  }

  @TypedException<TypeGuardError>(400, 'invalid request')
  @TypedRoute.Post('/:courseId')
  async createProductCourse(
    @TypedParam('courseId') courseId: Uuid,
    @TypedBody() body: CourseProductCreateDto,
  ): Promise<CourseProductDto> {
    const product = await this.courseProductService.createCourseProduct({
      courseProductCreateParams: {
        courseId,
      },
      courseProductSnapshotCreateParams: {
        title: body.title,
        description: body.description,
      },
      courseProductSnapshotPricingCreateParams: {
        amount: body.pricing.amount,
      },
      courseProductSnapshotDiscountCreateParams: body.discount
        ? {
            discountType: body.discount.discountType,
            value: body.discount.value,
            validFrom: body.discount.validFrom
              ? date.toDate(body.discount.validFrom)
              : null,
            validTo: body.discount.validTo
              ? date.toDate(body.discount.validTo)
              : null,
          }
        : null,
    });

    return {
      id: product.id,
      courseId: product.courseId,
      snapshotId: product.lastSnapshot.id,
      title: product.lastSnapshot.title,
      description: product.lastSnapshot.description,
      createdAt: date.toISOString(product.lastSnapshot.createdAt),
      updatedAt: date.toISOString(product.lastSnapshot.updatedAt),
      deletedAt: product.lastSnapshot.deletedAt
        ? date.toISOString(product.lastSnapshot.deletedAt)
        : null,
      pricing: product.lastSnapshot.pricing,
      discount: product.lastSnapshot.discount
        ? {
            ...product.lastSnapshot.discount,
            validFrom: product.lastSnapshot.discount?.validFrom
              ? date.toISOString(product.lastSnapshot.discount.validFrom)
              : null,
            validTo: product.lastSnapshot.discount?.validTo
              ? date.toISOString(product.lastSnapshot.discount.validTo)
              : null,
          }
        : null,
    };
  }
}
