import { INestApplication } from '@nestjs/common';
import * as FileAPI from '../../../src/api/functional/v1/file';
import * as typia from 'typia';
import { createTestingServer } from '../helpers/app.helper';
import { Uri, Uuid } from '../../../src/shared/types/primitive';
import { DrizzleService } from '../../../src/infra/db/drizzle.service';
import { seedUsers } from '../helpers/db/lms/user.helper';
import { ConfigsService } from '../../../src/configs/configs.service';
import {
  CreateFileDto,
  CreatePreSignedUrlDto,
} from '../../../src/v1/file/file.dto';

describe('FileController (e2e)', () => {
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

  describe('[Create pre signed Url]', () => {
    it('should be create many pre signed url success', async () => {
      const [fileOwner] = await seedUsers(
        { count: 1, role: 'user' },
        drizzle.db,
      );
      const createDtos: CreatePreSignedUrlDto[] = [
        {
          fileId: typia.random<Uuid>(),
          filename: 'mock-file-name',
        },
      ];

      const response = await FileAPI.pre_signed.createPreSignedUrls(
        {
          host,
          headers: { LmsSecret, UserSessionId: fileOwner.userSession.id },
        },
        createDtos,
      );

      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const [preSignedUrl] = response.data;
      expect(preSignedUrl.filename).toEqual('mock-file-name');
    });

    describe('[Create files]', () => {
      it('should be create many file entities success', async () => {
        const [fileOwner] = await seedUsers(
          { count: 1, role: 'user' },
          drizzle.db,
        );

        const uploadedFiles: CreateFileDto[] = [
          {
            id: typia.random<Uuid>(),
            type: 'image',
            filename: 'test_thumbnail.png',
            metadata: null,
            url: typia.random<Uri>(),
          },
          {
            id: typia.random<Uuid>(),
            type: 'file',
            filename: 'test file.pdf',
            metadata: null,
            url: typia.random<Uri>(),
          },
        ];

        const response = await FileAPI.createFiles(
          {
            host,
            headers: { LmsSecret, UserSessionId: fileOwner.userSession.id },
          },
          uploadedFiles,
        );

        if (!response.success) {
          const message = JSON.stringify(response.data, null, 4);
          throw new Error(`[assert] ${message}`);
        }

        const files = response.data;
        expect(
          files.find((file) => file.filename === 'test_thumbnail.png'),
        ).toBeDefined();
        expect(
          files.find((file) => file.filename === 'test file.pdf'),
        ).toBeDefined();
      });
    });
  });
});
