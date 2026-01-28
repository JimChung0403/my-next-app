"use client";

import { useState } from "react";
import PageShell from "../components/PageShell";
import { CardShell, Field, ResultPanel, SubmitButton } from "../components/ui";

type ApiResult = {
  ok: boolean;
  message: string;
  data?: unknown;
};

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  function validate() {
    const nextErrors: {
      name?: string;
      email?: string;
      password?: string;
    } = {};
    if (name.trim().length < 2) nextErrors.name = "姓名至少 2 個字";
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
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
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
      title="註冊帳號"
      subtitle="輸入姓名、Email、密碼建立假帳號，立即取得 ID。"
      badge="Register"
    >
      <CardShell
        badge="Register"
        badgeTone="amber"
        title="註冊表單"
        description="簡易驗證後送出並回傳假資料。"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field
            label="Name"
            value={name}
            onChange={setName}
            placeholder="Celia Chen"
            tone="amber"
            required
            error={errors.name}
          />
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="celia@bff.app"
            tone="amber"
            required
            error={errors.email}
          />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="至少 8 碼"
            tone="amber"
            required
            error={errors.password}
          />
          <SubmitButton label="註冊" tone="amber" loading={loading} />
        </form>
        <ResultPanel title="Register Result" result={result} />
      </CardShell>
    </PageShell>
  );
}
