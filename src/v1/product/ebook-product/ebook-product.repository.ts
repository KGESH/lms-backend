import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IEbookProduct,
  IEbookProductCreate,
} from '@src/v1/product/ebook-product/ebook-product.interface';
import * as typia from 'typia';

@Injectable()
export class EbookProductRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    params: IEbookProductCreate,
    db = this.drizzle.db,
  ): Promise<IEbookProduct> {
    const [product] = await db
      .insert(dbSchema.ebookProducts)
      .values(typia.misc.clone(params))
      .returning();
    return product;
  }

  // Cascade delete
  async delete(
    where: Pick<IEbookProduct, 'id'>,
    db = this.drizzle.db,
  ): Promise<IEbookProduct> {
    const [deleted] = await db
      .delete(dbSchema.ebookProducts)
      .where(eq(dbSchema.ebookProducts.id, where.id))
      .returning();
    return deleted;
  }
}
