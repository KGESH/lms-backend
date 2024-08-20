import { Controller } from '@nestjs/common';
import {
  TypedBody,
  TypedException,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { CourseProductService } from './course-product.service';
import { Uuid } from '../../../shared/types/primitive';
import { CreateCourseProductDto, CourseProductDto } from './course-product.dto';
import * as date from '../../../shared/utils/date';
import { TypeGuardError } from 'typia';
import { courseProductToDto } from '../../../shared/helpers/transofrm/product';

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

    if (!product || !product.lastSnapshot) {
      return null;
    }

    return courseProductToDto({
      ...product,
      lastSnapshot: product.lastSnapshot,
    });
  }

  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedRoute.Post('/:courseId')
  async createProductCourse(
    @TypedParam('courseId') courseId: Uuid,
    @TypedBody() body: CreateCourseProductDto,
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
      courseProductSnapshotAnnouncementCreateParams: {
        richTextContent: body.announcement.richTextContent,
      },
      courseProductSnapshotRefundPolicyCreateParams: {
        richTextContent: body.refundPolicy.richTextContent,
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

    return courseProductToDto(product);
  }
}
