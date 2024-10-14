import { Injectable, NotFoundException } from '@nestjs/common';
import { TermQueryRepository } from '@src/v1/term/term-query.repository';
import { ITerm, ITermWithSnapshot } from '@src/v1/term/term.interface';
import { Paginated, Pagination } from '@src/shared/types/pagination';
@Injectable()
export class TermQueryService {
  constructor(private readonly termQueryRepository: TermQueryRepository) {}

  async findManyTermsWithLatestSnapshot(
    pagination: Pagination,
  ): Promise<Paginated<ITermWithSnapshot[]>> {
    return await this.termQueryRepository.findManyTermsWithLatestSnapshot(
      pagination,
    );
  }

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
