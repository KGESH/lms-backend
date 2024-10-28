import { dbSchema } from '../../../../../src/infra/db/schema';
import * as typia from 'typia';
import * as date from '../../../../../src/shared/utils/date';
import { createCourse, createRandomCourse } from './course.helper';
import {
  ICourseProduct,
  ICourseProductCreate,
} from '../../../../../src/v1/product/course-product/course-product.interface';
import {
  IProductSnapshot,
  IProductSnapshotCreate,
} from '../../../../../src/v1/product/common/snapshot/product-snapshot.interface';
import {
  IProductSnapshotPricing,
  IProductSnapshotPricingCreate,
} from '../../../../../src/v1/product/common/snapshot/pricing/product-snapshot-pricing.interface';
import {
  IProductSnapshotDiscount,
  IProductSnapshotDiscountCreate,
} from '../../../../../src/v1/product/common/snapshot/discount/product-snapshot-discount.interface';
import { ICourseProductWithRelations } from '../../../../../src/v1/product/course-product/course-product-relations.interface';
import { DiscountValue, Uuid } from '../../../../../src/shared/types/primitive';
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import {
  IProductSnapshotContent,
  IProductSnapshotContentCreate,
} from '../../../../../src/v1/product/common/snapshot/content/product-snapshot-content.interface';
import { IProductSnapshotAnnouncementCreate } from '../../../../../src/v1/product/common/snapshot/announcement/product-snapshot-announcement.interface';
import { IProductSnapshotRefundPolicyCreate } from '../../../../../src/v1/product/common/snapshot/refund-policy/product-snapshot-refund-policy.interface';
import {
  generateRandomDiscount,
  generateRandomPrice,
} from '../../../../../src/shared/helpers/mocks/random-price.mock';
import {
  IProductSnapshotUiContent,
  IProductSnapshotUiContentCreate,
} from '../../../../../src/v1/product/common/snapshot/ui-content/product-snapshot-ui-content.interface';
import { createManyFiles } from './file.helper';
import {
  IProductThumbnail,
  IProductThumbnailCreate,
} from '../../../../../src/v1/product/common/snapshot/thumbnail/product-thumbnail.interface';
import { ICourseWithRelations } from '../../../../../src/v1/course/course-with-relations.interface';
import { MOCK_REFUND_POLICY } from './mock/refund-policy.mock';
import { MOCK_ANNOUNCEMENT } from './mock/announcement.mock';
import { MOCK_CONTENT } from './mock/content.mock';
import { ITeacherWithAccount } from '../../../../../src/v1/teacher/teacher.interface';
import { createCourseCategory } from './course-category.helper';
import { createManyChapter } from './chapter.helper';
import { createManyLesson } from './lesson.helper';
import { createManyLessonContent } from './lesson-content.helper';
import { LOREM_IPSUM } from './mock/lorem-ipsum.mock';
import { createTeacher } from './teacher.helper';
import { IFileCreate } from '@src/v1/file/file.interface';

export const createCourseProduct = async (
  params: ICourseProductCreate,
  db: TransactionClient,
): Promise<ICourseProduct> => {
  const [product] = await db
    .insert(dbSchema.courseProducts)
    .values(params)
    .returning();

  return product;
};

export const createCourseProductSnapshot = async (
  params: IProductSnapshotCreate,
  db: TransactionClient,
): Promise<IProductSnapshot> => {
  const [snapshot] = await db
    .insert(dbSchema.courseProductSnapshots)
    .values(params)
    .returning();

  return snapshot;
};

export const createCourseProductThumbnail = async (
  params: IFileCreate,
  db: TransactionClient,
): Promise<IProductThumbnail> => {
  const [thumbnail] = await createManyFiles([params], db);
  return typia.assert<IProductThumbnail>(thumbnail);
};

