import { Injectable } from '@nestjs/common';
import { TermRepository } from '@src/v1/term/term.repository';
import {
  ITerm,
  ITermContentUpdate,
  ITermCreate,
  ITermSnapshotCreate,
  ITermUpdate,
  ITermWithSnapshot,
} from '@src/v1/term/term.interface';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { TermSnapshotRepository } from '@src/v1/term/term-snapshot.repository';
import { TermQueryService } from '@src/v1/term/term-query.service';

@Injectable()
export class TermService {
  constructor(
    private readonly termQueryService: TermQueryService,
    private readonly termRepository: TermRepository,
    private readonly termSnapshotRepository: TermSnapshotRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async createTerm(
    termCreateParams: ITermCreate,
    snapshotCreateParams: Omit<ITermSnapshotCreate, 'termId' | 'updatedReason'>,
  ): Promise<ITermWithSnapshot> {
    const { term, snapshot } = await this.drizzle.db.transaction(async (tx) => {
      const term = await this.termRepository.createTerm(termCreateParams, tx);
      const snapshot = await this.termSnapshotRepository.createTermSnapshot(
        {
          ...snapshotCreateParams,
          termId: term.id,
          updatedReason: null,
        },
        tx,
      );

      return { term, snapshot };
    });

    return {
      ...term,
      snapshot,
    };
  }

  async updateTerm(
    where: Pick<ITerm, 'id'>,
    params: {
      termUpdateParams?: ITermUpdate;
      termContentUpdateParams?: ITermContentUpdate;
    },
  ): Promise<ITermWithSnapshot> {
    const { termUpdateParams, termContentUpdateParams } = params;
    const termWithLatestSnapshot =
      await this.termQueryService.findTermWithLatestSnapshotOrThrow(where);

    const { term, snapshot } = await this.drizzle.db.transaction(async (tx) => {
      const term = termUpdateParams
        ? await this.termRepository.updateTerm(where, termUpdateParams, tx)
        : termWithLatestSnapshot;
      const snapshot = await this.termSnapshotRepository.createTermSnapshot(
        {
          termId: term.id,
          title:
            termContentUpdateParams?.title ??
            termWithLatestSnapshot.snapshot.title,
          content:
            termContentUpdateParams?.content ??
            termWithLatestSnapshot.snapshot.content,
          description:
            termContentUpdateParams?.description ||
            termContentUpdateParams?.description === null
              ? termContentUpdateParams?.description
              : termWithLatestSnapshot.snapshot.description,
          metadata:
            termContentUpdateParams?.metadata ||
            termContentUpdateParams?.metadata === null
              ? termContentUpdateParams?.metadata
              : termWithLatestSnapshot.snapshot.metadata,
          updatedReason:
            termContentUpdateParams?.updatedReason ||
            termContentUpdateParams?.updatedReason === null
              ? termContentUpdateParams?.updatedReason
              : termWithLatestSnapshot.snapshot.updatedReason,
        },
        tx,
      );

      return { term, snapshot };
    });

    return {
      ...term,
      snapshot,
    };
  }

  async deleteTerm(where: Pick<ITerm, 'id'>): Promise<ITerm['id']> {
    return await this.termRepository.deleteTerm(where);
  }
}
