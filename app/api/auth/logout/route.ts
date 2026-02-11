import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/session';

export async function POST(request: NextRequest) {
  // 登出是「刪除 session cookie」這件事本身。
  // cookie 一刪除，後續任何頁面重新讀取都會變成未登入狀態。
  const formData = await request.formData();
  const redirectTo = String(formData.get('redirectTo') ?? '/');

  const response = NextResponse.redirect(new URL(redirectTo, request.url));
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0)
  });

  return response;
}
