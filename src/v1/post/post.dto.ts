import { Uuid } from '@src/shared/types/primitive';
import { Pagination } from '@src/shared/types/pagination';
import { UserDto } from '@src/v1/user/user.dto';
import { OptionalPick } from '@src/shared/types/optional';

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
  'categoryId' | 'title' | 'content'
>;

export type UpdatePostDto = Partial<
  Pick<CreatePostDto, 'categoryId' | 'title' | 'content'>
>;

export type PostQuery = Pick<PostWithContentDto, 'categoryId'> &
  OptionalPick<UserDto, 'displayName'> &
  OptionalPick<PostWithContentDto, 'title' | 'content'> &
  Partial<Pagination>;

export type PostCommentQuery = {
  incrementViewCount?: boolean;
} & Partial<Pagination>;
