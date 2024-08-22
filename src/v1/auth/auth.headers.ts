export type SessionHeaders = {
  /**
   * 사용자의 세션 ID.
   */
  UserSessionId: string;
};

export type ApiAuthHeaders = {
  /**
   * Next 백엔드에서 Nest 백엔드 API 호출시 필요한 시크릿.
   */
  LmsSecret: string;
};

export type AuthHeaders = SessionHeaders & ApiAuthHeaders;
