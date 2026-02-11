import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/auth';
import { AuthButtons } from './auth-buttons';

export default async function NextAuthDemoPage() {
  // getServerSession(options) 參數：
  // - options: NextAuthOptions（providers、callbacks、session 策略等）
  //   這裡透過 getAuthOptions() 取得同一份設定，確保 API 與頁面讀 session 規則一致。
  // Step 8 (NextAuth 版): Server Component 直接讀 session。
  // NextAuth 會自動驗證 JWT cookie，再把 user 資料組成 session 物件。
  const session = await getServerSession(getAuthOptions());
  const user = session?.user;

  return (
    <main>
      <section className="card">
        <h1>LINE Login Sample (NextAuth)</h1>
        <p>這個專案現在只保留 NextAuth 實作，避免和舊版手刻流程混淆。</p>
        <p>
          首頁會自動導向到這一頁：<Link href="/">/</Link>
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
