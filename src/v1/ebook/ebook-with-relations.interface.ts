import { IEbook } from '@src/v1/ebook/ebook.interface';
import { IEbookContent } from '@src/v1/ebook/ebook-content/ebook-content.interface';
import { ITeacherWithoutPassword } from '@src/v1/teacher/teacher.interface';
import { IEbookCategory } from '@src/v1/ebook/category/ebook-category.interface';

export type IEbookWithRelations = IEbook & {
  teacher: ITeacherWithoutPassword;
  category: IEbookCategory;
  contents: IEbookContent[];
};
