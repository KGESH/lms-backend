import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infra/db/db.module';
import { ConfigsModule } from './configs/configs.module';
import { UserModule } from './v1/user/user.module';
import { AuthModule } from './v1/auth/auth.module';
import { CategoryModule } from './v1/category/category.module';
import { CourseModule } from './v1/course/course.module';
import { TeacherModule } from './v1/teacher/teacher.module';
import { S3Module } from './infra/s3/s3.module';
import { HttpClientModule } from './infra/http/http-client.module';

@Module({
  imports: [
    ConfigsModule,
    HttpClientModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    CategoryModule,
    CourseModule,
    TeacherModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
