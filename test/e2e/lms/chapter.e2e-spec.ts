import { INestApplication } from '@nestjs/common';
import * as ChapterAPI from '@src/api/functional/v1/course/chapter';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '@src/shared/types/primitive';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { createChapter, findChapter } from '../helpers/db/lms/chapter.helper';
import { createRandomCourse } from '../helpers/db/lms/course.helper';
import {
  ChapterCreateDto,
  ChapterUpdateDto,
} from '@src/v1/course/chapter/chapter.dto';
import { ConfigsService } from '@src/configs/configs.service';
import { seedUsers } from '../helpers/db/lms/user.helper';

describe('ChapterController (e2e)', () => {
  let host: Uri;
  let app: INestApplication;
  let drizzle: DrizzleService;
  let configs: ConfigsService;
  let LmsSecret: string;

  beforeEach(async () => {
    app = await createTestingServer();
    host = await app.getUrl();
    drizzle = await app.get(DrizzleService);
    configs = await app.get(ConfigsService);
    LmsSecret = configs.env.LMS_SECRET;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('[Get chapter]', () => {
    it('should be get a chapter', async () => {
      const { course } = await createRandomCourse(drizzle.db);
      const chapter = await createChapter(
        {
          title: 'mock-chapter',
          courseId: course.id,
          description: '',
          sequence: 0,
        },
        drizzle.db,
      );
      const response = await ChapterAPI.getChapter(
        {
          host,
          headers: { LmsSecret },
        },
        course.id,
        chapter.id,
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const foundChapter = response.data;
      expect(foundChapter).not.toBeNull();
      expect(foundChapter!.title).toEqual('mock-chapter');
    });
  });

  describe('[Get chapters]', () => {
    it('should be get all chapters', async () => {
      const { course } = await createRandomCourse(drizzle.db);
      const chapterOne = await createChapter(
        {
          title: 'chapter-one',
          courseId: course.id,
          description: '',
          sequence: 0,
        },
        drizzle.db,
      );
      const chapterTwo = await createChapter(
        {
          title: 'chapter-two',
          courseId: course.id,
          description: '',
          sequence: 1,
        },
        drizzle.db,
      );

      const response = await ChapterAPI.getChapters(
        {
          host,
          headers: { LmsSecret },
        },
        course.id,
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const chapters = response.data;
      expect(
        chapters.find((chapter) => chapter.title === 'chapter-one'),
      ).not.toBeNull();
      expect(
        chapters.find((chapter) => chapter.id === 'chapter-two'),
      ).not.toBeNull();
    });
  });

  describe('[Create chapter]', () => {
    it('should be create chapter success', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];

      const { course } = await createRandomCourse(drizzle.db);
      const createDto: ChapterCreateDto = {
        title: 'mock-chapter',
        sequence: 0,
        description: '',
      };

      const response = await ChapterAPI.createChapter(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        course.id,
        createDto,
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const chapter = response.data;
      expect(chapter.title).toEqual('mock-chapter');
    });

    describe('[Update chapter]', () => {
      it('should be update chapter success', async () => {
        const admin = (
          await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
        )[0];

        const { course } = await createRandomCourse(drizzle.db);
        const chapter = await createChapter(
          {
            title: 'old-chapter',
            courseId: course.id,
            description: '',
            sequence: 0,
          },
          drizzle.db,
        );
        const updateDto: ChapterUpdateDto = {
          title: 'updated-chapter',
        };

        const response = await ChapterAPI.updateChapter(
          {
            host,
            headers: {
              LmsSecret,
              UserSessionId: admin.userSession.id,
            },
          },
          course.id,
          chapter.id,
          updateDto,
        );
        if (!response.success) {
          const message = JSON.stringify(response.data, null, 4);
          throw new Error(`assert - ${message}`);
        }

        const updatedChapter = response.data;
        expect(updatedChapter.title).toEqual('updated-chapter');
      });
    });

    describe('[Delete chapter]', () => {
      it('should be delete chapter success', async () => {
        const admin = (
          await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
        )[0];

        const { course } = await createRandomCourse(drizzle.db);
        const chapter = await createChapter(
          {
            title: 'chapter',
            courseId: course.id,
            description: '',
            sequence: 0,
          },
          drizzle.db,
        );

        const response = await ChapterAPI.deleteChapter(
          {
            host,
            headers: {
              LmsSecret,
              UserSessionId: admin.userSession.id,
            },
          },
          course.id,
          chapter.id,
        );
        if (!response.success) {
          const message = JSON.stringify(response.data, null, 4);
          throw new Error(`assert - ${message}`);
        }

        const deletedChapter = response.data;
        expect(deletedChapter.id).toEqual(chapter.id);

        const notFoundResult = await findChapter(
          { id: chapter.id },
          drizzle.db,
        );
        expect(notFoundResult).toBeNull();
      });
    });
  });
});
