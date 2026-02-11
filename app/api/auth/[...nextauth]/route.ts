import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Step 2~7 (NextAuth 版): 這個 handler 會接管 OAuth 整條鏈路：
// - 產生授權 URL + redirect 到 LINE
// - callback 收 code/state
// - 驗證 state/pkce/csrf
// - 用 code 換 token
// - 取 profile
// - 建立 JWT session cookie
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
