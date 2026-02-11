import crypto from 'node:crypto';
import type { NextRequest } from 'next/server';

export function getOrCreateRequestId(request: NextRequest): string {
  const incoming = request.headers.get('x-request-id');
  if (incoming && incoming.trim()) {
    return incoming.trim();
  }
  return crypto.randomUUID();
}
