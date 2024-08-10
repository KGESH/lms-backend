import { users } from '../../infra/db/schema/user';

export const BackendUserDbTable = users;

export type IBackendUserDbTable = typeof BackendUserDbTable;