export const createCourseProductAnnouncement = async (
  params: IProductSnapshotAnnouncementCreate,
  db: TransactionClient,
): Promise<IProductSnapshotContent> => {
  const [announcement] = await db
    .insert(dbSchema.courseProductSnapshotAnnouncements)
    .values(params)
    .returning();

  return announcement;
};

export const createCourseProductSnapshotRefundPolicy = async (
  params: IProductSnapshotRefundPolicyCreate,
  db: TransactionClient,
) => {
  const [refundPolicy] = await db
    .insert(dbSchema.courseProductSnapshotRefundPolicies)
    .values(params)
    .returning();

  return refundPolicy;
};

export const createCourseProductSnapshotContent = async (
  params: IProductSnapshotContentCreate,
  db: TransactionClient,
): Promise<IProductSnapshotContent> => {
  const [content] = await db
    .insert(dbSchema.courseProductSnapshotContents)
    .values(params)
    .returning();

  return content;
};

export const createCourseProductSnapshotUiContent = async (
  params: IProductSnapshotUiContentCreate[],
  db: TransactionClient,
): Promise<IProductSnapshotUiContent[]> => {
  if (params.length === 0) {
    return [];
  }

  const uiContents = await db
    .insert(dbSchema.courseProductSnapshotUiContents)
    .values(params)
    .returning();

  return uiContents;
};

export const createCourseProductSnapshotPricing = async (
  params: IProductSnapshotPricingCreate,
  db: TransactionClient,
): Promise<IProductSnapshotPricing> => {
  const [pricing] = await db
    .insert(dbSchema.courseProductSnapshotPricing)
    .values(params)
    .returning();

  return typia.assert<IProductSnapshotPricing>(pricing);
};

export const createCourseProductSnapshotDiscount = async (
  params: IProductSnapshotDiscountCreate,
  db: TransactionClient,
): Promise<IProductSnapshotDiscount> => {
  const [discount] = await db
    .insert(dbSchema.courseProductSnapshotDiscounts)
    .values(params)
    .returning();

  return {
    ...discount,
    value: typia.assert<DiscountValue>(`${discount.value}`),
  };
};

export const createRandomCourseProduct = async (
  db: TransactionClient,
  index?: number,
): Promise<ICourseProductWithRelations> => {
  const {
    course,
    user,
    userSession,
    teacher,
    category,
    chapters,
    lessons,
    lessonContents,
  } = await createRandomCourse(db);
  const product = await createCourseProduct(
    {
      ...typia.random<ICourseProductCreate>(),
      courseId: course.id,
    },
    db,
  );

  const thumbnail = await createCourseProductThumbnail(
    {
      id: typia.random<Uuid>(),
      filename: 'editrix.png',
      metadata: null,
      type: 'image',
      url: 'https://aceternity.com/images/products/thumbnails/new/editrix.png',
    },
    db,
  );
  const snapshot = await createCourseProductSnapshot(
    {
      ...typia.random<IProductSnapshotCreate>(),
      thumbnailId: thumbnail.id,
      productId: product.id,
      title: `테스트 온라인 강의 ${index ?? ''}`,
      description: '테스트 온라인 강의 상품입니다.',
      availableDays: null,
    } satisfies IProductSnapshotCreate,
    db,
  );
  const announcement = await createCourseProductAnnouncement(
    {
      productSnapshotId: snapshot.id,
      richTextContent: '테스트 공지사항입니다.',
    },
    db,
  );
  const refundPolicy = await createCourseProductSnapshotRefundPolicy(
    {
      productSnapshotId: snapshot.id,
      richTextContent: '테스트 환불 정책입니다.',
    },
    db,
  );
  const content = await createCourseProductSnapshotContent(
    {
      productSnapshotId: snapshot.id,
      richTextContent: '테스트 강의 상품 설명입니다.',
    },
    db,
  );
  const pricing = await createCourseProductSnapshotPricing(
    {
      productSnapshotId: snapshot.id,
      amount: generateRandomPrice(),
    },
    db,
  );
  const discount = await createCourseProductSnapshotDiscount(
    {
      ...generateRandomDiscount(),
      enabled: true,
      productSnapshotId: snapshot.id,
      validFrom: date.now('date'),
      validTo: date.addDate(date.now('date'), 1, 'month', 'date'),
    },
    db,
  );
  const uiContents = await createCourseProductSnapshotUiContent(
    typia.random<IProductSnapshotUiContentCreate[]>().map((params) => ({
      ...params,
      productSnapshotId: snapshot.id,
    })),
    db,
  );

  return {
    ...product,
    course: {
      ...course,
      teacher: {
        ...teacher,
        account: user,
      },
      category,
      chapters: chapters.map((chapter) => ({
        ...chapter,
        lessons: lessons.map((lesson) => ({
          ...lesson,
          lessonContents: lessonContents,
        })),
      })),
    },
    lastSnapshot: {
      ...snapshot,
      thumbnail,
      announcement,
      refundPolicy,
      content,
      pricing,
      discount,
      uiContents,
    },
  };
};

