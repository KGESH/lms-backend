import { INestApplication } from '@nestjs/common';
import * as CourseAPI from '@src/api/functional/v1/course';
import * as typia from 'typia';
import { createTestingServer } from '../helpers/app.helper';
import { Uri } from '@src/shared/types/primitive';
import { createCourseCategory } from '../helpers/db/lms/course-category.helper';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { createCourse, findCourse } from '../helpers/db/lms/course.helper';
import { ICourseCategoryCreate } from '@src/v1/course/category/course-category.interface';
import { createTeacher } from '../helpers/db/lms/teacher.helper';
import { ITeacherSignUp } from '@src/v1/teacher/teacher.interface';
import { CourseCreateDto } from '@src/v1/course/course.dto';
import { ICourseCreate, ICourseUpdate } from '@src/v1/course/course.interface';
import { ConfigsService } from '@src/configs/configs.service';

describe('CourseController (e2e)', () => {
  let host: Uri;
  let app: INestApplication;
  let drizzle: DrizzleService;
  let configs: ConfigsService;
  let LmsSecret: string;

  beforeEach(async () => {
    app = await createTestingServer();
    host = await app.getUrl();
    drizzle = await app.get(DrizzleService);
    configs = await app.get(ConfigsService);
    LmsSecret = configs.env.LMS_SECRET;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('[Get course]', () => {
    it('should be get a course', async () => {
      const category = await createCourseCategory(
        {
          ...typia.random<ICourseCategoryCreate>(),
          parentId: null,
        },
        drizzle.db,
      );
      const { teacher } = await createTeacher(
        typia.random<ITeacherSignUp>(),
        drizzle.db,
      );
      const course = await createCourse(
        {
          categoryId: category.id,
          teacherId: teacher.id,
          title: 'mock-course',
          description: '',
        },
        drizzle.db,
      );
      const response = await CourseAPI.getCourse(
        {
          host,
          headers: { LmsSecret },
        },
        course.id,
      );
      if (!response.success) {
        console.error(response.data);
        throw new Error(`assert - ${JSON.stringify(response.data, null, 4)}`);
      }

      const foundCourse = response.data;
      expect(foundCourse).not.toBeNull();
      expect(foundCourse!.title).toEqual('mock-course');
    });
  });

  describe('[Get courses]', () => {
    it('should be get all courses', async () => {
      const category = await createCourseCategory(
        {
          ...typia.random<ICourseCategoryCreate>(),
          parentId: null,
        },
        drizzle.db,
      );
      const { teacher } = await createTeacher(
        typia.random<ITeacherSignUp>(),
        drizzle.db,
      );
      const courseOne = await createCourse(
        {
          categoryId: category.id,
          teacherId: teacher.id,
          title: 'course-one',
          description: '',
        },
        drizzle.db,
      );
      const courseTwo = await createCourse(
        {
          categoryId: category.id,
          teacherId: teacher.id,
          title: 'course-two',
          description: '',
        },
        drizzle.db,
      );

      const response = await CourseAPI.getCourses(
        {
          host,
          headers: { LmsSecret },
        },
        {},
      );

      if (!response.success) {
        const message = JSON.stringify(response.data, null, 4);
        throw new Error(`assert - ${message}`);
      }

      const { data: courses, pagination, totalCount } = response.data;
      expect(
        courses.find((course) => course.title === 'course-one'),
      ).not.toBeNull();
      expect(
        courses.find((course) => course.id === 'course-two'),
      ).not.toBeNull();
    });
  });

  describe('[Create course]', () => {
    it('should be create course success', async () => {
      const category = await createCourseCategory(
        {
          ...typia.random<ICourseCategoryCreate>(),
          parentId: null,
        },
        drizzle.db,
      );
      const { teacher, userSession } = await createTeacher(
        typia.random<ITeacherSignUp>(),
        drizzle.db,
      );
      const createDto: CourseCreateDto = {
        categoryId: category.id,
        teacherId: teacher.id,
        title: 'mock-course',
        description: '',
      };

      const response = await CourseAPI.createCourse(
        { host, headers: { LmsSecret, UserSessionId: userSession.id } },
        createDto,
      );
      if (!response.success) {
        throw new Error('assert');
      }

      const course = response.data;
      expect(course.title).toEqual('mock-course');
    });

    describe('[Update course]', () => {
      it('should be update course success', async () => {
        const category = await createCourseCategory(
          {
            ...typia.random<ICourseCategoryCreate>(),
            parentId: null,
          },
          drizzle.db,
        );
        const { teacher, userSession } = await createTeacher(
          typia.random<ITeacherSignUp>(),
          drizzle.db,
        );
        const course = await createCourse(
          {
            ...typia.random<ICourseCreate>(),
            categoryId: category.id,
            teacherId: teacher.id,
          },
          drizzle.db,
        );
        const updateDto: ICourseUpdate = {
          title: 'updated-course',
        };

        const response = await CourseAPI.updateCourse(
          {
            host,
            headers: {
              LmsSecret,
              UserSessionId: userSession.id,
            },
          },
          course.id,
          updateDto,
        );
        if (!response.success) {
          throw new Error('assert');
        }

        const updatedCourse = response.data;
        expect(updatedCourse.title).toEqual('updated-course');
      });
    });

    describe('[Delete course]', () => {
      it('should be delete course success', async () => {
        const category = await createCourseCategory(
          {
            ...typia.random<ICourseCategoryCreate>(),
            parentId: null,
          },
          drizzle.db,
        );
        const { teacher, userSession } = await createTeacher(
          typia.random<ITeacherSignUp>(),
          drizzle.db,
        );
        const course = await createCourse(
          {
            ...typia.random<ICourseCreate>(),
            categoryId: category.id,
            teacherId: teacher.id,
          },
          drizzle.db,
        );

        const response = await CourseAPI.deleteCourse(
          {
            host,
            headers: {
              LmsSecret,
              UserSessionId: userSession.id,
            },
          },
          course.id,
        );
        if (!response.success) {
          throw new Error('assert');
        }

        const deletedCourse = response.data;
        expect(deletedCourse.id).toEqual(course.id);

        const notFoundResult = await findCourse({ id: course.id }, drizzle.db);
        expect(notFoundResult).toBeNull();
      });
    });
  });
});
