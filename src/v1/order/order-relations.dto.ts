import { CourseOrderDto } from '@src/v1/order/course/course-order.dto';
import { EbookOrderDto } from '@src/v1/order/ebook/ebook-order.dto';

export type OrdersDto = {
  courses: CourseOrderDto[];
  ebooks: EbookOrderDto[];
};
