import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { buildLineAuthorizeUrl } from '@/lib/line-oauth';
import { getOrCreateRequestId } from '@/lib/request-id';

const LINE_STATE_COOKIE_NAME = 'line_oauth_state';

function mask(value: string): string {
  if (value.length <= 8) {
    return '***';
  }
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function logOutgoingResponse(requestId: string, response: NextResponse, context: string): void {
  console.info('[auth][line][start] response', {
    requestId,
    context,
    status: response.status,
    type: 'redirect',
    location: response.headers.get('location')
  });
}

export async function GET(request: NextRequest) {
  const requestId = getOrCreateRequestId(request);
  // Step 1: 前端點擊「登入」後，先進到我們自己的後端 API。
  // 目的：由後端生成 state/nonce，避免前端直接拼接 OAuth URL。
  const state = crypto.randomBytes(16).toString('hex');
  const nonce = crypto.randomBytes(16).toString('hex');

  const cookieStore = await cookies();
  cookieStore.set(LINE_STATE_COOKIE_NAME, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 10 // 10 分鐘內必須完成回調
  });

  // Step 2: 導向 LINE 授權頁，使用者在 LINE 同意後，LINE 會帶 code 回呼 callback API。
  const authorizeUrl = buildLineAuthorizeUrl(state, nonce);
  const authorize = new URL(authorizeUrl);
  console.info('[auth][line][start] built authorize URL', {
    requestId,
    pathname: authorize.pathname,
    clientId: authorize.searchParams.get('client_id'),
    redirectUri: authorize.searchParams.get('redirect_uri'),
    scope: authorize.searchParams.get('scope'),
    state: mask(state)
  });
  console.info('[auth][line][start] redirecting to line authorize endpoint', { requestId });
  const response = NextResponse.redirect(authorizeUrl);
  response.headers.set('x-request-id', requestId);
  logOutgoingResponse(requestId, response, 'redirect_to_line_authorize');
  return response;
}
