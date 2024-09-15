// import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import { DrizzleService } from '@src/infra/db/drizzle.service';
// import { IReviewWithRelations } from '@src/v1/review/review.interface';
// import { ReviewRepository } from '@src/v1/review/review.repository';
// import { ReviewSnapshotRepository } from '@src/v1/review/review-snapshot.repository';
// import { ICourseReviewRelationsCreate } from '@src/v1/review/course-review/course-review.interface';
// import { CourseReviewRepository } from '@src/v1/review/course-review/course-review.repository';
// import { MockCourseReviewQueryRepository } from '@src/v1/review/mock-review/mock-course-review-query.repository';
//
// @Injectable()
// export class CourseReviewAdminService {
//   constructor(
//     private readonly reviewRepository: ReviewRepository,
//     private readonly courseReviewRepository: CourseReviewRepository,
//     private readonly mockCourseReviewQueryRepository: MockCourseReviewQueryRepository,
//     private readonly reviewSnapshotRepository: ReviewSnapshotRepository,
//     private readonly drizzle: DrizzleService,
//   ) {}
//
//   async createCourseReviewByAdmin(
//     params: ICourseReviewRelationsCreate,
//   ): Promise<IReviewWithRelations> {
//     const { mockReview, mockCourseReview, mockReviewSnapshot } =
//       await this.drizzle.db.transaction(async (tx) => {
//         const mockReview = await this.reviewRepository.createReview(
//           {
//             orderId: null,
//             userId: params.userId,
//             productType: 'course',
//           },
//           tx,
//         );
//         const mockCourseReview =
//           await this.courseReviewRepository.createCourseReview(
//             {
//               courseId: params.courseId,
//               reviewId: mockReview.id,
//               createdAt: mockReview.createdAt,
//             },
//             tx,
//           );
//         const mockReviewSnapshot = await this.reviewSnapshotRepository.create(
//           {
//             reviewId: mockReview.id,
//             comment: params.comment,
//             rating: params.rating,
//           },
//           tx,
//         );
//         return { mockReview, mockCourseReview, mockReviewSnapshot };
//       });
//
//     const mockReviewWithReplies =
//       await this.mockCourseReviewQueryRepository.findMockCourseReview({
//         id: mockReview.id,
//       });
//
//     if (!mockReviewWithReplies) {
//       throw new InternalServerErrorException('Failed to create mock review');
//     }
//
//     return mockReviewWithReplies;
//   }
// }
