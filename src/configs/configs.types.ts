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
  AWS_S3_PRIVATE_PRESIGNED_URL_EXPIRE_SECONDS: number;
  AWS_S3_PRIVATE_BUCKET: string;
  AWS_S3_VIDEO_INPUT_BUCKET: string;
  AWS_PUBLIC_RESOURCE_CDN_BASE_URL: string;
  AWS_PRIVATE_RESOURCE_CDN_BASE_URL: string;
  AWS_VIDEO_CDN_BASE_URL: string;
  AWS_CDN_PRE_SIGNED_URL_KEY_GROUP_ID: string;
  AWS_CDN_PRE_SIGNED_URL_VALID_DAYS_DURATION: number;
  AWS_CDN_PRE_SIGNED_URL_PRIVATE_KEY: string;
};

export type IPortoneConfigs = {
  PORTONE_API_SECRET: string;
  PORTONE_API_BASE_URL: string;
};

export type ISmsConfigs = {
  SMS_API_KEY: string;
  SMS_API_SECRET: string;
  FROM_PHONE_NUMBER: string;
};

export type IEnvironment = IAppConfigs &
  IAuthConfigs &
  IDatabaseConfigs &
  IAwsConfigs &
  IPortoneConfigs &
  ISmsConfigs;
