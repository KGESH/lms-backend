import { Module } from '@nestjs/common';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { TeacherRepository } from './teacher.repository';
import { TeacherQueryService } from './teacher-query.service';
import { UserModule } from '../user/user.module';

const providers = [TeacherService, TeacherQueryService, TeacherRepository];

@Module({
  imports: [UserModule],
  controllers: [TeacherController],
  providers: [...providers],
  exports: [...providers],
})
export class TeacherModule {}
