import { Injectable, NotFoundException } from '@nestjs/common';
import { PostQueryRepository } from '@src/v1/post/post-query.repository';
import { IPost } from '@src/v1/post/post.interface';
import { IPostWithSnapshot } from '@src/v1/post/post-relations.interface';

@Injectable()
export class PostService {
  constructor(private readonly postQueryRepository: PostQueryRepository) {}

  async findPostOrThrow(where: Pick<IPost, 'id'>): Promise<IPost> {
    const post = await this.postQueryRepository.findPost(where);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async findPostWithSnapshotOrThrow(
    where: Pick<IPost, 'id'>,
  ): Promise<IPostWithSnapshot> {
    const postWithSnapshot =
      await this.postQueryRepository.findPostWithSnapshot(where);

    if (!postWithSnapshot) {
      throw new NotFoundException(
        '[FindPostWithSnapshotOrThrow] Post not found',
      );
    }

    return postWithSnapshot;
  }
}
