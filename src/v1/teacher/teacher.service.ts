import { Injectable } from '@nestjs/common';
import { TeacherRepository } from './teacher.repository';
import {
  ITeacher,
  ITeacherSignUp,
  ITeacherWithAccount,
  ITeacherWithoutPassword,
} from './teacher.interface';
import { Pagination } from '../../shared/types/pagination';
import * as typia from 'typia';
import { IUser } from '../user/user.interface';
import { DrizzleService } from '../../infra/db/drizzle.service';
import { createUuid } from '../../shared/utils/uuid';
import { UserService } from '../user/user.service';

@Injectable()
export class TeacherService {
  constructor(
    private readonly userService: UserService,
    private readonly teacherRepository: TeacherRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async findTeachers(pagination: Pagination): Promise<ITeacherWithAccount[]> {
    const teachers = await this.teacherRepository.findMany(pagination);
    return teachers.map((teacher) =>
      typia.misc.clone<ITeacherWithAccount>(teacher),
    );
  }

  async findTeacher(
    query: Pick<ITeacher, 'id'>,
  ): Promise<ITeacherWithAccount | null> {
    const teacher = await this.teacherRepository.findOne(query);
    return teacher ? typia.misc.clone<ITeacherWithAccount>(teacher) : null;
  }

  async findTeacherByEmail(
    query: Pick<IUser, 'email'>,
  ): Promise<ITeacherWithoutPassword | null> {
    const teacher = await this.teacherRepository.findTeacherByEmail(query);
    return teacher ? typia.misc.clone<ITeacherWithoutPassword>(teacher) : null;
  }

  async createTeacher(
    params: ITeacherSignUp,
  ): Promise<ITeacherWithoutPassword> {
    const userId = createUuid();
    const { user, teacher } = await this.drizzle.db.transaction(async (tx) => {
      const user = await this.userService.createUser(
        {
          userCreateParams: {
            ...params.userCreateParams,
            id: userId,
            role: 'teacher',
          },
          infoCreateParams: {
            ...params.infoCreateParams,
            userId,
          },
          accountCreateParams: {
            ...params.accountCreateParams,
            userId,
          },
        },
        tx,
      );
      const teacher = await this.teacherRepository.create({ userId }, tx);

      return { user, teacher };
    });

    return typia.misc.clone<ITeacherWithoutPassword>({
      ...teacher,
      account: user,
    });
  }
}
