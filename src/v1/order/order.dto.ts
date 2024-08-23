import {
  Course,
  Ebook,
  ISO8601,
  Price,
  Uuid,
} from '@src/shared/types/primitive';
import { CourseProductDto } from '@src/v1/product/course-product/course-product.dto';

export type OrderCourseDto = {
  id: Uuid;
  userId: Uuid;
  productType: Course;
  paymentMethod: string;
  title: string;
  description: string | null;
  amount: Price;
  paidAt: ISO8601 | null;
  product: CourseProductDto;
};

export type OrderEbookDto = {
  id: Uuid;
  userId: Uuid;
  paymentMethod: string;
  amount: Price;
  paidAt: ISO8601 | null;
  productType: Ebook;
  product: unknown;
};

export type OrderDto = OrderCourseDto | OrderEbookDto;
