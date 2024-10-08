export const name = {
  JWT: 'JWT',
  JSON_WEB_TOKEN_KEY: 'TOKEN_KEY',
  API_KEY: 'x-api-key',
  JWT_COOKIE: 'json_web_token_cookie',
  JWT_REFRESH: 'json_web_token_refresh',
  AGE_TOKEN: 60 * 1000 * 2,
  GOOGLE_OAUTH_2: 'google_oauth_2',
  FACEBOOK_AUTH: 'facebook_auth',
  MIDDLEWARE_NAME_JWT: 'MIDDLEWARE_NAME_JWT',
};

export const ROLE = {
  SPA: process.env.INIT_ROLE || 'SUPER_ADMIN',
  EMPLOYEE: 'EMPLOYEE',
};

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  CANCELED: 'CANCELED',
};
