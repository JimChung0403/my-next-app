import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';

export default async function HomePage() {
  // 這裡是 Server Component。
  // 每次請求進來時，Next.js 會在伺服器端讀 cookie，判斷是否有登入中的 JWT。
  // 資料來源是 callback API 建立的 line_demo_session（JWT）：
  // callback 拿 code -> 換 token -> 取 profile(displayName) -> 寫入 cookie。
  const user = await getCurrentUser();

  return (
    <main>
      <section className="card">
        <h1>LINE OAuth2.0 Login Sample</h1>
        <p>
          這個範例展示 Next.js 14 (App Router) 如何串接 LINE Login。
          目標是讓剛入行的工程師可以清楚看到「前端點擊 → 後端導向 → callback → session → 顯示使用者資料」的完整鏈路。
        </p>
        <p>
          NextAuth 對照版：<Link href="/nextauth">/nextauth</Link>
        </p>

        {user ? (
          <>
            <div className="user-card">
              <p>
                目前狀態：<strong>已登入</strong>
              </p>
              <p>
                使用者姓名：<strong>{user.displayName}</strong>
              </p>
              <p>LINE User ID: {user.userId}</p>
            </div>

            <div className="actions">
              {/* 登出流程：form POST -> /api/auth/logout -> API 清 cookie -> redirect 回首頁 */}
              <form method="post" action="/api/auth/logout">
                <input type="hidden" name="redirectTo" value="/" />
                <button type="submit" className="button logout">
                  登出
                </button>
              </form>
            </div>
          </>
        ) : (
          <>
            <p>
              目前狀態：<strong>未登入</strong>
            </p>
            <div className="actions">
              {/* 登入流程起點：點擊後進入我們自己的 API，後端再導向 LINE 授權頁。 */}
              <a href="/api/auth/line/start" className="button login">
                使用 LINE 登入
              </a>
            </div>
          </>
        )}

        <small>提醒：請先在 .env.local 設定 LINE Channel 與 Callback URL。</small>
      </section>
    </main>
  );
}
