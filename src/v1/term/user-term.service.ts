import { Injectable } from '@nestjs/common';
import { UserTermRepository } from '@src/v1/term/user-term.repository';
import { IUserTerm, IUserTermCreate } from '@src/v1/term/term.interface';
import { DrizzleService } from '@src/infra/db/drizzle.service';

@Injectable()
export class UserTermService {
  constructor(
    private readonly userTermRepository: UserTermRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async createUserTerms(params: IUserTermCreate[]): Promise<IUserTerm[]> {
    return await this.drizzle.db.transaction(async (tx) => {
      const userTerms = await this.userTermRepository.createManyUserTerms(
        params,
        tx,
      );
      return userTerms;
    });
  }
}
