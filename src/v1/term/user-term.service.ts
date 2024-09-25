import { Injectable, Logger } from '@nestjs/common';
import { UserTermRepository } from '@src/v1/term/user-term.repository';
import { IUserTerm, IUserTermCreate } from '@src/v1/term/term.interface';
import { DrizzleService } from '@src/infra/db/drizzle.service';

@Injectable()
export class UserTermService {
  private readonly logger = new Logger(UserTermService.name);
  constructor(
    private readonly userTermRepository: UserTermRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async createUserTerms(
    params: IUserTermCreate[],
    tx = this.drizzle.db,
  ): Promise<IUserTerm[]> {
    const userTerms = await this.userTermRepository.createManyUserTerms(
      params,
      tx,
    );
    return userTerms;
  }
}
