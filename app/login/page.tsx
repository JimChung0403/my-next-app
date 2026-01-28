"use client";

import { useState } from "react";
import PageShell from "../components/PageShell";
import { CardShell, Field, ResultPanel, SubmitButton } from "../components/ui";

type ApiResult = {
  ok: boolean;
  message: string;
  data?: unknown;
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  function validate() {
    const nextErrors: { email?: string; password?: string } = {};
    if (!email.includes("@")) nextErrors.email = "請輸入正確的 Email";
    if (password.length < 8) nextErrors.password = "密碼至少 8 碼";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
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
      title="登入帳號"
      subtitle="固定帳號測試：demo@bff.app / password123。表單附帶即時驗證與載入狀態。"
      badge="Login"
    >
      <CardShell
        badge="Login"
        badgeTone="cyan"
        title="登入表單"
        description="驗證 Email、密碼格式後送出。"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="demo@bff.app"
            tone="cyan"
            required
            error={errors.email}
          />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="至少 8 碼"
            tone="cyan"
            required
            error={errors.password}
          />
          <SubmitButton label="登入" tone="cyan" loading={loading} />
        </form>
        <ResultPanel title="Login Result" result={result} />
      </CardShell>
    </PageShell>
  );
}
