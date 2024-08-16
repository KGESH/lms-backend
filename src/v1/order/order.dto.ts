import {
  Course,
  Ebook,
  ISO8601,
  Price,
  Uuid,
} from '../../shared/types/primitive';
import { CourseProductDto } from '../product/course-product/course-product.dto';

export type OrderCourseDto = {
  id: Uuid;
  userId: Uuid;
  paymentMethod: string;
  amount: Price;
  paidAt: ISO8601 | null;
  productType: Course;
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
