import { ICourseOrderRelations } from '@src/v1/order/course/course-order.interface';
import { IEbookOrderRelations } from '@src/v1/order/ebook/ebook-order.interface';

export type IOrderRelations = ICourseOrderRelations | IEbookOrderRelations;
