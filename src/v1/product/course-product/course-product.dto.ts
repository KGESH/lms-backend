import { ISO8601, Uuid } from '../../../shared/types/primitive';
import { CourseProductSnapshotDiscountDto } from './snapshot/discount/course-product-snapshot-discount.dto';
import { CourseProductSnapshotPricingDto } from './snapshot/pricing/course-product-snapshot-pricing.dto';
import { CourseProductSnapshotContentDto } from './snapshot/content/course-product-snapshot-content.dto';

export type CourseProductDto = {
  id: Uuid;
  courseId: Uuid;
  snapshotId: Uuid;
  title: string;
  description: string | null;
  content: CourseProductSnapshotContentDto;
  pricing: CourseProductSnapshotPricingDto;
  discount: CourseProductSnapshotDiscountDto | null;
  createdAt: ISO8601;
  updatedAt: ISO8601;
  deletedAt: ISO8601 | null;
};

export type CourseProductCreateDto = Omit<
  CourseProductDto,
  'id' | 'courseId' | 'snapshotId'
>;
