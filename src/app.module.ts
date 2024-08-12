import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infra/db/db.module';
import { ConfigsModule } from './configs/configs.module';
import { UserModule } from './v1/user/user.module';
import { AuthModule } from './v1/auth/auth.module';
import { CategoryModule } from './v1/category/category.module';
import { TeacherModule } from './v1/teacher/teacher.module';
import { S3Module } from './infra/s3/s3.module';
import { HttpClientModule } from './infra/http/http-client.module';
import { UiModule } from './v1/ui/ui.module';
import { LessonContentModule } from './v1/course/chapter/lesson/lesson-content/lesson-content.module';

@Module({
  imports: [
    ConfigsModule,
    HttpClientModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    CategoryModule,
    LessonContentModule,
    TeacherModule,
    S3Module,
    UiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
