import { OrderBaseDto } from '@src/v1/order/order.dto';
import { CourseWithRelationsDto } from '@src/v1/course/course-with-relations.dto';
import { ProductThumbnailDto } from '@src/v1/product/common/snapshot/thumbnail/product-thumbnail.dto';

export type CourseOrderDto = OrderBaseDto & {
  course: Omit<CourseWithRelationsDto, 'chapters'> & {
    thumbnail: ProductThumbnailDto;
  };
};
