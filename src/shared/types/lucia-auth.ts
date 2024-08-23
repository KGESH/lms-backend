import { users, userSessions } from '../../infra/db/schema/user';

export const BackendUserDbTable = users;

export type IBackendUserDbTable = typeof BackendUserDbTable;

export const BackendUserSessionDbTable = userSessions;

export type IBackendUserSessionDbTable = typeof BackendUserSessionDbTable;
