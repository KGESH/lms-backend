import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as typia from 'typia';
import { ISessionWithUser } from '@src/v1/auth/session.interface';
import { Uuid } from '@src/shared/types/primitive';
import { EbookEnrollmentRepository } from '@src/v1/ebook/enrollment/ebook-enrollment.repository';

@Injectable()
export class EbookAccessGuard implements CanActivate {
  constructor(
    private readonly ebookEnrollmentRepository: EbookEnrollmentRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    if (!req['user']) {
      throw new InternalServerErrorException(
        'No user found in the request (ebook-access guard)',
      );
    }

    if (!req.params['ebookId']) {
      throw new InternalServerErrorException(
        'No ebookId found in the request (ebook-access guard)',
      );
    }

    const sessionWithUser = typia.assert<ISessionWithUser>(req['user']);

    /**
     * 전자책에 접근하는 사용자의 role이 'user'인 경우에는
     * 해당 'ebook'을 구매한 사용자만 조회할 수 있도록 허용합니다.
     */
    if (sessionWithUser.user.role === 'user') {
      const ebookId = typia.assert<Uuid>(req.params['ebookId']);
      const enrolled = await this.ebookEnrollmentRepository.findEbookEnrollment(
        {
          ebookId,
          userId: sessionWithUser.userId,
        },
      );

      if (!enrolled) {
        throw new ForbiddenException('User is not enrolled in the ebook');
      }

      return true;
    }

    /**
     * 강의에 접근하는 사용자의 role이
     * ['admin', 'manager', 'teacher']인 경우에는
     * 강의에 접근할 수 있도록 허용합니다.
     */
    return true;
  }
}
