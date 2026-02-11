# LINE Login URL 跳轉流程（NextAuth）

這份文件說明「使用 LINE 登入」時，瀏覽器與後端之間的 URL 跳轉與 API 呼叫順序。

## 1. 角色

- Browser：使用者瀏覽器
- App：你的 Next.js App（`http://localhost:3000`）
- NextAuth：`/api/auth/*` 路由處理器
- LINE：`https://access.line.me` / `https://api.line.me`

## 2. 時序圖

```mermaid
sequenceDiagram
    participant U as User Browser
    participant A as Next.js App
    participant N as NextAuth (/api/auth/*)
    participant L as LINE OAuth Server

    U->>A: 開啟 /nextauth
    U->>N: GET /api/auth/providers
    N-->>U: 200 providers

    U->>N: GET /api/auth/csrf
    N-->>U: 200 csrfToken + cookie

    U->>N: POST /api/auth/signin/line
    N-->>U: 200 (回傳授權 URL)

    U->>L: 轉跳到 LINE authorize URL
    Note over U,L: https://access.line.me/oauth2/v2.1/authorize?...<br/>包含 client_id, redirect_uri, state

    L-->>U: 使用者同意授權後 redirect 回 callback
    U->>N: GET /api/auth/callback/line?code=...&state=...

    N->>L: Token exchange (code -> access token)
    L-->>N: access_token / id_token

    N->>L: 取得 profile (或從 id_token 解析)
    L-->>N: user profile

    N-->>U: 302 Redirect /nextauth + 設定 session/JWT cookie
    U->>A: GET /nextauth
    A->>N: getServerSession()
    N-->>A: session(user)
    A-->>U: 200 顯示已登入與姓名
```

## 3. URL 跳轉與目的

1. `GET /nextauth`  
   顯示登入頁，前端按鈕準備呼叫 `signIn('line')`。

2. `GET /api/auth/providers`  
   讀取可用 provider 清單（包含 `line`）。

3. `GET /api/auth/csrf`  
   取得 CSRF token，給後續 signin 請求使用。

4. `POST /api/auth/signin/line`  
   NextAuth 產生 LINE 授權 URL（含 `state`），並觸發前端轉跳。

5. `https://access.line.me/oauth2/v2.1/authorize?...`  
   使用者在 LINE 登入並同意授權。

6. `GET /api/auth/callback/line?code=...&state=...`  
   LINE 回呼你站上的 callback。  
   NextAuth 在這一步驗證 `state`、用 `code` 換 token、拿 profile。

7. `302 -> /nextauth`  
   NextAuth 建立 session/JWT cookie 後導回頁面。

8. `GET /nextauth`  
   Server Component 透過 `getServerSession(getAuthOptions())` 讀 session，顯示登入狀態與姓名。

## 4. 授權 URL 重要參數

- `client_id`：LINE channel id
- `redirect_uri`：必須和 LINE Developers Callback URL 完全一致  
  目前：`http://localhost:3000/api/auth/callback/line`
- `response_type=code`：使用 authorization code flow
- `scope=openid profile`：要求基本身份資料
- `state`：防 CSRF

## 5. 你目前 log 的成功判斷點

當看到以下訊息，代表登入成功：

- `OAUTH_CALLBACK_RESPONSE` 有 `profile.id` / `profile.name`
- `[nextauth][jwt] token issued`
- `[nextauth][event] signIn`
- `GET /api/auth/callback/line ... 302`
- `GET /nextauth 200`

