import { Module } from '@nestjs/common';
import { PolicyRepository } from '@src/v1/policy/policy.repository';
import { PolicyQueryRepository } from '@src/v1/policy/policy-query.repository';
import { PolicySnapshotRepository } from '@src/v1/policy/policy-snapshot.repository';
import { PolicyService } from '@src/v1/policy/policy.service';
import { PolicyController } from '@src/v1/policy/policy.controller';

const providers = [
  PolicyService,
  PolicyRepository,
  PolicySnapshotRepository,
  PolicyQueryRepository,
];

@Module({
  controllers: [PolicyController],
  providers: [...providers],
  exports: [...providers],
})
export class PolicyModule {}
