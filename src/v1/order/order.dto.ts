import {
  Course,
  Ebook,
  ISO8601,
  Price,
  Uuid,
} from '@src/shared/types/primitive';
import { CourseProductDto } from '@src/v1/product/course-product/course-product.dto';
import { EbookProductDto } from '@src/v1/product/ebook-product/ebook-product.dto';

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
  product: Omit<CourseProductDto, 'course'>;
};

export type OrderCoursePurchasedDto = Omit<OrderCourseDto, 'product'> & {
  product: Omit<
    CourseProductDto,
    | 'content'
    | 'tableOfContent'
    | 'preview'
    | 'announcement'
    | 'refundPolicy'
    | 'pricing'
    | 'discount'
    | 'uiContents'
  >;
};

export type OrderEbookDto = OrderBaseDto & {
  productType: Ebook;
  product: Omit<EbookProductDto, 'ebook'>;
};

export type OrderEbookPurchasedDto = Omit<OrderEbookDto, 'product'> & {
  product: Omit<
    EbookProductDto,
    | 'content'
    | 'tableOfContent'
    | 'preview'
    | 'announcement'
    | 'refundPolicy'
    | 'pricing'
    | 'discount'
    | 'uiContents'
  >;
};
