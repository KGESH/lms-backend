import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FileMediaConvertController } from '@src/v1/file/media-convert/file-media-convert.controller';
import { FileMediaConvertService } from '@src/v1/file/media-convert/file-media-convert.service';
import { FileModule } from '@src/v1/file/file.module';

const modules = [EventEmitterModule.forRoot(), FileModule];

const providers = [FileMediaConvertService];

@Module({
  imports: [...modules],
  controllers: [FileMediaConvertController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class FileMediaConvertModule {}
