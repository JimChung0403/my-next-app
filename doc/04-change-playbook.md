# 04 需求變更時該從哪裡改

這份文件提供「常見需求 → 修改位置」的對照，讓 Jr 工程師快速下手。

---

## 1. 表單新增/刪除欄位（Maintain TL5）

**需求例：** 新增欄位 C，或移除 B。

- 修改 UI：`app/page.tsx`
  - `useState` 追加欄位
  - `validation` 追加必填/格式檢查
  - `<Field />` 或 `<SelectField />` 加入表單
- 修改送出 payload：`handleSubmit()` 中的 `body`
- 修改 API：`app/api/maintain/save/route.ts`
  - `SavePayload` 新增欄位
  - 回傳 data 一併帶出

---

## 2. 下拉選單資料改來源 / 改 API 格式

**需求例：** `Feb` 變成 `MonthOptions`，或 API 改為 `items`。

- API 回傳格式：`app/api/maintain/options/route.ts`
- 前端對應型別與解析：`app/page.tsx`
  - `OptionsPayload` type
  - `setOptions(data.data)` 解析邏輯
  - `<SelectField options={...} />`

**要點：** 前端與 API 回傳格式必須同步。

---

## 3. 改成真實後端（不是 mock）

**需求例：** 與真實後端串接。

- 替換 API route 內容
  - `app/api/*/route.ts` 中改成轉發（fetch 外部 API）或直接串 DB
- 或改前端直接呼叫外部 API
  - `app/page.tsx` / `app/login/page.tsx` / `app/users/page.tsx`

**建議：** 保留 BFF（API routes）做統一轉接與驗證，比較安全。

---

## 4. 登入流程變更

**需求例：** 加入 JWT、刷新 token、增加欄位。

- `app/api/login/route.ts`：改驗證與回傳格式
- `app/login/page.tsx`：同步前端期待的 response 結構

---

## 5. 用戶查詢邏輯變更

**需求例：** 支援更多查詢條件（email/phone）。

- `app/users/page.tsx`：調整輸入欄位、驗證
- `app/api/users/[id]/route.ts`：改為 `query string` 或新增 route

---

## 6. UI 樣式與視覺調整

- 全域色調/動畫：`app/globals.css`
- 卡片與表單元件：`app/components/ui.tsx`
- 全站頁面外框：`app/components/PageShell.tsx`

---

## 7. 新增頁面

**步驟：**

1. 新增 `app/xxx/page.tsx`
2. 若需要 API，新增 `app/api/xxx/route.ts`
3. 若有共用 UI，放在 `app/components/`

---

## 8. 常見錯誤排查

- **下拉選單沒有資料**：檢查 `GET /api/maintain/options` 是否回傳正確 JSON。
- **送出錯誤**：檢查 `POST /api/maintain/save` 的 payload 欄位是否匹配。
- **API 404**：確認 app/api 的路徑與檔案名稱。

