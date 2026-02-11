import { getEnv, getLineRedirectUri } from '@/lib/env';
import type { LineProfile, LineTokenResponse } from '@/types/auth';

const LINE_AUTHORIZE_ENDPOINT = 'https://access.line.me/oauth2/v2.1/authorize';
const LINE_TOKEN_ENDPOINT = 'https://api.line.me/oauth2/v2.1/token';
const LINE_PROFILE_ENDPOINT = 'https://api.line.me/v2/profile';

export function buildLineAuthorizeUrl(state: string, nonce: string): string {
  const env = getEnv();
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: env.lineChannelId,
    redirect_uri: getLineRedirectUri(),
    state,
    scope: 'openid profile',
    nonce
  });

  return `${LINE_AUTHORIZE_ENDPOINT}?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string): Promise<LineTokenResponse> {
  const env = getEnv();
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: getLineRedirectUri(),
    client_id: env.lineChannelId,
    client_secret: env.lineChannelSecret
  });

  const response = await fetch(LINE_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body,
    cache: 'no-store'
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LINE token exchange failed: ${response.status} ${text}`);
  }

  return (await response.json()) as LineTokenResponse;
}

export async function fetchLineProfile(accessToken: string): Promise<LineProfile> {
  const response = await fetch(LINE_PROFILE_ENDPOINT, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LINE profile request failed: ${response.status} ${text}`);
  }

  return (await response.json()) as LineProfile;
}
