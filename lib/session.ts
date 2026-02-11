import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { getEnv } from '@/lib/env';
import type { SessionPayload, SessionUser } from '@/types/auth';

export const SESSION_COOKIE_NAME = 'line_demo_session';
const SESSION_TTL_SECONDS = 60 * 60; // 1 hour

function toBase64Url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function fromBase64Url(input: string): Buffer {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  const padded = pad === 0 ? base64 : `${base64}${'='.repeat(4 - pad)}`;
  return Buffer.from(padded, 'base64');
}

function sign(value: string): string {
  const { sessionSecret } = getEnv();
  return toBase64Url(crypto.createHmac('sha256', sessionSecret).update(value).digest());
}

export function createSessionToken(user: SessionUser): string {
  const payload: SessionPayload = {
    user,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  };

  // 教學重點：token 結構 = payload.signature
  // payload 是可讀資料，signature 防止使用者任意竄改 payload。
  const payloadEncoded = toBase64Url(JSON.stringify(payload));
  const signature = sign(payloadEncoded);
  return `${payloadEncoded}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const [payloadEncoded, signature] = token.split('.');
  if (!payloadEncoded || !signature) {
    return null;
  }

  const expectedSignature = sign(payloadEncoded);
  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (provided.length !== expected.length) {
    return null;
  }

  // timingSafeEqual 可降低 side-channel timing attack 風險。
  if (!crypto.timingSafeEqual(provided, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(payloadEncoded).toString('utf8')) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }
  const payload = verifySessionToken(token);
  return payload?.user ?? null;
}
