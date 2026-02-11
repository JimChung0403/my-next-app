# Next.js 14 + React 18 + LINE Login (NextAuth)

這是一個給新手工程師學習的最小可執行範例，使用 **NextAuth** 串接 LINE Login。

- 技術：`Next.js 14` + `React 18` + `TypeScript` + `next-auth`
- 功能：LINE 登入 / 登出
- 登入成功後：顯示 LINE 使用者姓名

## 1. 安裝與啟動

```bash
npm install
cp .env.example .env.local
npm run dev
```

開啟：`http://localhost:3000`（會自動導向 `/nextauth`）

## 2. LINE Developers 後台設定

請在 LINE Login channel 設定 Callback URL：

`http://localhost:3000/api/auth/callback/line`

## 3. 環境變數 (`.env.local`)

```env
LINE_CHANNEL_ID=YOUR_LINE_CHANNEL_ID
LINE_CHANNEL_SECRET=YOUR_LINE_CHANNEL_SECRET
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace_with_a_long_random_secret_at_least_32_chars
```

## 4. OAuth 流程對照（Step 1~8）

1. 前端點擊 `signIn('line')`（`app/nextauth/auth-buttons.tsx`）
2. 請求進入 `app/api/auth/[...nextauth]/route.ts`
3. NextAuth 導向 LINE 授權頁（含 state/csrf）
4. LINE 回呼 `/api/auth/callback/line`
5. NextAuth 用 `code` 向 LINE token endpoint 換 access token
6. NextAuth 透過 provider profile endpoint 取得 `displayName`
7. NextAuth 建立 JWT session cookie
8. `getServerSession` 讀取 session 並在頁面顯示姓名

## 5. 主要檔案

- `app/api/auth/[...nextauth]/route.ts`: NextAuth OAuth handler
- `app/nextauth/page.tsx`: 登入狀態頁
- `app/nextauth/auth-buttons.tsx`: signIn/signOut 入口
- `lib/auth.ts`: NextAuth 設定（LINE provider + callbacks/events/logger）
- `types/next-auth.d.ts`: NextAuth Session/JWT 型別擴充

## 6. 安全提醒

1. 正式環境請使用 HTTPS。
2. `NEXTAUTH_SECRET` 請使用高強度隨機字串。
3. 請勿把 `.env.local` 提交到版本控制。
