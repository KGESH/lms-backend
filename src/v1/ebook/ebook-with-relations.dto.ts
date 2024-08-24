import { TeacherDto } from '@src/v1/teacher/teacher.dto';
import { EbookDto } from '@src/v1/ebook/ebook.dto';
import { EbookCategoryDto } from '@src/v1/ebook/category/ebook-category.dto';
import { EbookContentDto } from '@src/v1/ebook/ebook-content/ebook-content.dto';

export type EbookWithRelationsDto = EbookDto & {
  teacher: TeacherDto;
  category: EbookCategoryDto;
  contents: EbookContentDto[];
};
