import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { buildLineAuthorizeUrl } from '@/lib/line-oauth';

const LINE_STATE_COOKIE_NAME = 'line_oauth_state';

export async function GET() {
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
  return NextResponse.redirect(authorizeUrl);
}
