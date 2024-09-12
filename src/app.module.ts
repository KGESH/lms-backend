import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { DatabaseModule } from '@src/infra/db/db.module';
import { ConfigsModule } from '@src/configs/configs.module';
import { UserModule } from '@src/v1/user/user.module';
import { AuthModule } from '@src/v1/auth/auth.module';
import { CourseCategoryModule } from '@src/v1/course/category/course-category.module';
import { TeacherModule } from '@src/v1/teacher/teacher.module';
import { HttpClientModule } from '@src/infra/http/http-client.module';
import { UiModule } from '@src/v1/ui/ui.module';
import { LessonContentModule } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.module';
import { ProductModule } from '@src/v1/product/product.module';
import { OrderModule } from '@src/v1/order/order.module';
import { FileModule } from '@src/v1/file/file.module';
import { ReviewModule } from '@src/v1/review/review.module';
import { UserCourseEnrollmentModule } from '@src/v1/user/course/enrollment/user-course-enrollment.module';
import { EbookCategoryModule } from '@src/v1/ebook/category/ebook-category.module';
import { EbookContentModule } from '@src/v1/ebook/ebook-content/ebook-content.module';
import { CourseDashboardModule } from '@src/v1/dashboard/course/course-dashboard.module';
import { CourseReviewModule } from '@src/v1/review/course-review/course-review.module';
import { EbookReviewModule } from '@src/v1/review/ebook-review/ebook-review.module';
import { PostRelationsModule } from '@src/v1/post/post-relations.module';
import { LoggerMiddleware } from '@src/core/middlewares/logger.middleware';

@Module({
  imports: [
    ConfigsModule,
    HttpClientModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    CourseCategoryModule,
    EbookCategoryModule,
    LessonContentModule,
    EbookContentModule,
    TeacherModule,
    FileModule,
    UiModule,
    ProductModule,
    OrderModule,
    ReviewModule,
    UserCourseEnrollmentModule,
    CourseDashboardModule,
    CourseReviewModule,
    EbookReviewModule,
    PostRelationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
