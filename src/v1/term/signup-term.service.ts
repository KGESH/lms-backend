import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SignupTermRepository } from '@src/v1/term/signup-term.repository';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  ISignupTerm,
  ISignupTermCreate,
  ISignupTermUpdate,
} from '@src/v1/term/term.interface';
import { SignupTermQueryService } from '@src/v1/term/signup-term-query.service';

@Injectable()
export class SignupTermService {
  private readonly logger = new Logger(SignupTermService.name);
  constructor(
    private readonly signupTermQueryService: SignupTermQueryService,
    private readonly signupTermRepository: SignupTermRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async createSignupFormTerms(params: ISignupTermCreate[]) {
    const signupTerms = await this.drizzle.db
      .transaction(async (tx) => {
        return await this.signupTermRepository.createManySignupFormTerms(
          params,
          tx,
        );
      })
      .catch((e) => {
        this.logger.error('[CreateSignupFormTerms]', e);

        throw new InternalServerErrorException(
          'Failed to create signup form terms.',
        );
      });

    return signupTerms;
  }

  async updateSignupFormTerms(params: ISignupTermUpdate[]) {
    const signupTerms = await this.drizzle.db
      .transaction(async (tx) => {
        return await this.signupTermRepository.updateManySignupFormTermsSequence(
          params,
          tx,
        );
      })
      .catch((e) => {
        this.logger.error('[CreateSignupFormTerms]', e);

        throw new InternalServerErrorException(
          'Failed to create signup form terms.',
        );
      });

    return signupTerms;
  }

  async deleteSignupFormTerm(
    where: Pick<ISignupTerm, 'id'>,
  ): Promise<ISignupTerm['id']> {
    // Throw 404 if not exist
    await this.signupTermQueryService.findSignupFormTermOrThrow(where);

    const deletedId =
      await this.signupTermRepository.deleteSignupFormTerm(where);
    return deletedId;
  }
}
