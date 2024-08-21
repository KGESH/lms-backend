export type SessionHeaders = {
  UserSessionId: string;
};

export type ApiAuthHeaders = {
  LmsSecret: string;
};

export type AuthHeaders = SessionHeaders & ApiAuthHeaders;
