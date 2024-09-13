import { ISO8601, Uuid } from '@src/shared/types/primitive';
import { ProductSnapshotDiscountDto } from '@src/v1/product/common/snapshot/discount/product-snapshot-discount.dto';
import { ProductSnapshotPricingDto } from '@src/v1/product/common/snapshot/pricing/product-snapshot-pricing.dto';
import { ProductSnapshotContentDto } from '@src/v1/product/common/snapshot/content/product-snapshot-content.dto';
import { ProductSnapshotAnnouncementDto } from '@src/v1/product/common/snapshot/announcement/product-snapshot-announcement.dto';
import { ProductSnapshotRefundPolicyDto } from '@src/v1/product/common/snapshot/refund-policy/product-snapshot-refund-policy.dto';
import { Pagination } from '@src/shared/types/pagination';
import { CourseWithRelationsDto } from '@src/v1/course/course-with-relations.dto';
import { ProductSnapshotUiContentDto } from '@src/v1/product/common/snapshot/ui-content/product-snapshot-ui-content.dto';
import { RequiredField } from '@src/shared/types/required-field';

export type CourseProductDto = {
  courseId: Uuid;
  snapshotId: Uuid;
  title: string;
  description: string | null;
  course: CourseWithRelationsDto;
  content: ProductSnapshotContentDto;
  announcement: ProductSnapshotAnnouncementDto;
  refundPolicy: ProductSnapshotRefundPolicyDto;
  pricing: ProductSnapshotPricingDto;
  discounts: ProductSnapshotDiscountDto | null;
  uiContents: ProductSnapshotUiContentDto[];
  createdAt: ISO8601;
  updatedAt: ISO8601;
  deletedAt: ISO8601 | null;
};

export type CreateCourseProductDto = Pick<
  CourseProductDto,
  'title' | 'description'
> & {
  content: Pick<ProductSnapshotContentDto, 'richTextContent'>;
  announcement: Pick<ProductSnapshotAnnouncementDto, 'richTextContent'>;
  refundPolicy: Pick<ProductSnapshotRefundPolicyDto, 'richTextContent'>;
  pricing: Pick<ProductSnapshotPricingDto, 'amount'>;
  discounts: Omit<
    ProductSnapshotDiscountDto,
    'id' | 'productSnapshotId'
  > | null;
  uiContents: Pick<
    ProductSnapshotUiContentDto,
    'type' | 'content' | 'description' | 'sequence' | 'metadata' | 'url'
  >[];
};

export type UpdateCourseProductDto = Partial<
  Omit<CreateCourseProductDto, 'uiContents'>
> & {
  uiContents?: {
    create: Pick<
      ProductSnapshotUiContentDto,
      'type' | 'content' | 'description' | 'sequence' | 'metadata' | 'url'
    >[];
    update: RequiredField<
      Partial<Omit<ProductSnapshotUiContentDto, 'productSnapshotId'>>,
      'id'
    >[];
  };
};

export type CourseProductQuery = Partial<Pagination>;
