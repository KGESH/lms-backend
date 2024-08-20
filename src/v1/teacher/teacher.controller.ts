import { Controller, Logger } from '@nestjs/common';
import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Uuid } from '../../shared/types/primitive';
import { DEFAULT_PAGINATION } from '../../core/pagination.constant';
import { TeacherService } from './teacher.service';
import { PaginationDto } from '../../core/pagination.dto';
import { TeacherDto } from './teacher.dto';
import { teacherToDto } from '../../shared/helpers/transofrm/teacher';

@Controller('v1/teacher')
export class TeacherController {
  private readonly logger = new Logger(TeacherController.name);
  constructor(private readonly teacherService: TeacherService) {}

  @TypedRoute.Get('/')
  async getTeachers(@TypedQuery() query: PaginationDto): Promise<TeacherDto[]> {
    const teachers = await this.teacherService.findTeachers({
      ...DEFAULT_PAGINATION,
      ...query,
    });
    return teachers.map(teacherToDto);
  }

  @TypedRoute.Get('/:id')
  async getTeacher(@TypedParam('id') id: Uuid): Promise<TeacherDto | null> {
    const teacher = await this.teacherService.findTeacherById({ id });
    return teacher ? teacherToDto(teacher) : null;
  }
}
