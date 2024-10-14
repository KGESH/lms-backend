import { INestApplication } from '@nestjs/common';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '../../../src/shared/types/primitive';
import * as TermAPI from '../../../src/api/functional/v1/term';
import * as SignupTermAPI from '../../../src/api/functional/v1/term/signup';
import { DrizzleService } from '../../../src/infra/db/drizzle.service';
import { ConfigsService } from '../../../src/configs/configs.service';
import { seedUsers } from '../helpers/db/lms/user.helper';
import {
  createTermWithSnapshot,
  seedSignupTerms,
} from '../helpers/db/lms/term.helper';

describe('TermController (e2e)', () => {
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

  describe('Get paginated terms', () => {
    it('should be get paginated terms success', async () => {
      const { termsWithSnapshot, signupTerms } = await seedSignupTerms(
        { count: 5 },
        drizzle.db,
      );

      const response = await TermAPI.getTerms(
        {
          host,
          headers: { LmsSecret },
        },
        {
          page: 1,
          pageSize: 10,
          orderBy: 'desc',
        },
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const { data, totalCount, pagination } = response.data;
      expect(pagination.page).toEqual(1);
      expect(pagination.pageSize).toEqual(10);
      expect(pagination.orderBy).toEqual('desc');
      expect(totalCount).toEqual(5);
      expect(
        termsWithSnapshot.find((seedTerm) => seedTerm.term.id === data[0].id),
      ).toBeDefined();
    });
  });

  describe('Get term by ID', () => {
    it('should be get term by id success', async () => {
      const { termsWithSnapshot, signupTerms } = await seedSignupTerms(
        { count: 5 },
        drizzle.db,
      );

      const response = await TermAPI.getTerm(
        {
          host,
          headers: { LmsSecret },
        },
        termsWithSnapshot[2].term.id,
      );
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const term = response.data;
      expect(
        termsWithSnapshot.find((seedTerm) => seedTerm.term.id === term?.id),
      ).toBeDefined();
    });
  });

  describe('Get signup form terms', () => {
    it('should be get signup form terms success', async () => {
      const { termsWithSnapshot, signupTerms } = await seedSignupTerms(
        { count: 1 },
        drizzle.db,
      );

      const response = await SignupTermAPI.form.getSignupFormTerms({
        host,
        headers: { LmsSecret },
      });
      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const signupFormTerms = response.data;
      expect(signupFormTerms[0].name).toEqual(termsWithSnapshot[0].term.name);
      expect(signupFormTerms[0].snapshot.id).toEqual(
        termsWithSnapshot[0].snapshot.id,
      );
      expect(signupFormTerms[0].signupTerm.id).toEqual(signupTerms[0].id);
    });
  });

  describe('Create many signup form terms', () => {
    it('should be create many signup terms success', async () => {
      const admin = (
        await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
      )[0];
      const base = await createTermWithSnapshot(
        {
          name: '이용 약관',
          type: 'mandatory',
        },
        {
          title: '(갈길이머니) 이용 약관',
          content: '이용 약관 본문',
          description: '관리자 메모',
          metadata: null,
          updatedReason: null,
        },
        drizzle.db,
      );
      const marketing = await createTermWithSnapshot(
        {
          name: '마케팅 정보 수신 동의',
          type: 'optional',
        },
        {
          title: '(갈길이머니) 마케팅 정보 수신 동의',
          content: '마케팅 정보 수신 동의 본문',
          description: '관리자 메모',
          metadata: null,
          updatedReason: null,
        },
        drizzle.db,
      );

      const createResponse = await SignupTermAPI.form.createSignupFormTerms(
        {
          host,
          headers: {
            LmsSecret,
            UserSessionId: admin.userSession.id,
          },
        },
        [
          {
            sequence: 0,
            termId: base.term.id,
          },
          {
            sequence: 1,
            termId: marketing.term.id,
          },
        ],
      );
      if (!createResponse.success) {
        const message = JSON.stringify(createResponse.data, null, 4);
        throw new Error(`[assert] ${message}`);
      }

      const signupTerms = createResponse.data;
      const baseSignupTerm = signupTerms.find(
        (signupTerm) => signupTerm.termId === base.term.id,
      )!;
      const marketingSignupTerm = signupTerms.find(
        (signupTerm) => signupTerm.termId === marketing.term.id,
      )!;

      expect(baseSignupTerm.sequence).toEqual(0);
      expect(marketingSignupTerm.sequence).toEqual(1);
    });

    describe('Create term', () => {
      it('should be create term success', async () => {
        const admin = (
          await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
        )[0];

        const createResponse = await TermAPI.createTerm(
          {
            host,
            headers: {
              LmsSecret,
              UserSessionId: admin.userSession.id,
            },
          },
          {
            name: '개인 정보 이용약관',
            type: 'mandatory',
            snapshot: {
              title: '갈길이 머니 개인 정보 이용약관',
              content: '이용 약관 본문',
              description: '관리자 메모',
              metadata: null,
            },
          },
        );
        if (!createResponse.success) {
          const message = JSON.stringify(createResponse.data, null, 4);
          throw new Error(`[assert] ${message}`);
        }

        const term = createResponse.data;

        expect(term.name).toEqual('개인 정보 이용약관');
        expect(term.type).toEqual('mandatory');
        expect(term.snapshot.title).toEqual('갈길이 머니 개인 정보 이용약관');
        expect(term.snapshot.content).toEqual('이용 약관 본문');
      });

      describe('Update term', () => {
        it('should be update term success', async () => {
          const admin = (
            await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
          )[0];

          const { termsWithSnapshot } = await seedSignupTerms(
            { count: 1 },
            drizzle.db,
          );

          const updatedResponse = await TermAPI.updateTerm(
            {
              host,
              headers: {
                LmsSecret,
                UserSessionId: admin.userSession.id,
              },
            },
            termsWithSnapshot[0].term.id,
            {
              termUpdateParams: {
                name: '(신규) 개인 정보 이용약관',
                type: 'mandatory',
              },
              termContentUpdateParams: {
                content: '(신규) 이용 약관 본문',
              },
            },
          );
          if (!updatedResponse.success) {
            const message = JSON.stringify(updatedResponse.data, null, 4);
            throw new Error(`[assert] ${message}`);
          }

          const term = updatedResponse.data;
          expect(term.name).toEqual('(신규) 개인 정보 이용약관');
          expect(term.type).toEqual('mandatory');
          expect(term.snapshot.content).toEqual('(신규) 이용 약관 본문');
        });
      });

      describe('Delete term', () => {
        it('should be delete term success', async () => {
          const admin = (
            await seedUsers({ count: 1, role: 'admin' }, drizzle.db)
          )[0];

          const { termsWithSnapshot } = await seedSignupTerms(
            { count: 1 },
            drizzle.db,
          );

          const deletedResponse = await TermAPI.deleteTerm(
            {
              host,
              headers: {
                LmsSecret,
                UserSessionId: admin.userSession.id,
              },
            },
            termsWithSnapshot[0].term.id,
          );
          if (!deletedResponse.success) {
            const message = JSON.stringify(deletedResponse.data, null, 4);
            throw new Error(`[assert] ${message}`);
          }

          const { deletedId } = deletedResponse.data;
          expect(deletedId).toEqual(termsWithSnapshot[0].term.id);

          const foundResponse = await TermAPI.getTerm(
            {
              host,
              headers: {
                LmsSecret,
                UserSessionId: admin.userSession.id,
              },
            },
            termsWithSnapshot[0].term.id,
          );
          if (!foundResponse.success) {
            const message = JSON.stringify(foundResponse.data, null, 4);
            throw new Error(`[assert] ${message}`);
          }

          const foundTerm = foundResponse.data;
          expect(foundTerm).toBeNull();
        });
      });
    });
  });
});
