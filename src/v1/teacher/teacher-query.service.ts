import { Injectable } from '@nestjs/common';
import { TeacherRepository } from '@src/v1/teacher/teacher.repository';
import { ITeacher } from '@src/v1/teacher/teacher.interface';
import { Pagination } from '@src/shared/types/pagination';

@Injectable()
export class TeacherQueryService {
  constructor(private readonly teacherRepository: TeacherRepository) {}

  async findTeachers(pagination: Pagination): Promise<ITeacher[]> {
    return await this.teacherRepository.findMany(pagination);
  }

  async findTeacherById(where: Pick<ITeacher, 'id'>): Promise<ITeacher | null> {
    return await this.teacherRepository.findOne(where);
  }
}
