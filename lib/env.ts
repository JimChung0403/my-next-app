const requiredEnv = ['LINE_CHANNEL_ID', 'LINE_CHANNEL_SECRET', 'APP_BASE_URL', 'SESSION_SECRET'] as const;

type RequiredEnvKey = (typeof requiredEnv)[number];

function readRequiredEnv(key: RequiredEnvKey): string {
  const value = process.env[key];
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export interface AppEnv {
  lineChannelId: string;
  lineChannelSecret: string;
  appBaseUrl: string;
  sessionSecret: string;
  lineRedirectPath: string;
}

export function getEnv(): AppEnv {
  const env = {
    lineChannelId: readRequiredEnv('LINE_CHANNEL_ID'),
    lineChannelSecret: readRequiredEnv('LINE_CHANNEL_SECRET'),
    appBaseUrl: readRequiredEnv('APP_BASE_URL').replace(/\/$/, ''),
    sessionSecret: readRequiredEnv('SESSION_SECRET'),
    lineRedirectPath: process.env.LINE_REDIRECT_PATH || '/api/auth/line/callback'
  };

  if (env.sessionSecret.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters for secure signing.');
  }

  return env;
}

export function getLineRedirectUri(): string {
  const env = getEnv();
  return `${env.appBaseUrl}${env.lineRedirectPath}`;
}