export const seedCourseProducts = async (
  { count }: { count: number },
  db: TransactionClient,
) => {
  return await Promise.all(
    Array.from({ length: count }).map((_, index) =>
      createRandomCourseProduct(db, index + 1),
    ),
  );
};

export const seedPgTeacher = async (db: TransactionClient) => {
  const userId = typia.random<Uuid>();
  return await createTeacher(
    {
      userCreateParams: {
        id: userId,
        displayName: '김멘사',
        email: 'kim.mensa.123@gmail.com',
        password: 'kim.mensa.123@gmail.com',
        emailVerified: null,
        image: null,
      },
      accountCreateParams: {
        userId,
        providerId: typia.random<Uuid>(),
        providerType: 'email',
      },
      infoCreateParams: {
        userId,
        name: '김선율',
        birthDate: '1997-12-01',
        connectingInformation: null,
        duplicationInformation: null,
        gender: 'male',
        phoneNumber: '+821098764543',
      },
    },
    db,
  );
};

export const seedPgFirstCourse = async (
  teacherUser: ITeacherWithAccount,
  db: TransactionClient,
): Promise<ICourseWithRelations> => {
  const courseCategory = await createCourseCategory(
    {
      name: '경제',
      description: '경제 강의',
      parentId: null,
    },
    db,
  );
  const course = await createCourse(
    {
      title: '대한민국 경제시장 40년 압축',
      categoryId: courseCategory.id,
      description: '대한민국 경제시장 40년 압축 VOD',
      teacherId: teacherUser.id,
    },
    db,
  );
  const chapters = await createManyChapter(
    Array.from({ length: 10 }, (_, index) => ({
      title: `대한민국 경제시장 40년 압축 강의 ${index + 1}`,
      description: `대한민국 경제시장 40년 압축 강의 ${index + 1}`,
      sequence: index + 1,
      courseId: course.id,
    })),
    db,
  );
  const lessons = (
    await Promise.all(
      chapters.map((chapter) => {
        return createManyLesson(
          Array.from({ length: 10 }, (_, index) => ({
            title: `대한민국 경제시장 40년 압축 강의 ${index + 1}번째`,
            sequence: index + 1,
            description: LOREM_IPSUM,
            chapterId: chapter.id,
          })),
          db,
        );
      }),
    )
  ).flat();
  const lessonContents = (
    await Promise.all(
      lessons.map((lesson, index) => {
        return createManyLessonContent(
          [
            {
              contentType: 'video',
              title: `대한민국 경제시장 40년 압축 강의 ${index + 1}번째`,
              description: LOREM_IPSUM,
              fileId: null,
              metadata: null,
              sequence: index + 1,
              lessonId: lesson.id,
            },
            {
              contentType: 'text',
              title: `대한민국 경제시장 40년 압축 강의 ${index + 1}번째`,
              description: LOREM_IPSUM,
              fileId: null,
              metadata: null,
              sequence: index + 1,
              lessonId: lesson.id,
            },
          ],
          db,
        );
      }),
    )
  ).flat();

  return {
    ...course,
    teacher: teacherUser,
    category: courseCategory,
    chapters: chapters.map((chapter) => ({
      ...chapter,
      lessons: lessons.map((lesson) => ({
        ...lesson,
        lessonContents: lessonContents,
      })),
    })),
  };
};

