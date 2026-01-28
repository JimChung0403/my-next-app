"use client";

import { useState } from "react";
import PageShell from "../components/PageShell";
import { CardShell, Field, ResultPanel, SubmitButton } from "../components/ui";

type ApiResult = {
  ok: boolean;
  message: string;
  data?: unknown;
};

export default function UsersPage() {
  const [userId, setUserId] = useState("");
  const [result, setResult] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  function validate() {
    if (!userId.trim()) {
      setError("請輸入用戶 ID");
      return false;
    }
    if (!userId.startsWith("u-")) {
      setError("ID 需以 u- 開頭");
      return false;
    }
    setError(undefined);
    return true;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/users/${encodeURIComponent(userId.trim())}`
      );
      const data = (await response.json()) as ApiResult;
      setResult(data);
    } catch {
      setResult({ ok: false, message: "伺服器忙碌，請稍後再試" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell
      title="用戶查詢"
      subtitle="透過 ID 查詢用戶詳細資訊，支援假資料回傳。"
      badge="Lookup"
    >
      <CardShell
        badge="Lookup"
        badgeTone="emerald"
        title="用戶 ID 查詢"
        description="可用測試 ID：u-1024、u-2048、u-4096"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field
            label="User ID"
            value={userId}
            onChange={setUserId}
            placeholder="u-1024"
            tone="emerald"
            required
            error={error}
          />
          <SubmitButton label="查詢" tone="emerald" loading={loading} />
        </form>
        <ResultPanel title="Lookup Result" result={result} />
      </CardShell>
    </PageShell>
  );
}
