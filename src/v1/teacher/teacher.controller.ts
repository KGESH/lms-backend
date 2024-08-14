import { Controller, Logger } from '@nestjs/common';
import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Uuid } from '../../shared/types/primitive';
import {
  DEFAULT_CURSOR,
  DEFAULT_ORDER_BY,
  DEFAULT_PAGE_SIZE,
} from '../../core/pagination.constant';
import { TeacherService } from './teacher.service';
import { PaginationDto } from '../../core/pagination.dto';
import { TeacherDto } from './teacher.dto';

@Controller('v1/teacher')
export class TeacherController {
  private readonly logger = new Logger(TeacherController.name);
  constructor(private readonly teacherService: TeacherService) {}

  @TypedRoute.Get('/')
  async getTeachers(@TypedQuery() query: PaginationDto): Promise<TeacherDto[]> {
    const teachers = await this.teacherService.findTeachers({
      cursor: query.cursor ?? DEFAULT_CURSOR,
      pageSize: query.pageSize ?? DEFAULT_PAGE_SIZE,
      orderBy: query.orderBy ?? DEFAULT_ORDER_BY,
    });
    return teachers;
  }

  @TypedRoute.Get('/:id')
  async getTeacher(@TypedParam('id') id: Uuid): Promise<TeacherDto | null> {
    const teacher = await this.teacherService.findTeacherById({ id });
    return teacher;
  }
}
