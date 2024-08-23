/**
 * 프론트엔드에서 사용할 User, UserSession 타입을 정의합니다.
 * import 경로를 '상대 경로'로 설정해주세요.
 * 옳은 경로 예시) import { User, UserSession } from '../../../sample/path';
 * 아래와 같이 '절대 경로'로 설정하지 마세요.
 * 잘못된 경로 예시) import { User, UserSession } from '@src/shared/types/lucia-auth';
 */
import { users, userSessions } from '../../infra/db/schema/user';

export const BackendUserDbTable = users;

export type IBackendUserDbTable = typeof BackendUserDbTable;

export const BackendUserSessionDbTable = userSessions;

export type IBackendUserSessionDbTable = typeof BackendUserSessionDbTable;
