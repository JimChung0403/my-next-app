import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateRequestId } from '@/lib/request-id';
import { SESSION_COOKIE_NAME } from '@/lib/session';

function logOutgoingResponse(requestId: string, response: NextResponse, context: string): void {
  console.info('[auth][logout] response', {
    requestId,
    context,
    status: response.status,
    type: 'redirect',
    location: response.headers.get('location')
  });
}

export async function POST(request: NextRequest) {
  const requestId = getOrCreateRequestId(request);
  // 登出是「刪除 session cookie」這件事本身。
  // cookie 一刪除，後續任何頁面重新讀取都會變成未登入狀態。
  const formData = await request.formData();
  const redirectTo = String(formData.get('redirectTo') ?? '/');
  console.info('[auth][logout] request received', { requestId, redirectTo });

  const response = NextResponse.redirect(new URL(redirectTo, request.url));
  console.info('[auth][logout] clearing session cookie and redirecting', { requestId });
  response.headers.set('x-request-id', requestId);
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0)
  });

  logOutgoingResponse(requestId, response, 'logout_redirect');
  return response;
}
