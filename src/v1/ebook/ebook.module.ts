import { Module } from '@nestjs/common';
import { EbookCategoryModule } from '@src/v1/ebook/category/ebook-category.module';
import { EbookRepository } from '@src/v1/ebook/ebook.repository';
import { EbookQueryRepository } from '@src/v1/ebook/ebook-query.repository';
import { TeacherModule } from '@src/v1/teacher/teacher.module';
import { EbookService } from '@src/v1/ebook/ebook.service';
import { EbookController } from '@src/v1/ebook/ebook.controller';
import { EbookQueryService } from '@src/v1/ebook/ebook-query.service';
import { EbookEnrollmentRepository } from '@src/v1/ebook/enrollment/ebook-enrollment.repository';

const modules = [EbookCategoryModule, TeacherModule];

const providers = [
  EbookService,
  EbookQueryService,
  EbookRepository,
  EbookQueryRepository,
  EbookEnrollmentRepository,
];

@Module({
  imports: [...modules],
  controllers: [EbookController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class EbookModule {}
