import { OrderBaseDto } from '@src/v1/order/order.dto';
import { CourseWithRelationsDto } from '@src/v1/course/course-with-relations.dto';

export type CourseOrderDto = OrderBaseDto & {
  course: Omit<CourseWithRelationsDto, 'chapters'>;
};
