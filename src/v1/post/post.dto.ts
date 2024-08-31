import { Uuid } from '@src/shared/types/primitive';
import { Pagination } from '@src/shared/types/pagination';

export type PostDto = {
  id: Uuid;
  userId: Uuid;
  categoryId: Uuid;
  viewCount: number;
  createdAt: Date;
  deletedAt: Date | null;
};

export type PostWithContentDto = PostDto & {
  title: string;
  content: string;
};

export type CreatePostDto = Pick<
  PostWithContentDto,
  'userId' | 'categoryId' | 'title' | 'content'
>;

export type UpdatePostDto = Partial<
  Pick<CreatePostDto, 'categoryId' | 'title' | 'content'>
>;

export type PostQuery = Pick<PostWithContentDto, 'categoryId'> &
  Partial<Pagination>;
