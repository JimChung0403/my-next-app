import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AuthButtons } from './auth-buttons';

export default async function NextAuthDemoPage() {
  // Step 8 (NextAuth 版): Server Component 直接讀 session。
  // NextAuth 會自動驗證 JWT cookie，再把 user 資料組成 session 物件。
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <main>
      <section className="card">
        <h1>LINE Login Sample (NextAuth Version)</h1>
        <p>這一頁是 NextAuth 實作，保留 Step 1~8 註解，讓你和手刻版本對照。</p>
        <p>
          對照頁：<Link href="/">手刻 OAuth + JWT 版</Link>
        </p>

        {user ? (
          <>
            <div className="user-card">
              <p>
                目前狀態：<strong>已登入</strong>
              </p>
              <p>
                使用者姓名：<strong>{user.name ?? '(No Name)'}</strong>
              </p>
              <p>LINE User ID: {user.id ?? '(No User ID)'}</p>
            </div>
            <div className="actions">
              <AuthButtons isLoggedIn />
            </div>
          </>
        ) : (
          <>
            <p>
              目前狀態：<strong>未登入</strong>
            </p>
            <div className="actions">
              <AuthButtons isLoggedIn={false} />
            </div>
          </>
        )}
      </section>
    </main>
  );
}
