import * as date from '@src/shared/utils/date';
import { EbookDto } from '@src/v1/ebook/ebook.dto';
import { IEbook } from '@src/v1/ebook/ebook.interface';
import { EbookWithRelationsDto } from '@src/v1/ebook/ebook-with-relations.dto';
import { IEbookWithRelations } from '@src/v1/ebook/ebook-with-relations.interface';
import { teacherToDto } from '@src/shared/helpers/transofrm/teacher';
import { ebookContentToDto } from '@src/shared/helpers/transofrm/ebook-content';

export const ebookToDto = (ebook: IEbook): EbookDto => {
  return {
    ...ebook,
    createdAt: date.toISOString(ebook.createdAt),
    updatedAt: date.toISOString(ebook.updatedAt),
  };
};

export const ebookRelationsToDto = (
  ebookWithRelations: IEbookWithRelations,
): EbookWithRelationsDto => {
  return {
    ...ebookWithRelations,
    createdAt: date.toISOString(ebookWithRelations.createdAt),
    updatedAt: date.toISOString(ebookWithRelations.updatedAt),
    teacher: teacherToDto(ebookWithRelations.teacher),
    contents: ebookWithRelations.contents.map(ebookContentToDto),
  };
};
