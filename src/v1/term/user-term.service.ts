import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserTermRepository } from '@src/v1/term/user-term.repository';
import { IUserTerm, IUserTermCreate } from '@src/v1/term/term.interface';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { UNIQUE_CONSTRAINT_ERROR_CODE } from '@src/infra/db/db.constant';

@Injectable()
export class UserTermService {
  constructor(
    private readonly userTermRepository: UserTermRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async createUserTerms(params: IUserTermCreate[]): Promise<IUserTerm[]> {
    return await this.drizzle.db
      .transaction(async (tx) => {
        const userTerms = await this.userTermRepository.createManyUserTerms(
          params,
          tx,
        );
        return userTerms;
      })
      .catch((e) => {
        if (e.code === UNIQUE_CONSTRAINT_ERROR_CODE) {
          throw new ConflictException(
            'User already agreed or disagreed terms.',
          );
        }

        throw new InternalServerErrorException('Failed to create user terms.');
      });
  }
}
