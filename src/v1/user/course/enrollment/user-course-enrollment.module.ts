import { Module } from '@nestjs/common';
import { UserModule } from '@src/v1/user/user.module';
import { CourseModule } from '@src/v1/course/course.module';
import { UserCourseEnrollmentService } from '@src/v1/user/course/enrollment/user-course-enrollment.service';
import { UserCourseEnrollmentController } from '@src/v1/user/course/enrollment/user-course-enrollment.controller';
import { UserCourseEnrollmentQueryRepository } from '@src/v1/user/course/enrollment/user-course-enrollment-query.repository';

const modules = [UserModule, CourseModule];

const providers = [
  UserCourseEnrollmentService,
  UserCourseEnrollmentQueryRepository,
];

@Module({
  imports: [...modules],
  controllers: [UserCourseEnrollmentController],
  providers: [...providers],
  exports: [...modules],
})
export class UserCourseEnrollmentModule {}
