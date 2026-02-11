import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, fetchLineProfile } from '@/lib/line-oauth';
import { getOrCreateRequestId } from '@/lib/request-id';
import { createSessionToken, SESSION_COOKIE_NAME } from '@/lib/session';

const LINE_STATE_COOKIE_NAME = 'line_oauth_state';

function mask(value: string): string {
  if (value.length <= 8) {
    return '***';
  }
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function logOutgoingResponse(requestId: string, response: NextResponse, context: string): void {
  console.info('[auth][line][callback] response', {
    requestId,
    context,
    status: response.status,
    type: response.headers.get('content-type')?.includes('application/json') ? 'json' : 'redirect',
    location: response.headers.get('location')
  });
}

export async function GET(request: NextRequest) {
  const requestId = getOrCreateRequestId(request);
  // Step 3: LINE 將使用者導回 callback，並帶上 code/state。
  // 重點：callback URL 本身不會直接帶姓名，只有暫時授權碼 code。
  // 真正的姓名要靠伺服器拿 code 去 LINE API 換回來。
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  console.info('[auth][line][callback] request received', {
    requestId,
    hasCode: Boolean(code),
    hasState: Boolean(state),
    error
  });

  if (error) {
    console.warn('[auth][line][callback] line returned oauth error', { requestId, error });
    const response = NextResponse.json({ code: 'LINE_AUTH_ERROR', message: error, data: null }, { status: 400 });
    response.headers.set('x-request-id', requestId);
    logOutgoingResponse(requestId, response, 'line_auth_error');
    return response;
  }

  if (!code || !state) {
    console.warn('[auth][line][callback] missing code or state', { requestId });
    const response = NextResponse.json({ code: 'INVALID_CALLBACK', message: 'Missing code/state.', data: null }, { status: 400 });
    response.headers.set('x-request-id', requestId);
    logOutgoingResponse(requestId, response, 'invalid_callback');
    return response;
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get(LINE_STATE_COOKIE_NAME)?.value;

  // Step 4: 核對 state，防止 CSRF。
  if (!storedState || storedState !== state) {
    console.warn('[auth][line][callback] state mismatch', {
      requestId,
      storedState: storedState ? mask(storedState) : null,
      receivedState: mask(state)
    });
    const response = NextResponse.json({ code: 'STATE_MISMATCH', message: 'Invalid OAuth state.', data: null }, { status: 400 });
    response.headers.set('x-request-id', requestId);
    logOutgoingResponse(requestId, response, 'state_mismatch');
    return response;
  }
  console.info('[auth][line][callback] state verified', { requestId, state: mask(state) });

  // state 用完即刪，避免重放。
  cookieStore.delete(LINE_STATE_COOKIE_NAME);

  try {
    // Step 5: 用 code 向 LINE Token API 換 access_token。
    // 這裡是 OAuth2 的標準授權碼交換流程：
    // code(一次性) -> access_token(可呼叫資源 API)
    console.info('[auth][line][callback] exchanging code for access token', { requestId, code: mask(code) });
    const token = await exchangeCodeForToken(code);
    console.info('[auth][line][callback] token exchange succeeded', {
      requestId,
      tokenType: token.token_type,
      expiresIn: token.expires_in,
      scope: token.scope
    });

    // Step 6: 再用 access_token 呼叫 LINE Profile API，取得使用者資料。
    // 這一步才會拿到 displayName / userId / pictureUrl。
    const profile = await fetchLineProfile(token.access_token);
    console.info('[auth][line][callback] profile fetched', {
      requestId,
      userId: mask(profile.userId),
      displayName: profile.displayName
    });

    // Step 7: 把必要的使用者資料寫進 JWT cookie，前端後續就能識別登入狀態。
    // 目前 cookie 儲存的是「我們自己簽發的 JWT」，不是 LINE 的 access_token。
    const sessionToken = createSessionToken({
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl
    });

    const response = NextResponse.redirect(new URL('/', request.url));
    console.info('[auth][line][callback] login success, redirecting to home', { requestId });
    response.headers.set('x-request-id', requestId);
    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 // 1 hour
    });

    logOutgoingResponse(requestId, response, 'login_success_redirect_home');
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown callback error';
    console.error('[auth][line][callback] login failed', { requestId, message });
    const response = NextResponse.json({ code: 'LOGIN_FAILED', message, data: null }, { status: 500 });
    response.headers.set('x-request-id', requestId);
    logOutgoingResponse(requestId, response, 'login_failed');
    return response;
  }
}
