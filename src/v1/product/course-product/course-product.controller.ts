import { Controller, Logger, UseGuards } from '@nestjs/common';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import { CourseProductService } from '@src/v1/product/course-product/course-product.service';
import { Uuid } from '@src/shared/types/primitive';
import {
  CreateCourseProductDto,
  CourseProductDto,
  UpdateCourseProductDto,
  CourseProductQuery,
} from '@src/v1/product/course-product/course-product.dto';
import * as date from '@src/shared/utils/date';
import { TypeGuardError } from 'typia';
import {
  courseProductToDto,
  courseProductWithPricingToDto,
} from '@src/shared/helpers/transofrm/course-product';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { Paginated } from '@src/shared/types/pagination';
import { IErrorResponse } from '@src/shared/types/response';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';
import { withDefaultPagination } from '@src/core/pagination';

@Controller('v1/product/course')
export class CourseProductController {
  private readonly logger = new Logger(CourseProductController.name);
  constructor(private readonly courseProductService: CourseProductService) {}

  /**
   * 강의 상품 목록을 조회합니다.
   *
   * 로그인 없이 조회할 수 있습니다.
   *
   * 현재 Query parameter 'orderBy' 속성은 최초 강의 상품이 등록된 시간 기준입니다. (스냅샷 생성 시간이 아닙니다.)
   *
   * 예시) 'A' 강의 상품, 'B' 강의 상품 순서로 생성 되었다고 가정.
   *
   * 이후 'A' 강의 상품이 업데이트 되었다고 가정. (새로운 'A' 스냅샷 생성)
   *
   * orderBy desc 설정후 조회시, [B, A] 순서로 조회됩니다.
   *
   * orderBy asc 설정후 조회시, [A, B] 순서로 조회됩니다.
   *
   * 추후 Query parameter 속성을 통해 특정 컬럼을 기준으로 정렬할 수 있도록 구현 예정입니다.
   *
   * title: 상품 제목.
   *
   * description: 상품 설명 (사용처 미확정).
   *
   * course: 강의 정보.
   *
   * pricing: 상품 가격 정보.
   *
   * discounts: 상품 할인 정보.
   *
   * @tag product-course
   * @summary 강의 상품 목록 조회 (public)
   */
  @TypedRoute.Get('/')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async getCourseProducts(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedQuery() query: CourseProductQuery,
  ): Promise<
    Paginated<
      Omit<CourseProductDto, 'announcement' | 'content' | 'refundPolicy'>[]
    >
  > {
    const { data: products, ...paginated } =
      await this.courseProductService.findCourseProductsWithPricing(
        withDefaultPagination(query),
      );

    return {
      ...paginated,
      data: products.map(courseProductWithPricingToDto),
    };
  }

  /**
   * 가장 최신의 강의 상품 상세 페이지를 조회합니다.
   *
   * 로그인 없이 조회할 수 있습니다.
   *
   * title: 상품 제목.
   *
   * description: 상품 설명 (사용처 미확정).
   *
   * course: 강의 정보.
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
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
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
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'course not found',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
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
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
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
