# 05 學習路線與建議

給剛畢業的 Jr 工程師的建議學習順序：

---

## Step 1：理解頁面與路由

- 先讀 `app/page.tsx`、`app/login/page.tsx`、`app/users/page.tsx`
- 了解 App Router 的路由規則：
  - `app/page.tsx` => `/`
  - `app/login/page.tsx` => `/login`
  - `app/users/page.tsx` => `/users`

---

## Step 2：理解 API Routes

- 讀 `app/api/*/route.ts`，理解 API 回傳格式。
- 對照前端 `fetch()` 的路徑與 method。

---

## Step 3：掌握共用 UI

- 讀 `app/components/ui.tsx`：理解表單元件如何接 `props`。
- 讀 `app/components/PageShell.tsx`：了解頁面框架。

---

## Step 4：練習改需求

可以自我練習的題目：

- 在 Maintain TL5 表單新增欄位 `C`。
- 將 Feb 選單改成呼叫另一個 API。
- 在登入頁加入「記住我」勾選。
- 在用戶查詢頁新增「email 查詢」。

---

## Step 5：理解樣式與動畫

- 讀 `app/globals.css`。
- 嘗試新增新的動畫 class 並在頁面套用。

---

## 常用指令

```bash
npm run dev    # 開發模式
npm run lint   # Lint 檢查
npm run build  # 打包
npm run start  # 啟動 production build
```

