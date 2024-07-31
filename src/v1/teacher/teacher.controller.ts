import { Controller, Logger } from '@nestjs/common';
import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Uuid } from '../../shared/types/primitive';
import {
  DEFAULT_CURSOR,
  DEFAULT_ORDER_BY,
  DEFAULT_PAGE_SIZE,
} from '../../core/pagination.constant';
import { IResponse } from '../../shared/types/response';
import { TeacherService } from './teacher.service';
import { OmitPassword } from '../../shared/types/omit-password';
import { ITeacher } from './teacher.interface';
import { PaginationDto } from '../../core/pagination.dto';

@Controller('v1/teacher')
export class TeacherController {
  private readonly logger = new Logger(TeacherController.name);
  constructor(private readonly teacherService: TeacherService) {}

  @TypedRoute.Get('/')
  async getTeachers(
    @TypedQuery() query: PaginationDto,
  ): Promise<IResponse<OmitPassword<ITeacher>[]>> {
    const teachers = await this.teacherService.findTeachers({
      cursor: query.cursor ?? DEFAULT_CURSOR,
      pageSize: query.pageSize ?? DEFAULT_PAGE_SIZE,
      orderBy: query.orderBy ?? DEFAULT_ORDER_BY,
    });
    return {
      data: teachers,
    };
  }

  @TypedRoute.Get('/:id')
  async getTeacher(
    @TypedParam('id') id: Uuid,
  ): Promise<IResponse<OmitPassword<ITeacher> | null>> {
    const teacher = await this.teacherService.findTeacherById({ id });
    return {
      data: teacher,
    };
  }
}
