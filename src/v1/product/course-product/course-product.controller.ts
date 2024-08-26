import { Controller, UseGuards } from '@nestjs/common';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { CourseProductService } from '@src/v1/product/course-product/course-product.service';
import { Uuid } from '@src/shared/types/primitive';
import {
  CreateCourseProductDto,
  CourseProductDto,
  UpdateCourseProductDto,
} from '@src/v1/product/course-product/course-product.dto';
import * as date from '@src/shared/utils/date';
import { TypeGuardError } from 'typia';
import { courseProductToDto } from '@src/shared/helpers/transofrm/course-product';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';

@Controller('v1/product/course')
export class CourseProductController {
  constructor(private readonly courseProductService: CourseProductService) {}

  /**
   * 가장 최신의 강의 상품 상세 페이지를 조회합니다.
   *
   * 로그인 없이 조회할 수 있습니다.
   *
   * title: 상품 제목.
   *
   * description: 상품 설명 (사용처 미확정).
   *
   * announcement: 상품 상세 페이지 공지사항 rich text content.
   *
   * content: 상품 상세 페이지 rich text content.
   *
   * refundPolicy: 상품 상세 페이지 환불 정책 rich text content.
   *
   * pricing: 상품 가격 정보.
   *
   * discounts: 상품 할인 정보.
   *
   * @tag product-course
   * @summary 특정 강의 상품 조회 (public)
   * @param courseId - 강의 ID
   */
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
    const product =
      await this.courseProductService.findCourseProductWithRelations({
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

  /**
   * 강의 상품 상세 페이지를 생성합니다. (스냅샷)
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   **
   * 사용자는 가장 최신의 스냅샷을 조회할 수 있습니다.
   *
   * title: 상품 제목.
   *
   * description: 상품 설명 (사용처 미확정).
   *
   * announcement: 상품 상세 페이지 공지사항 rich text content.
   *
   * content: 상품 상세 페이지 rich text content.
   *
   * refundPolicy: 상품 상세 페이지 환불 정책 rich text content.
   *
   * pricing: 상품 가격 정보.
   *
   * discounts: 상품 할인 정보.
   *
   * @tag product-course
   * @summary 강의 상품 생성 - Role('admin', 'manager')
   * @param courseId - 강의 ID
   */
  @TypedRoute.Post('/:courseId')
  @Roles('admin', 'manager')
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

  /**
   * 강의 상품 상세 페이지를 수정합니다. (스냅샷)
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   **
   * 사용자는 가장 최신의 스냅샷을 조회할 수 있습니다.
   *
   * 업데이트할 필드만 body에 담아서 요청합니다.
   *
   * body에 담기지 않은 필드는 이전 스냅샷의 값을 그대로 사용합니다.
   *
   * title: 상품 제목.
   *
   * description: 상품 설명 (사용처 미확정).
   *
   * announcement: 상품 상세 페이지 공지사항 rich text content.
   *
   * content: 상품 상세 페이지 rich text content.
   *
   * refundPolicy: 상품 상세 페이지 환불 정책 rich text content.
   *
   * pricing: 상품 가격 정보.
   *
   * discounts: 상품 할인 정보.
   *
   * @tag product-course
   * @summary 강의 상품 생성 - Role('admin', 'manager')
   * @param courseId - 강의 ID
   */
  @TypedRoute.Patch('/:courseId')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<TypeGuardError>({
    status: 404,
    description: 'Course product snapshot not found',
  })
  async updateProductCourse(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
    @TypedBody() body: UpdateCourseProductDto,
  ): Promise<CourseProductDto> {
    const updated = await this.courseProductService.updateCourseProduct(
      {
        courseId,
      },
      {
        courseProductSnapshotCreateParams: { ...body },
        courseProductSnapshotAnnouncementCreateParams: body.announcement,
        courseProductSnapshotContentCreateParams: body.content,
        courseProductSnapshotRefundPolicyCreateParams: body.refundPolicy,
        courseProductSnapshotPricingCreateParams: body.pricing,
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
      },
    );

    return courseProductToDto(updated);
  }
}
