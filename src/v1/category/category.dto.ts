export type CategoryDto = {
  id: string;
  parentId: string | null;
  name: string;
  description: string | null;
};

export type CreateCategoryDto = Pick<
  CategoryDto,
  'name' | 'parentId' | 'description'
>;
