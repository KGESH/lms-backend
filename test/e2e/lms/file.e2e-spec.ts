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
    it('should be create many private signed url success', async () => {
      const [fileOwner] = await seedUsers(
        { count: 1, role: 'admin' },
        drizzle.db,
      );
      const fileId = '33617cff-93dc-4f32-9030-fbbb2ce327f0';
      const createDtos: CreatePreSignedUrlDto[] = [
        {
          fileId: fileId,
          filename: fileId,
        },
      ];

      const response =
        await FileAPI.$private.pre_signed.createPrivatePreSignedUrls(
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
      expect(preSignedUrl.fileId).toEqual(fileId);

      // @TODO: uncomment after solve the blocked aws account issue
      // const pdfPath = process.cwd() + '/test/e2e/sample.pdf';
      // console.log('pdfPath', pdfPath);
      // const pdf = await fs.readFile(pdfPath);
      // const blob = new Blob([Uint8Array.from(pdf)], {
      //   type: 'application/pdf',
      // });
      //
      // const uploadResponse = await fetch(preSignedUrl.url, {
      //   method: 'PUT',
      //   body: blob,
      // });
      // expect(uploadResponse.ok).toBeTruthy();
      //
      // const getResponse =
      //   await FileAPI.$private.pre_signed.getPrivatePreSignedUrl(
      //     {
      //       host,
      //       headers: { LmsSecret, UserSessionId: fileOwner.userSession.id },
      //     },
      //     fileId,
      //   );
      // if (!getResponse.success) {
      //   const message = JSON.stringify(getResponse.data, null, 4);
      //   throw new Error(`[assert] ${message}`);
      // }
      //
      // const getPreSignedUrl = getResponse.data;
      // expect(getPreSignedUrl.fileId).toEqual(fileId);
      // console.log(getPreSignedUrl);
    });

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

    describe('[Delete files]', () => {
      it('should be delete many file entities success', async () => {
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

        const deleteResponse = await FileAPI.deleteFiles(
          {
            host,
            headers: { LmsSecret, UserSessionId: fileOwner.userSession.id },
          },
          [{ id: uploadedFiles[0].id }],
        );
        if (!deleteResponse.success) {
          const message = JSON.stringify(deleteResponse.data, null, 4);
          throw new Error(`[assert] ${message}`);
        }
        const deletedIds = deleteResponse.data;
        expect(deletedIds[0]).toEqual(uploadedFiles[0].id);
      });
    });
  });
});
