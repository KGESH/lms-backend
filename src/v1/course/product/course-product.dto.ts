import { Uuid } from '../../../shared/types/primitive';
import { CourseProductSnapshotDiscountDto } from './snapshot/discount/course-product-snapshot-discount.dto';
import { CourseProductSnapshotPricingDto } from './snapshot/pricing/course-product-snapshot-pricing.dto';

export type CourseProductDto = {
  id: Uuid;
  courseId: Uuid;
  snapshotId: Uuid;
  title: string;
  description: string | null;
  pricing: CourseProductSnapshotPricingDto;
  discount: CourseProductSnapshotDiscountDto | null;
  createdAt: string;
};

export type CourseProductCreateDto = Omit<
  CourseProductDto,
  'id' | 'courseId' | 'snapshotId'
>;
