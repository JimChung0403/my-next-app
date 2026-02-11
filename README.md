# Next.js 14 + React 18 + LINE OAuth2 Sample

這是一個給新手工程師學習的最小可執行範例。

- 技術：`Next.js 14` + `React 18` + `TypeScript`
- 功能：LINE OAuth2 登入 / 登出
- 登入成功後：顯示 LINE 使用者姓名（`displayName`）

## 1. 安裝與啟動

```bash
npm install
cp .env.example .env.local
npm run dev
```

開啟：`http://localhost:3000`

## 2. LINE Developers 後台設定

到 LINE Developers 建立 Login Channel，並設定：

1. Callback URL: `http://localhost:3000/api/auth/line/callback`
2. 取得 `Channel ID` 與 `Channel Secret`

## 3. 環境變數 (`.env.local`)

```env
LINE_CHANNEL_ID=YOUR_LINE_CHANNEL_ID
LINE_CHANNEL_SECRET=YOUR_LINE_CHANNEL_SECRET
APP_BASE_URL=http://localhost:3000
LINE_REDIRECT_PATH=/api/auth/line/callback
SESSION_SECRET=replace_with_a_long_random_secret_at_least_32_chars
```

## 4. 前後端調用鏈路（教學重點）

### A. 登入流程

1. 前端點擊 `使用 LINE 登入`（`app/page.tsx`）
2. 請求 `GET /api/auth/line/start`（`app/api/auth/line/start/route.ts`）
3. 後端產生 `state` 並寫入 cookie（防 CSRF），再 `redirect` 到 LINE 授權頁
4. 使用者在 LINE 同意授權後，LINE 回呼 `GET /api/auth/line/callback?code=...&state=...`
5. callback API 驗證 `state`，用 `code` 向 LINE Token API 換 `access_token`
6. callback API 使用 `access_token` 呼叫 LINE Profile API 取得 `displayName`
7. 後端建立 JWT cookie 並導回首頁
8. 首頁 Server Component 驗證 JWT 後顯示姓名

### B. 登出流程

1. 前端送出 `POST /api/auth/logout`
2. 後端刪除 session cookie
3. redirect 回首頁
4. 首頁重新渲染為未登入狀態

## 5. 檔案說明

- `app/page.tsx`: UI + 登入/登出入口
- `app/api/auth/line/start/route.ts`: OAuth 起點（產生 state 並導向 LINE）
- `app/api/auth/line/callback/route.ts`: OAuth callback（code 換 token、取 profile、建立 session）
- `app/api/auth/logout/route.ts`: 清除 session
- `lib/line-oauth.ts`: 與 LINE API 溝通
- `lib/session.ts`: JWT 簽發與驗證（HS256）
- `lib/env.ts`: 環境變數檢查
- `types/auth.ts`: 型別定義

## 6. 安全提醒（這是 sample，但要知道）

1. 這份 sample 使用自簽 JWT（HS256）放在 HttpOnly cookie。
2. 一定要驗證 OAuth `state`（此範例已做）。
3. 正式環境請使用 `https`，並確保 cookie `secure: true`。
4. 若要更嚴謹，應驗證 `id_token` 簽章與 claim。
