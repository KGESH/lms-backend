import { Injectable } from '@nestjs/common';
import { IPost } from '@src/v1/post/post.interface';
import { eq, desc, asc, countDistinct, and, isNull, sql } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { Paginated, Pagination } from '@src/shared/types/pagination';
import {
  IPostRelations,
  IPostRelationsWithCommentCount,
  IPostWithSnapshot,
} from '@src/v1/post/post-relations.interface';

@Injectable()
export class PostQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findPost(where: Pick<IPost, 'id'>): Promise<IPost | null> {
    const post = await this.drizzle.db.query.posts.findFirst({
      where: and(
        eq(dbSchema.posts.id, where.id),
        isNull(dbSchema.posts.deletedAt),
      ),
    });

    return post ?? null;
  }

  async findPostWithSnapshot(
    where: Pick<IPost, 'id'>,
  ): Promise<IPostWithSnapshot | null> {
    const post = await this.drizzle.db.query.posts.findFirst({
      where: and(
        eq(dbSchema.posts.id, where.id),
        isNull(dbSchema.posts.deletedAt),
      ),
      with: {
        snapshots: {
          orderBy: (snapshot, { desc }) => desc(snapshot.createdAt),
          limit: 1,
        },
      },
    });

    if (!post?.snapshots[0]) {
      return null;
    }

    return {
      ...post,
      snapshot: post.snapshots[0],
    };
  }

  async findPostsByCategory(
    where: Pick<IPost, 'categoryId'>,
    pagination: Pagination,
  ): Promise<Paginated<IPostRelationsWithCommentCount[]>> {
    const latestSnapshotQuery = this.drizzle.db
      .select({
        id: dbSchema.postSnapshots.id,
      })
      .from(dbSchema.postSnapshots)
      .where(eq(dbSchema.postSnapshots.postId, dbSchema.posts.id))
      .orderBy(desc(dbSchema.postSnapshots.createdAt))
      .limit(1);

    const posts = await this.drizzle.db
      .select({
        id: dbSchema.posts.id,
        userId: dbSchema.posts.userId,
        categoryId: dbSchema.posts.categoryId,
        viewCount: dbSchema.posts.viewCount,
        createdAt: dbSchema.posts.createdAt,
        deletedAt: dbSchema.posts.deletedAt,
        category: dbSchema.postCategories,
        snapshot: dbSchema.postSnapshots,
        author: dbSchema.users,
        totalPostCount: sql<number>`count(*) over()`.mapWith(Number),
        likeCount: countDistinct(dbSchema.postLikes.id),
        commentCount: countDistinct(dbSchema.postComments.id),
      })
      .from(dbSchema.posts)
      .where(
        and(
          eq(dbSchema.posts.categoryId, where.categoryId),
          isNull(dbSchema.posts.deletedAt),
        ),
      )
      .innerJoin(
        dbSchema.postCategories,
        eq(dbSchema.posts.categoryId, dbSchema.postCategories.id),
      )
      .innerJoin(
        dbSchema.postSnapshots,
        eq(dbSchema.postSnapshots.id, latestSnapshotQuery),
      )
      .innerJoin(dbSchema.users, eq(dbSchema.posts.userId, dbSchema.users.id))
      .leftJoin(
        dbSchema.postLikes,
        eq(dbSchema.posts.id, dbSchema.postLikes.postId),
      )
      .leftJoin(
        dbSchema.postComments,
        eq(dbSchema.posts.id, dbSchema.postComments.postId),
      )
      .groupBy(
        dbSchema.posts.id,
        dbSchema.postSnapshots.id,
        dbSchema.postCategories.id,
        dbSchema.users.id,
      )
      .orderBy(
        pagination.orderBy === 'asc'
          ? asc(dbSchema.posts.createdAt)
          : desc(dbSchema.posts.createdAt),
      )
      .offset((pagination.page - 1) * pagination.pageSize)
      .limit(pagination.pageSize);

    return {
      data: posts.map((post) => ({
        ...post,
        snapshot: post.snapshot,
        category: post.category,
        likeCount: post.likeCount,
        author: post.author,
        commentCount: post.commentCount,
      })),
      totalCount: posts[0].totalPostCount,
      pagination,
    };
  }

  async findPostWithRelations(
    where: Pick<IPost, 'id'>,
  ): Promise<IPostRelations | null> {
    // Subquery to fetch the latest snapshot of a post
    const latestSnapshotQuery = this.drizzle.db
      .select({
        id: dbSchema.postSnapshots.id,
      })
      .from(dbSchema.postSnapshots)
      .where(eq(dbSchema.postSnapshots.postId, dbSchema.posts.id))
      .orderBy(desc(dbSchema.postSnapshots.createdAt))
      .limit(1);

    // Fetch post data with related comments and their latest snapshots
    const query = this.drizzle.db
      .select({
        post: dbSchema.posts,
        category: dbSchema.postCategories,
        snapshot: dbSchema.postSnapshots,
        author: dbSchema.users,
        likeCount: countDistinct(dbSchema.postLikes.id),
      })
      .from(dbSchema.posts)
      .where(
        and(eq(dbSchema.posts.id, where.id), isNull(dbSchema.posts.deletedAt)),
      )
      .innerJoin(
        dbSchema.postCategories,
        eq(dbSchema.posts.categoryId, dbSchema.postCategories.id),
      )
      .innerJoin(
        dbSchema.postSnapshots,
        eq(dbSchema.postSnapshots.id, latestSnapshotQuery),
      )
      .innerJoin(dbSchema.users, eq(dbSchema.posts.userId, dbSchema.users.id))
      .leftJoin(
        dbSchema.postLikes,
        eq(dbSchema.posts.id, dbSchema.postLikes.postId),
      )
      .groupBy(
        dbSchema.posts.id,
        dbSchema.postCategories.id,
        dbSchema.postSnapshots.id,
        dbSchema.users.id,
      );

    // const rows = await explainAnalyze(this.drizzle.db, query);
    const rows = await query;
    const [postRelations] = rows;
    if (!postRelations) {
      return null;
    }

    return {
      ...postRelations.post,
      category: postRelations.category,
      likeCount: postRelations.likeCount,
      snapshot: postRelations.snapshot,
      author: postRelations.author,
    };
  }
}
