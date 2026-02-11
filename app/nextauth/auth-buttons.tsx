'use client';

import { signIn, signOut } from 'next-auth/react';

export function AuthButtons({ isLoggedIn }: { isLoggedIn: boolean }) {
  if (!isLoggedIn) {
    return (
      <button
        type="button"
        className="button login"
        onClick={() => {
          // Step 1 (NextAuth 版): 前端呼叫 signIn('line')，由 NextAuth 開始 OAuth redirect 流程。
          void signIn('line', { callbackUrl: '/nextauth' });
        }}
      >
        使用 LINE 登入 (NextAuth)
      </button>
    );
  }

  return (
    <button
      type="button"
      className="button logout"
      onClick={() => {
        // 登出流程 (NextAuth 版): signOut 會呼叫 NextAuth 的 signout endpoint 清 session。
        void signOut({ callbackUrl: '/nextauth' });
      }}
    >
      登出 (NextAuth)
    </button>
  );
}
