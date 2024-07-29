export type IAppConfigs = {
  NODE_ENV: 'production' | 'test' | 'development';
  APP_PORT: `${number}` | number;
};

export type IAuthConfigs = {
  JWT_SECRET: string;
};

export type IDatabaseConfigs = {
  DATABASE_URL: string;
};

export type IEnvironment = IAppConfigs & IAuthConfigs & IDatabaseConfigs;
