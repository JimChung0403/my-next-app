# 01 專案總覽（給 Jr 工程師）

這是一個使用 **Next.js 14 + React 18** 的前端專案，並同時透過 Next.js 的 **App Router API Routes** 模擬 BFF（Backend For Frontend）。目前提供三個頁面：

- **Maintain TL5 表單頁**：`/`（首頁）
- **登入頁**：`/login`
- **用戶查詢頁**：`/users`

後端 API 以 Next.js `/app/api` 目錄模擬，提供：

- `POST /api/login`
- `GET /api/users/:id`
- `GET /api/maintain/options`
- `POST /api/maintain/save`

此專案無註冊頁面（需求已移除）。

---

## 執行方式

```bash
npm run dev
```

啟動後開啟：`http://localhost:3000`

---

## 技術重點

- **Next.js App Router**：頁面與 API 都由 `app/` 目錄管理。
- **Client Components**：表單頁與互動元件使用 `"use client"`。
- **Tailwind CSS v4**：樣式透過 `app/globals.css` 與 className 組合。
- **BFF 模式**：前端頁面透過 `fetch()` 呼叫 `/api/*`（同專案）。

---

## 專案需求摘要（來源：req_doc）

- 建制一個表單頁，可送 API 儲存資料。
- 欄位 A/B 必填，Create Time / Update Time 為瀏覽器時間。
- Feb / Geometry 下拉選單從 API 取得選項（目前 mock）。
- 後端以 Next.js BFF 模擬。
- 註冊頁面已移除。

