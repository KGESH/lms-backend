import { Injectable } from '@nestjs/common';
import { TeacherRepository } from './teacher.repository';
import { ITeacher, ITeacherCreate } from './teacher.interface';
import { IPagination } from '../../shared/types/pagination';
import * as typia from 'typia';
import { OmitPassword } from '../../shared/types/omit-password';

@Injectable()
export class TeacherService {
  constructor(private readonly teacherRepository: TeacherRepository) {}

  async findTeachers(
    pagination?: IPagination,
  ): Promise<OmitPassword<ITeacher>[]> {
    const teachers = await this.teacherRepository.findMany(pagination);
    return teachers.map((teacher) =>
      typia.misc.clone<OmitPassword<ITeacher>>(teacher),
    );
  }

  async findTeacherById(
    query: Pick<ITeacher, 'id'>,
  ): Promise<OmitPassword<ITeacher> | null> {
    const teacher = await this.teacherRepository.findOne(query);
    return teacher ? typia.misc.clone<OmitPassword<ITeacher>>(teacher) : null;
  }

  async findTeacherByIdOrThrow(
    query: Pick<ITeacher, 'id'>,
  ): Promise<OmitPassword<ITeacher>> {
    const teacher = await this.teacherRepository.findOneOrThrow(query);
    return typia.misc.clone<OmitPassword<ITeacher>>(teacher);
  }

  async findTeacherByEmail(
    query: Pick<ITeacher, 'email'>,
  ): Promise<OmitPassword<ITeacher> | null> {
    const teacher = await this.teacherRepository.findTeacherByEmail(query);
    return teacher ? typia.misc.clone<OmitPassword<ITeacher>>(teacher) : null;
  }

  async createTeacher(params: ITeacherCreate): Promise<OmitPassword<ITeacher>> {
    const teacher = await this.teacherRepository.create(params);
    return typia.misc.clone<OmitPassword<ITeacher>>(teacher);
  }
}
