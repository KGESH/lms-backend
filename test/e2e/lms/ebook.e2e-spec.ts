import { INestApplication } from '@nestjs/common';
import * as EbookAPI from '@src/api/functional/v1/ebook';
import * as typia from 'typia';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '@src/shared/types/primitive';
import { createEbookCategory } from '../helpers/db/lms/ebook-category.helper';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { createEbook, findEbook } from '../helpers/db/lms/ebook.helper';
import { IEbookCategoryCreate } from '@src/v1/ebook/category/ebook-category.interface';
import { createTeacher } from '../helpers/db/lms/teacher.helper';
import { ITeacherSignUp } from '@src/v1/teacher/teacher.interface';
import { EbookCreateDto, EbookUpdateDto } from '@src/v1/ebook/ebook.dto';
import { IEbookCreate, IEbookUpdate } from '@src/v1/ebook/ebook.interface';
import { ConfigsService } from '@src/configs/configs.service';

describe('EbookController (e2e)', () => {
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

  describe('[Get ebook]', () => {
    it('should be get a ebook', async () => {
      const category = await createEbookCategory(
        {
          ...typia.random<IEbookCategoryCreate>(),
          parentId: null,
        },
        drizzle.db,
      );
      const { teacher } = await createTeacher(
        typia.random<ITeacherSignUp>(),
        drizzle.db,
      );
      const ebook = await createEbook(
        {
          categoryId: category.id,
          teacherId: teacher.id,
          title: 'mock-ebook',
          description: '',
        },
        drizzle.db,
      );
      const response = await EbookAPI.getEbook(
        {
          host,
          headers: { LmsSecret },
        },
        ebook.id,
      );
      if (!response.success) {
        console.error(response.data);
        throw new Error(`assert - ${JSON.stringify(response.data, null, 4)}`);
      }

      const foundEbook = response.data;
      expect(foundEbook).not.toBeNull();
      expect(foundEbook!.title).toEqual('mock-ebook');
    });
  });

  describe('[Get ebooks]', () => {
    it('should be get all ebooks', async () => {
      const category = await createEbookCategory(
        {
          ...typia.random<IEbookCategoryCreate>(),
          parentId: null,
        },
        drizzle.db,
      );
      const { teacher } = await createTeacher(
        typia.random<ITeacherSignUp>(),
        drizzle.db,
      );
      const ebookOne = await createEbook(
        {
          categoryId: category.id,
          teacherId: teacher.id,
          title: 'ebook-one',
          description: '',
        },
        drizzle.db,
      );
      const ebookTwo = await createEbook(
        {
          categoryId: category.id,
          teacherId: teacher.id,
          title: 'ebook-two',
          description: '',
        },
        drizzle.db,
      );

      const response = await EbookAPI.getEbooks(
        {
          host,
          headers: { LmsSecret },
        },
        {},
      );

      if (!response.success) {
        throw new Error('assert');
      }

      const ebooks = response.data;
      expect(
        ebooks.find((ebook) => ebook.title === 'ebook-one'),
      ).not.toBeNull();
      expect(ebooks.find((ebook) => ebook.id === 'ebook-two')).not.toBeNull();
    });
  });

  describe('[Create ebook]', () => {
    it('should be create ebook success', async () => {
      const category = await createEbookCategory(
        {
          ...typia.random<IEbookCategoryCreate>(),
          parentId: null,
        },
        drizzle.db,
      );
      const { teacher, userSession } = await createTeacher(
        typia.random<ITeacherSignUp>(),
        drizzle.db,
      );
      const createDto: EbookCreateDto = {
        categoryId: category.id,
        teacherId: teacher.id,
        title: 'mock-ebook',
        description: '',
      };

      const response = await EbookAPI.createEbook(
        { host, headers: { LmsSecret, UserSessionId: userSession.id } },
        createDto,
      );
      if (!response.success) {
        throw new Error('assert');
      }

      const ebook = response.data;
      expect(ebook.title).toEqual('mock-ebook');
    });

    describe('[Update ebook]', () => {
      it('should be update ebook success', async () => {
        const category = await createEbookCategory(
          {
            ...typia.random<IEbookCategoryCreate>(),
            parentId: null,
          },
          drizzle.db,
        );
        const { teacher, userSession } = await createTeacher(
          typia.random<ITeacherSignUp>(),
          drizzle.db,
        );
        const ebook = await createEbook(
          {
            ...typia.random<IEbookCreate>(),
            categoryId: category.id,
            teacherId: teacher.id,
          },
          drizzle.db,
        );
        const updateDto: EbookUpdateDto = {
          title: 'updated-ebook',
        };

        const response = await EbookAPI.updateEbook(
          {
            host,
            headers: {
              LmsSecret,
              UserSessionId: userSession.id,
            },
          },
          ebook.id,
          updateDto,
        );
        if (!response.success) {
          throw new Error('assert');
        }

        const updatedEbook = response.data;
        expect(updatedEbook.title).toEqual('updated-ebook');
      });
    });

    describe('[Delete ebook]', () => {
      it('should be delete ebook success', async () => {
        const category = await createEbookCategory(
          {
            ...typia.random<IEbookCategoryCreate>(),
            parentId: null,
          },
          drizzle.db,
        );
        const { teacher, userSession } = await createTeacher(
          typia.random<ITeacherSignUp>(),
          drizzle.db,
        );
        const ebook = await createEbook(
          {
            ...typia.random<IEbookCreate>(),
            categoryId: category.id,
            teacherId: teacher.id,
          },
          drizzle.db,
        );

        const response = await EbookAPI.deleteEbook(
          {
            host,
            headers: {
              LmsSecret,
              UserSessionId: userSession.id,
            },
          },
          ebook.id,
        );
        if (!response.success) {
          throw new Error('assert');
        }

        const deletedEbook = response.data;
        expect(deletedEbook.id).toEqual(ebook.id);

        const notFoundResult = await findEbook({ id: ebook.id }, drizzle.db);
        expect(notFoundResult).toBeNull();
      });
    });
  });
});
