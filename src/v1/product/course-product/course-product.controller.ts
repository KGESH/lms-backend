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

  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
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
      // id: product.id,
      courseId: product.courseId,
      snapshotId: product.lastSnapshot.id,
      title: product.lastSnapshot.title,
      description: product.lastSnapshot.description,
      createdAt: date.toISOString(product.lastSnapshot.createdAt),
      updatedAt: date.toISOString(product.lastSnapshot.updatedAt),
      deletedAt: product.lastSnapshot.deletedAt
        ? date.toISOString(product.lastSnapshot.deletedAt)
        : null,
      content: product.lastSnapshot.content,
      pricing: product.lastSnapshot.pricing,
      discounts: product.lastSnapshot.discounts
        ? {
            ...product.lastSnapshot.discounts,
            validFrom: product.lastSnapshot.discounts?.validFrom
              ? date.toISOString(product.lastSnapshot.discounts.validFrom)
              : null,
            validTo: product.lastSnapshot.discounts?.validTo
              ? date.toISOString(product.lastSnapshot.discounts.validTo)
              : null,
          }
        : null,
    };
  }

  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
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
      courseProductSnapshotContentCreateParams: {
        richTextContent: body.content.richTextContent,
      },
      courseProductSnapshotPricingCreateParams: {
        amount: body.pricing.amount,
      },
      courseProductSnapshotDiscountCreateParams: body.discounts
        ? {
            discountType: body.discounts.discountType,
            value: body.discounts.value,
            validFrom: body.discounts.validFrom
              ? date.toDate(body.discounts.validFrom)
              : null,
            validTo: body.discounts.validTo
              ? date.toDate(body.discounts.validTo)
              : null,
          }
        : null,
    });

    return {
      // id: product.id,
      courseId: product.courseId,
      snapshotId: product.lastSnapshot.id,
      title: product.lastSnapshot.title,
      description: product.lastSnapshot.description,
      createdAt: date.toISOString(product.lastSnapshot.createdAt),
      updatedAt: date.toISOString(product.lastSnapshot.updatedAt),
      deletedAt: product.lastSnapshot.deletedAt
        ? date.toISOString(product.lastSnapshot.deletedAt)
        : null,
      content: product.lastSnapshot.content,
      pricing: product.lastSnapshot.pricing,
      discounts: product.lastSnapshot.discounts
        ? {
            ...product.lastSnapshot.discounts,
            validFrom: product.lastSnapshot.discounts?.validFrom
              ? date.toISOString(product.lastSnapshot.discounts.validFrom)
              : null,
            validTo: product.lastSnapshot.discounts?.validTo
              ? date.toISOString(product.lastSnapshot.discounts.validTo)
              : null,
          }
        : null,
    };
  }
}