export const seedPgSecondCourse = async (
  teacherUser: ITeacherWithAccount,
  db: TransactionClient,
): Promise<ICourseWithRelations> => {
  const courseCategory = await createCourseCategory(
    {
      name: '경제',
      description: '경제 강의',
      parentId: null,
    },
    db,
  );
  const course = await createCourse(
    {
      title: `모르면 큰일나는 경제상식 20가지 요약본`,
      categoryId: courseCategory.id,
      description: `모르면 큰일나는 경제상식 20가지 요약본 VOD`,
      teacherId: teacherUser.id,
    },
    db,
  );
  const chapters = await createManyChapter(
    Array.from({ length: 10 }, (_, index) => ({
      title: `대한민국 경제시장 40년 압축 강의 ${index + 1}`,
      description: `대한민국 경제시장 40년 압축 강의 ${index + 1}`,
      sequence: index + 1,
      courseId: course.id,
    })),
    db,
  );
  const lessons = (
    await Promise.all(
      chapters.map((chapter) => {
        return createManyLesson(
          Array.from({ length: 10 }, (_, index) => ({
            title: `모르면 큰일나는 경제상식 20가지 요약본 ${index + 1}번째`,
            sequence: index + 1,
            description: LOREM_IPSUM,
            chapterId: chapter.id,
          })),
          db,
        );
      }),
    )
  ).flat();
  const lessonContents = (
    await Promise.all(
      lessons.map((lesson, index) => {
        return createManyLessonContent(
          [
            {
              contentType: 'video',
              title: `모르면 큰일나는 경제상식 20가지 요약본 ${index + 1}번째`,
              description: LOREM_IPSUM,
              fileId: null,
              metadata: null,
              sequence: index + 1,
              lessonId: lesson.id,
            },
            {
              contentType: 'text',
              title: `모르면 큰일나는 경제상식 20가지 요약본 ${index + 1}번째`,
              description: LOREM_IPSUM,
              fileId: null,
              metadata: null,
              sequence: index + 1,
              lessonId: lesson.id,
            },
          ],
          db,
        );
      }),
    )
  ).flat();

  return {
    ...course,
    teacher: teacherUser,
    category: courseCategory,
    chapters: chapters.map((chapter) => ({
      ...chapter,
      lessons: lessons.map((lesson) => ({
        ...lesson,
        lessonContents: lessonContents,
      })),
    })),
  };
};

export const seedPgThirdCourse = async (
  teacherUser: ITeacherWithAccount,
  db: TransactionClient,
): Promise<ICourseWithRelations> => {
  const courseCategory = await createCourseCategory(
    {
      name: '경제 분석',
      description: '경제 분석 강의',
      parentId: null,
    },
    db,
  );
  const course = await createCourse(
    {
      title: '김멘사 경제 분석',
      categoryId: courseCategory.id,
      description: '김멘사 경제 분석 VOD',
      teacherId: teacherUser.id,
    },
    db,
  );
  const chapters = await createManyChapter(
    Array.from({ length: 10 }, (_, index) => ({
      title: `김멘사 경제 분석 강의 ${index + 1}`,
      description: `김멘사 경제 분석 강의 ${index + 1}`,
      sequence: index + 1,
      courseId: course.id,
    })),
    db,
  );
  const lessons = (
    await Promise.all(
      chapters.map((chapter) => {
        return createManyLesson(
          Array.from({ length: 10 }, (_, index) => ({
            title: `김멘사 경제 분석 강의 ${index + 1}번째`,
            sequence: index + 1,
            description: LOREM_IPSUM,
            chapterId: chapter.id,
          })),
          db,
        );
      }),
    )
  ).flat();
  const lessonContents = (
    await Promise.all(
      lessons.map((lesson, index) => {
        return createManyLessonContent(
          [
            {
              contentType: 'video',
              title: `김멘사 경제 분석 강의 ${index + 1}번째`,
              description: LOREM_IPSUM,
              fileId: null,
              metadata: null,
              sequence: index + 1,
              lessonId: lesson.id,
            },
            {
              contentType: 'text',
              title: `김멘사 경제 분석 강의 ${index + 1}번째`,
              description: LOREM_IPSUM,
              fileId: null,
              metadata: null,
              sequence: index + 1,
              lessonId: lesson.id,
            },
          ],
          db,
        );
      }),
    )
  ).flat();

  return {
    ...course,
    teacher: teacherUser,
    category: courseCategory,
    chapters: chapters.map((chapter) => ({
      ...chapter,
      lessons: lessons.map((lesson) => ({
        ...lesson,
        lessonContents: lessonContents,
      })),
    })),
  };
};

