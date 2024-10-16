import { Injectable, NotFoundException } from '@nestjs/common';
import { SignupTermQueryRepository } from '@src/v1/term/signup-term-query.repository';
import { ISignupFormTerm } from '@src/v1/term/term.interface';

@Injectable()
export class SignupTermQueryService {
  constructor(
    private readonly signupTermQueryRepository: SignupTermQueryRepository,
  ) {}

  async findSignupFormTermOrThrow(
    where: Pick<ISignupFormTerm, 'id'>,
  ): Promise<ISignupFormTerm> {
    const signupFormTerm =
      await this.signupTermQueryRepository.findSignupFormTerm(where);

    if (!signupFormTerm) {
      throw new NotFoundException('Signup form term not found');
    }

    return signupFormTerm;
  }

  async findSignupFormTerms(): Promise<ISignupFormTerm[]> {
    return await this.signupTermQueryRepository.findSignupFormTerms();
  }
}
