import type { NextAuthOptions } from 'next-auth';
import LineProvider from 'next-auth/providers/line';

const nextAuthSecret = process.env.NEXTAUTH_SECRET ?? process.env.SESSION_SECRET;

if (!nextAuthSecret) {
  throw new Error('Missing NEXTAUTH_SECRET (or SESSION_SECRET fallback) for NextAuth.');
}

export const authOptions: NextAuthOptions = {
  secret: nextAuthSecret,
  session: {
    strategy: 'jwt'
  },
  providers: [
    LineProvider({
      // 沿用原本環境變數，方便你直接比較手刻版與 NextAuth 版。
      clientId: process.env.LINE_CHANNEL_ID ?? '',
      clientSecret: process.env.LINE_CHANNEL_SECRET ?? '',
      profile(profile) {
        // Step 6 (NextAuth 版): NextAuth 在拿到 access_token 後，
        // 會呼叫 provider 的 profile endpoint，這裡把 LINE profile 映射成統一 user 物件。
        return {
          id: profile.userId,
          name: profile.displayName,
          image: profile.pictureUrl
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
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
      // Step 8 (NextAuth 版): 把 JWT 內容映射到 session，給前端/Server Component 使用。
      if (session.user) {
        session.user.id = typeof token.userId === 'string' ? token.userId : undefined;
      }
      return session;
    }
  },
  events: {
    async signIn({ user, account }) {
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
      console.error('[nextauth][error]', { code, metadata });
    },
    warn(code) {
      console.warn('[nextauth][warn]', { code });
    },
    debug(code, metadata) {
      console.info('[nextauth][debug]', { code, metadata });
    }
  }
};
