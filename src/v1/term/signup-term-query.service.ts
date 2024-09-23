import { Injectable } from '@nestjs/common';
import { SignupTermQueryRepository } from '@src/v1/term/signup-term-query.repository';
import { ISignupFormTerm } from '@src/v1/term/term.interface';

@Injectable()
export class SignupTermQueryService {
  constructor(
    private readonly signupTermQueryRepository: SignupTermQueryRepository,
  ) {}

  async findSignupFormTerms(): Promise<ISignupFormTerm[]> {
    return await this.signupTermQueryRepository.findSignupFormTerms();
  }
}
