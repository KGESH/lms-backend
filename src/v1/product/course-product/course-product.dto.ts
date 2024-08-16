import { ISO8601, Uuid } from '../../../shared/types/primitive';
import { ProductSnapshotDiscountDto } from '../common/snapshot/discount/product-snapshot-discount.dto';
import { ProductSnapshotPricingDto } from '../common/snapshot/pricing/product-snapshot-pricing.dto';
import { ProductSnapshotContentDto } from '../common/snapshot/content/product-snapshot-content.dto';

export type CourseProductDto = {
  // id: Uuid;
  courseId: Uuid;
  snapshotId: Uuid;
  title: string;
  description: string | null;
  content: ProductSnapshotContentDto;
  pricing: ProductSnapshotPricingDto;
  discounts: ProductSnapshotDiscountDto | null;
  createdAt: ISO8601;
  updatedAt: ISO8601;
  deletedAt: ISO8601 | null;
};

export type CourseProductCreateDto = Omit<
  CourseProductDto,
  'id' | 'courseId' | 'snapshotId'
>;
