import { Injectable } from '@nestjs/common';
import { IUserAgreedTerm, IUserTerm } from '@src/v1/term/term.interface';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { UserTermQueryRepository } from '@src/v1/term/user-term-query.repository';

@Injectable()
export class UserTermQueryService {
  constructor(
    private readonly userTermQueryRepository: UserTermQueryRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async findUserTerms(
    where: Pick<IUserTerm, 'userId'>,
  ): Promise<IUserAgreedTerm[]> {
    return await this.userTermQueryRepository.findUserTerms(where);
  }
}