export const seedPgFirstCourseProduct = async (
  course: ICourseWithRelations,
  db: TransactionClient,
) => {
  const product = await createCourseProduct({ courseId: course.id }, db);
  const thumbnail = await createCourseProductThumbnail(
    {
      id: typia.random<Uuid>(),
      metadata: null,
      type: 'image',
      filename: '대한민국 경제시장 40년 압축.png',
      url: `https://cdn3.wadiz.kr/studio/images/2024/08/21/4f8089c0-3f44-415d-8be7-23401757e8b3.jpg`,
    },
    db,
  );
  const snapshot = await createCourseProductSnapshot(
    {
      ...typia.random<IProductSnapshotCreate>(),
      thumbnailId: thumbnail.id,
      productId: product.id,
      title: `대한민국 경제시장 40년 압축 강의`,
      description: '대한민국 경제시장 40년 압축 강의 상품입니다.',
      availableDays: null,
    } satisfies IProductSnapshotCreate,
    db,
  );
  const announcement = await createCourseProductAnnouncement(
    {
      productSnapshotId: snapshot.id,
      richTextContent: MOCK_ANNOUNCEMENT,
    },
    db,
  );
  const refundPolicy = await createCourseProductSnapshotRefundPolicy(
    {
      productSnapshotId: snapshot.id,
      richTextContent: MOCK_REFUND_POLICY,
    },
    db,
  );
  const content = await createCourseProductSnapshotContent(
    {
      productSnapshotId: snapshot.id,
      richTextContent: MOCK_CONTENT,
    },
    db,
  );
  const pricing = await createCourseProductSnapshotPricing(
    {
      productSnapshotId: snapshot.id,
      amount: `${500_000}`,
    },
    db,
  );
  const discount = await createCourseProductSnapshotDiscount(
    {
      enabled: true,
      value: `30`,
      discountType: 'percent',
      productSnapshotId: snapshot.id,
      validFrom: date.now('date'),
      validTo: date.addDate(date.now('date'), 1, 'month', 'date'),
    },
    db,
  );
  const uiContents = await createCourseProductSnapshotUiContent(
    typia.random<IProductSnapshotUiContentCreate[]>().map((params) => ({
      ...params,
      productSnapshotId: snapshot.id,
    })),
    db,
  );
};

