# 02 架構與資料流（上/下游關係）

這個專案可以分成 **UI 頁面層** 與 **BFF API 層**。資料流由 UI 觸發，再進到 API 路由，回傳 mock 結果給 UI。

---

## 頁面路由與 API 對應

| 頁面 | 檔案 | 呼叫的 API | 功能 |
| --- | --- | --- | --- |
| `/` | `app/page.tsx` | `GET /api/maintain/options`、`POST /api/maintain/save` | Maintain TL5 表單 |
| `/login` | `app/login/page.tsx` | `POST /api/login` | 登入表單 |
| `/users` | `app/users/page.tsx` | `GET /api/users/:id` | 用戶查詢 |

---

## 典型流程（Maintain TL5）

1. 使用者進入 `/`（`app/page.tsx`）。
2. `useEffect()` 觸發 `GET /api/maintain/options`：
   - 由 `app/api/maintain/options/route.ts` 回傳 `Feb` 與 `Geometry`。
3. 使用者填寫 A/B、選擇 Feb/Geometry。
4. 點「送出」觸發 `POST /api/maintain/save`：
   - 由 `app/api/maintain/save/route.ts` 回傳 mock 儲存結果。
5. 前端將回傳結果顯示於 `ResultPanel`。

**上游/下游關係：**

- **上游**：UI form state（輸入值、選單、時間）
- **下游**：API route 回傳結果（mock data）
- UI 對 API 是「下游依賴」：API 回傳資料格式有變，UI 也要同步調整

---

## 其他流程

### 登入頁 `/login`

- `app/login/page.tsx` 呼叫 `POST /api/login`。
- `app/api/login/route.ts` 以固定帳密判斷，回傳 token 與 user。

### 用戶查詢 `/users`

- `app/users/page.tsx` 呼叫 `GET /api/users/:id`。
- `app/api/users/[id]/route.ts` 依 params.id 回傳 mock 使用者資訊。

---

## BFF 的角色

這裡的 BFF（Backend For Frontend）並不是獨立服務，而是 **Next.js API Routes**。

好處：

- 前端可以用同一個 repo 模擬後端行為。
- 適合教學與快速驗證需求。
- 真實後端上線後，只要替換 API 內容即可。

