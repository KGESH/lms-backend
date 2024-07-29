import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../infra/db/drizzle.service';
import { isNull } from 'drizzle-orm';
import { dbSchema } from '../../infra/db/schema';
import { ICategory, ICategoryWithRelations } from './category.interface';

@Injectable()
export class CategoryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findManyRootCategoriesWithChildren(): Promise<
    ICategoryWithRelations[]
  > {
    const categories = await this.drizzle.db.query.courseCategories.findMany({
      where: isNull(dbSchema.courseCategories.parentId),
      with: {
        children: {
          with: {
            parent: true,
            children: {
              with: {
                parent: true,
                children: true,
              },
            },
          },
        },
      },
    });

    const roots: ICategoryWithRelations[] = categories.map((category) => {
      return {
        ...category,
        parent: null,
        children: category.children
          .filter((child) => child !== null)
          .map((child) => child) as ICategoryWithRelations[],
      } satisfies ICategoryWithRelations;
    });

    return roots;
  }

  async create(
    params: Pick<ICategory, 'name' | 'parentId' | 'description'>,
  ): Promise<ICategory> {
    const [category] = await this.drizzle.db
      .insert(dbSchema.courseCategories)
      .values(params)
      .returning();
    return category;
  }
}
