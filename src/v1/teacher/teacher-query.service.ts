import { Injectable } from '@nestjs/common';
import { TeacherRepository } from './teacher.repository';
import { ITeacher } from './teacher.interface';
import { Pagination } from '../../shared/types/pagination';

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
