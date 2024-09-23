import { Injectable, NotFoundException } from '@nestjs/common';
import { TermQueryRepository } from '@src/v1/term/term-query.repository';
import { ITerm, ITermWithSnapshot } from '@src/v1/term/term.interface';
@Injectable()
export class TermQueryService {
  constructor(private readonly termQueryRepository: TermQueryRepository) {}

  async findTermWithLatestSnapshot(
    where: Pick<ITerm, 'id'>,
  ): Promise<ITermWithSnapshot | null> {
    const termWithLatestSnapshot =
      await this.termQueryRepository.findTermWithLatestSnapshot(where);

    return termWithLatestSnapshot;
  }

  async findTermWithLatestSnapshotOrThrow(
    where: Pick<ITerm, 'id'>,
  ): Promise<ITermWithSnapshot> {
    const termWithLatestSnapshot =
      await this.termQueryRepository.findTermWithLatestSnapshot(where);

    if (!termWithLatestSnapshot) {
      throw new NotFoundException('Term not found');
    }

    return termWithLatestSnapshot;
  }
}
