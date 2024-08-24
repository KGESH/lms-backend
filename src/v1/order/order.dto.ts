import {
  Course,
  Ebook,
  ISO8601,
  Price,
  Uuid,
} from '@src/shared/types/primitive';
import { CourseProductDto } from '@src/v1/product/course-product/course-product.dto';

export type OrderBaseDto = {
  id: Uuid;
  userId: Uuid;
  paymentMethod: string;
  title: string;
  description: string | null;
  amount: Price;
  paidAt: ISO8601 | null;
};

export type OrderCourseDto = OrderBaseDto & {
  productType: Course;
  product: CourseProductDto;
};

export type OrderCoursePurchasedDto = Omit<OrderCourseDto, 'product'> & {
  product: Omit<
    CourseProductDto,
    'content' | 'announcement' | 'refundPolicy' | 'pricing' | 'discounts'
  >;
};

export type OrderEbookDto = OrderBaseDto & {
  productType: Ebook;
  product: unknown;
};

export type OrderEbookPurchasedDto = Omit<OrderEbookDto, 'product'> & {
  product: Omit<
    OrderEbookDto,
    'content' | 'announcement' | 'refundPolicy' | 'pricing' | 'discounts' // Todo: Impl
  >;
};

export type OrderDto = OrderCourseDto | OrderEbookDto;
