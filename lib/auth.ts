import type { NextAuthOptions } from 'next-auth';
import LineProvider from 'next-auth/providers/line';

export function getAuthOptions(): NextAuthOptions {
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;
  if (!nextAuthSecret) {
    console.warn('[nextauth][config] NEXTAUTH_SECRET is missing. Set it in .env.local before production use.');
  }

  return {
    secret: nextAuthSecret ?? 'dev-insecure-nextauth-secret',
    session: {
      strategy: 'jwt'
    },
    providers: [
      LineProvider({
        // LineProvider 參數：
        // - clientId: LINE Login 的 Channel ID
        // - clientSecret: LINE Login 的 Channel Secret
        // - profile: 將 LINE 回傳資料轉成 NextAuth 標準 user 欄位
        // 使用 LINE Login channel 的 client id / secret。
        clientId: process.env.LINE_CHANNEL_ID ?? '',
        clientSecret: process.env.LINE_CHANNEL_SECRET ?? '',
        profile(profile) {
          // profile 參數：LINE provider 回傳的原始 profile 物件（OIDC claims / profile API 格式）
          // Step 6 (NextAuth 版): NextAuth 在拿到 access_token 後，
          // 會呼叫 provider 的 profile endpoint，這裡把 LINE profile 映射成統一 user 物件。
          // LINE 可能回兩種欄位格式：
          // 1) OIDC id_token claims: sub/name/picture
          // 2) profile API: userId/displayName/pictureUrl
          const id = typeof profile.sub === 'string' ? profile.sub : profile.userId;
          const name = typeof profile.name === 'string' ? profile.name : profile.displayName;
          const image = typeof profile.picture === 'string' ? profile.picture : profile.pictureUrl;

          if (!id) {
            throw new Error('LINE profile id is missing (sub/userId).');
          }

          return {
            id,
            name: name ?? null,
            image: image ?? null
          };
        }
      })
    ],
    callbacks: {
      async jwt({ token, user, account }) {
        // jwt callback 參數：
        // - token: 目前 JWT payload（可讀寫）
        // - user: 僅在登入成功當下存在，含 provider 解析後 user
        // - account: OAuth 帳號資訊（provider、access_token 等）
        // Step 7 (NextAuth 版): 登入成功時把必要欄位放進 JWT。
        // 之後每次請求會從 JWT 還原 session。
        if (user) {
          token.userId = user.id;
        }
        if (account) {
          console.info('[nextauth][jwt] token issued', {
            provider: account.provider,
            hasAccessToken: Boolean(account.access_token)
          });
        }
        return token;
      },
      async session({ session, token }) {
        // session callback 參數：
        // - session: 回傳給前端/Server Component 的 session 物件（可改寫）
        // - token: jwt callback 產生的 JWT payload（唯讀來源）
        // Step 8 (NextAuth 版): 把 JWT 內容映射到 session，給前端/Server Component 使用。
        if (session.user) {
          session.user.id = typeof token.userId === 'string' ? token.userId : undefined;
        }
        return session;
      }
    },
    events: {
      async signIn({ user, account }) {
        // signIn event 參數：
        // - user: 登入成功後的使用者資料
        // - account: 本次登入的 provider 帳號資訊
        console.info('[nextauth][event] signIn', {
          provider: account?.provider,
          userId: user.id,
          name: user.name
        });
      },
      async signOut() {
        console.info('[nextauth][event] signOut');
      }
    },
    logger: {
      error(code, metadata) {
        // logger.error 參數：
        // - code: NextAuth 定義的錯誤代碼
        // - metadata: 錯誤附加資訊（stack/profile 等）
        console.error('[nextauth][error]', { code, metadata });
      },
      warn(code) {
        // logger.warn 參數：
        // - code: NextAuth 定義的警告代碼
        console.warn('[nextauth][warn]', { code });
      },
      debug(code, metadata) {
        // logger.debug 參數：
        // - code: NextAuth 除錯事件代碼
        // - metadata: 事件詳細內容（例如授權 URL、state）
        console.info('[nextauth][debug]', { code, metadata });
      }
    }
  };
}
