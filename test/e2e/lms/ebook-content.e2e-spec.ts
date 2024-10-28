import { INestApplication } from '@nestjs/common';
import * as EbookAPI from '@src/api/functional/v1/ebook';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '@src/shared/types/primitive';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { createRandomEbook } from '../helpers/db/lms/ebook.helper';
import { ConfigsService } from '@src/configs/configs.service';
import { createEbookEnrollment } from '../helpers/db/lms/ebook-enrollment';
import { seedUsers } from '../helpers/db/lms/user.helper';

describe('EbookContentController (e2e)', () => {
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

  describe('[Get ebook content]', () => {
    it('should be get a ebook content success', async () => {
      const { ebook, ebookContents } = await createRandomEbook(drizzle.db);
      const [student] = await seedUsers({ count: 1, role: 'user' }, drizzle.db);
      const mockEnrollment = await createEbookEnrollment(
        {
          ebookId: ebook.id,
          userId: student.user.id,
          validUntil: null,
        },
        drizzle.db,
      );

      const response = await EbookAPI.content.getEbookContentWithFile(
        {
          host,
          headers: { LmsSecret, UserSessionId: student.userSession.id },
        },
        ebook.id,
        ebookContents[0].id,
      );
      if (!response.success) {
        console.error(response.data);
        throw new Error(`assert - ${JSON.stringify(response.data, null, 4)}`);
      }

      const foundEbookContent = response.data;
      expect(foundEbookContent).not.toBeNull();
      expect(foundEbookContent!.history).not.toBeNull();
      expect(foundEbookContent!.history!.ebookContentId).toEqual(
        ebookContents[0].id,
      );
      expect(foundEbookContent!.history!.userId).toEqual(student.user.id);
      expect(foundEbookContent!.file).toBeNull();
    });
  });
});