export const seedPgSecondCourseProduct = async (
  course: ICourseWithRelations,
  db: TransactionClient,
) => {
  const product = await createCourseProduct({ courseId: course.id }, db);
  const thumbnail = await createCourseProductThumbnail(
    {
      id: typia.random<Uuid>(),
      metadata: null,
      filename: '모르면 큰일나는 경제상식 20가지 요약본.png',
      type: 'image',
      url: `https://cdn3.wadiz.kr/studio/images/2024/08/21/4f8089c0-3f44-415d-8be7-23401757e8b3.jpg`,
    },
    db,
  );
  const snapshot = await createCourseProductSnapshot(
    {
      ...typia.random<IProductSnapshotCreate>(),
      thumbnailId: thumbnail.id,
      productId: product.id,
      title: `모르면 큰일나는 경제상식 20가지 요약본`,
      description: '모르면 큰일나는 경제상식 20가지 요약본 상품입니다.',
      availableDays: null,
    } satisfies IProductSnapshotCreate,
    db,
  );
  const announcement = await createCourseProductAnnouncement(
    {
      productSnapshotId: snapshot.id,
      richTextContent: MOCK_ANNOUNCEMENT,
    },
    db,
  );
  const refundPolicy = await createCourseProductSnapshotRefundPolicy(
    {
      productSnapshotId: snapshot.id,
      richTextContent: MOCK_REFUND_POLICY,
    },
    db,
  );
  const content = await createCourseProductSnapshotContent(
    {
      productSnapshotId: snapshot.id,
      richTextContent: MOCK_CONTENT,
    },
    db,
  );
  const pricing = await createCourseProductSnapshotPricing(
    {
      productSnapshotId: snapshot.id,
      amount: `${600_000}`,
    },
    db,
  );
  const discount = await createCourseProductSnapshotDiscount(
    {
      enabled: true,
      value: `30`,
      discountType: 'percent',
      productSnapshotId: snapshot.id,
      validFrom: date.now('date'),
      validTo: date.addDate(date.now('date'), 1, 'month', 'date'),
    },
    db,
  );
  const uiContents = await createCourseProductSnapshotUiContent(
    typia.random<IProductSnapshotUiContentCreate[]>().map((params) => ({
      ...params,
      productSnapshotId: snapshot.id,
    })),
    db,
  );
};

export const seedPgThirdCourseProduct = async (
  course: ICourseWithRelations,
  db: TransactionClient,
) => {
  const product = await createCourseProduct({ courseId: course.id }, db);
  const thumbnail = await createCourseProductThumbnail(
    {
      id: typia.random<Uuid>(),
      metadata: null,
      filename: '김멘사 경제 분석.png',
      type: 'image',
      url: `https://cdn3.wadiz.kr/studio/images/2024/08/21/b0d6938e-ea57-43b6-b68a-ab1ae39cfdee.png`,
    },
    db,
  );
  const snapshot = await createCourseProductSnapshot(
    {
      ...typia.random<IProductSnapshotCreate>(),
      thumbnailId: thumbnail.id,
      productId: product.id,
      title: `김멘사 경제 분석`,
      description: '김멘사 경제 분석 상품입니다.',
      availableDays: null,
    } satisfies IProductSnapshotCreate,
    db,
  );
  const announcement = await createCourseProductAnnouncement(
    {
      productSnapshotId: snapshot.id,
      richTextContent: MOCK_ANNOUNCEMENT,
    },
    db,
  );
  const refundPolicy = await createCourseProductSnapshotRefundPolicy(
    {
      productSnapshotId: snapshot.id,
      richTextContent: MOCK_REFUND_POLICY,
    },
    db,
  );
  const content = await createCourseProductSnapshotContent(
    {
      productSnapshotId: snapshot.id,
      richTextContent: MOCK_CONTENT,
    },
    db,
  );
  const pricing = await createCourseProductSnapshotPricing(
    {
      productSnapshotId: snapshot.id,
      amount: `${600_000}`,
    },
    db,
  );
  const discount = await createCourseProductSnapshotDiscount(
    {
      enabled: true,
      value: `30`,
      discountType: 'percent',
      productSnapshotId: snapshot.id,
      validFrom: date.now('date'),
      validTo: date.addDate(date.now('date'), 1, 'month', 'date'),
    },
    db,
  );
  const uiContents = await createCourseProductSnapshotUiContent(
    typia.random<IProductSnapshotUiContentCreate[]>().map((params) => ({
      ...params,
      productSnapshotId: snapshot.id,
    })),
    db,
  );
};
