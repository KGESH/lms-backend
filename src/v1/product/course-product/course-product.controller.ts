import { Controller, UseGuards } from '@nestjs/common';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { CourseProductService } from './course-product.service';
import { Uuid } from '../../../shared/types/primitive';
import { CreateCourseProductDto, CourseProductDto } from './course-product.dto';
import * as date from '../../../shared/utils/date';
import { TypeGuardError } from 'typia';
import { courseProductToDto } from '../../../shared/helpers/transofrm/product';
import { SkipAuth } from '../../../core/decorators/skip-auth.decorator';
import { ApiAuthHeaders, AuthHeaders } from '../../auth/auth.headers';
import { Roles } from '../../../core/decorators/roles.decorator';
import { RolesGuard } from '../../../core/guards/roles.guard';

@Controller('v1/product/course')
export class CourseProductController {
  constructor(private readonly courseProductService: CourseProductService) {}

  @TypedRoute.Get('/:courseId')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async getCourseProduct(
    @TypedHeaders() headers: ApiAuthHeaders,
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

  @TypedRoute.Post('/:courseId')
  @Roles('admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async createProductCourse(
    @TypedHeaders() headers: AuthHeaders,
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
