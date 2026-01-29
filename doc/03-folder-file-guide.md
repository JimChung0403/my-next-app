# 03 資料夾與檔案導覽（含區塊說明）

以下依「資料夾 → 檔案 → 重要區塊」整理。

---

## `/app`（App Router 主體）

### `/app/page.tsx`（Maintain TL5 表單頁）

- **角色**：首頁，展示主要表單與與 API 串接流程。
- **重要區塊**：
  - `useState`：管理表單欄位與狀態（A、B、時間、選項、錯誤、loading）。
  - `useEffect(fetchOptions)`：載入 `Feb/Geometry` 下拉選單。
  - `handleSubmit()`：送出表單，呼叫 `POST /api/maintain/save`。
  - UI 組合：`Field`、`ReadOnlyField`、`SelectField`、`SubmitButton`、`ResultPanel`。

### `/app/login/page.tsx`（登入頁）

- **角色**：示範登入表單與驗證。
- **重要區塊**：
  - `validate()`：基本 email / password 檢查。
  - `handleSubmit()`：呼叫 `POST /api/login`。
  - UI 組合：`Field` + `SubmitButton` + `ResultPanel`。

### `/app/users/page.tsx`（用戶查詢頁）

- **角色**：示範查詢 API + params。
- **重要區塊**：
  - `validate()`：檢查 userId 格式 `u-` 開頭。
  - `handleSubmit()`：呼叫 `GET /api/users/:id`。

### `/app/layout.tsx`（全域 Layout）

- **角色**：App Router 的根 layout。
- **重要區塊**：
  - 載入 Google Fonts（Inter / JetBrains Mono）。
  - 設定 metadata。
  - 包裹全站 `<body>` className。

### `/app/globals.css`（全域樣式）

- **角色**：Tailwind v4 核心樣式入口與全域動畫。
- **重要區塊**：
  - `@import "tailwindcss"`：啟用 Tailwind v4。
  - `@theme inline`：與 Next font 變數對接。
  - 自訂動畫：`fadeIn`、`riseIn`、`.stagger`。

### `/app/components`（共用元件）

#### `PageShell.tsx`

- **角色**：提供 `/login`、`/users` 共用外框（背景、標題、返回首頁）。
- **關鍵點**：抽出統一視覺風格與 page header。

#### `ui.tsx`

- **角色**：表單型 UI 元件集合。
- **元件清單**：
  - `Field`（可輸入欄位）
  - `ReadOnlyField`（只讀欄位）
  - `SelectField`（下拉選單）
  - `SubmitButton`（按鈕含 loading）
  - `ResultPanel`（顯示 API 結果）
  - `CardShell`（卡片視覺容器）
- **關鍵點**：`tone` prop 控制視覺色調。

---

## `/app/api`（BFF 模擬 API）

### `/app/api/login/route.ts`

- **角色**：登入驗證（mock）。
- **流程**：比對固定帳密，成功回傳 token + user。

### `/app/api/users/[id]/route.ts`

- **角色**：根據 URL params.id 回傳使用者資訊（mock）。
- **流程**：查找 USERS 物件；找不到回 404。

### `/app/api/maintain/options/route.ts`

- **角色**：提供 Feb / Geometry 下拉選單。
- **流程**：回傳固定 options。

### `/app/api/maintain/save/route.ts`

- **角色**：模擬儲存表單。
- **流程**：回傳 `id` + 表單內容 + `savedAt`。

---

## 專案設定與其他檔案

- `package.json`：npm scripts、Next/React/Tailwind 版本。
- `next.config.mjs`：Next.js 設定（目前為預設）。
- `postcss.config.mjs`：Tailwind v4 使用 PostCSS。
- `tsconfig.json`：TypeScript 設定。
- `eslint.config.mjs`：ESLint 設定。
- `req_doc`：原始需求摘要（本專案來源）。

