import { Module } from '@nestjs/common';
import { SignupTermQueryRepository } from '@src/v1/term/signup-term-query.repository';
import { TermRepository } from '@src/v1/term/term.repository';
import { TermService } from '@src/v1/term/term.service';
import { TermQueryRepository } from '@src/v1/term/term-query.repository';
import { TermQueryService } from '@src/v1/term/term-query.service';
import { TermSnapshotRepository } from '@src/v1/term/term-snapshot.repository';
import { UserTermRepository } from '@src/v1/term/user-term.repository';
import { UserTermService } from '@src/v1/term/user-term.service';
import { UserTermQueryRepository } from '@src/v1/term/user-term-query.repository';
import { UserTermQueryService } from '@src/v1/term/user-term-query.service';
import { SignupTermQueryService } from '@src/v1/term/signup-term-query.service';
import { TermController } from '@src/v1/term/term.controller';

const modules = [];

const providers = [
  SignupTermQueryRepository,
  TermRepository,
  TermService,
  TermQueryRepository,
  TermQueryService,
  TermSnapshotRepository,
  UserTermRepository,
  UserTermService,
  UserTermQueryRepository,
  UserTermQueryService,
  SignupTermQueryService,
];

@Module({
  imports: [...modules],
  controllers: [TermController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class TermModule {}
