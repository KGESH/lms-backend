import { Controller, Logger } from '@nestjs/common';
import { TypedHeaders, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Uuid } from '../../shared/types/primitive';
import { DEFAULT_PAGINATION } from '../../core/pagination.constant';
import { TeacherService } from './teacher.service';
import { TeacherDto, TeacherQuery } from './teacher.dto';
import { teacherToDto } from '../../shared/helpers/transofrm/teacher';
import { SkipAuth } from '../../core/decorators/skip-auth.decorator';
import { ApiAuthHeaders } from '../auth/auth.headers';

@Controller('v1/teacher')
export class TeacherController {
  private readonly logger = new Logger(TeacherController.name);
  constructor(private readonly teacherService: TeacherService) {}

  @TypedRoute.Get('/')
  @SkipAuth()
  async getTeachers(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedQuery() query?: TeacherQuery,
  ): Promise<TeacherDto[]> {
    const teachers = await this.teacherService.findTeachers({
      ...DEFAULT_PAGINATION,
      ...query,
    });
    return teachers.map(teacherToDto);
  }

  @TypedRoute.Get('/:id')
  @SkipAuth()
  async getTeacher(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('id') id: Uuid,
  ): Promise<TeacherDto | null> {
    const teacher = await this.teacherService.findTeacher({ id });
    return teacher ? teacherToDto(teacher) : null;
  }
}
