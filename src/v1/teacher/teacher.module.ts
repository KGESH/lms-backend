import { Module } from '@nestjs/common';
import { UserModule } from '@src/v1/user/user.module';
import { TeacherController } from '@src/v1/teacher/teacher.controller';
import { TeacherService } from '@src/v1/teacher/teacher.service';
import { TeacherRepository } from '@src/v1/teacher/teacher.repository';
import { TeacherQueryService } from '@src/v1/teacher/teacher-query.service';

const providers = [TeacherService, TeacherQueryService, TeacherRepository];

@Module({
  imports: [UserModule],
  controllers: [TeacherController],
  providers: [...providers],
  exports: [...providers],
})
export class TeacherModule {}
