import { Injectable } from '@nestjs/common';
import { TeacherRepository } from './teacher.repository';
import { ITeacher } from './teacher.interface';

@Injectable()
export class TeacherQueryService {
  constructor(private readonly teacherRepository: TeacherRepository) {}

  async findTeachers(): Promise<ITeacher[]> {
    return await this.teacherRepository.findMany();
  }

  async findTeacherById(where: Pick<ITeacher, 'id'>): Promise<ITeacher | null> {
    return await this.teacherRepository.findOne(where);
  }
}
