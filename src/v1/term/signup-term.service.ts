import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SignupTermRepository } from '@src/v1/term/signup-term.repository';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ISignupTermCreate } from '@src/v1/term/term.interface';
import { UNIQUE_CONSTRAINT_ERROR_CODE } from '@src/infra/db/db.constant';

@Injectable()
export class SignupTermService {
  private readonly logger = new Logger(SignupTermService.name);
  constructor(
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
        if (e.code === UNIQUE_CONSTRAINT_ERROR_CODE) {
          throw new ConflictException('Signup form term sequence conflict.');
        }

        throw new InternalServerErrorException(
          'Failed to create signup form terms.',
        );
      });

    return signupTerms;
  }
}
