export type IAppConfigs = {
  NODE_ENV: 'production' | 'test' | 'development';
  APP_PORT: number;
};

export type IAuthConfigs = {
  LMS_SECRET: string;
};

export type IDatabaseConfigs = {
  DATABASE_URL: string;
};

export type IAwsConfigs = {
  AWS_S3_REGION: 'ap-northeast-2';
  AWS_S3_ACCESS_KEY: string;
  AWS_S3_SECRET: string;
  AWS_S3_BUCKET: string;
  AWS_S3_PRESIGNED_URL_EXPIRE_SECONDS: number;
};

export type IPortoneConfigs = {
  PORTONE_API_SECRET: string;
  PORTONE_API_BASE_URL: string;
};

export type IEnvironment = IAppConfigs &
  IAuthConfigs &
  IDatabaseConfigs &
  IAwsConfigs &
  IPortoneConfigs;
