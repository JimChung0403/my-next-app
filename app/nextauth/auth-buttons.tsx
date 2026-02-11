'use client';

import { signIn, signOut } from 'next-auth/react';

export function AuthButtons({ isLoggedIn }: { isLoggedIn: boolean }) {
  if (!isLoggedIn) {
    return (
      <button
        type="button"
        className="button login"
        onClick={() => {
          // signIn(providerId, options) 參數：
          // - providerId: 'line'，指定使用哪個 provider（對應 lib/auth.ts 的 LineProvider）
          // - options.callbackUrl: 登入成功後要回到哪個頁面
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
        // signOut(options) 參數：
        // - options.callbackUrl: 登出後導回頁面
        // 登出流程 (NextAuth 版): signOut 會呼叫 NextAuth 的 signout endpoint 清 session。
        void signOut({ callbackUrl: '/nextauth' });
      }}
    >
      登出 (NextAuth)
    </button>
  );
}
