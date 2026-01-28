"use client";

import { ReactNode } from "react";

type FieldProps = {
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  tone?: "cyan" | "amber" | "emerald";
  error?: string;
  required?: boolean;
};

const toneMap = {
  cyan: "focus:border-cyan-400 focus:ring-cyan-500/40",
  amber: "focus:border-amber-400 focus:ring-amber-400/40",
  emerald: "focus:border-emerald-400 focus:ring-emerald-400/40",
};

export function Field({
  label,
  type = "text",
  value,
  placeholder,
  onChange,
  tone = "cyan",
  error,
  required = false,
}: FieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-slate-300">
      <span className="flex items-center justify-between">
        {label}
        {required && <span className="text-[11px] text-slate-500">必填</span>}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className={`rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 ${toneMap[tone]}`}
        placeholder={placeholder}
      />
      {error ? <span className="text-xs text-rose-300">{error}</span> : null}
    </label>
  );
}

export function SubmitButton({
  label,
  tone,
  loading,
}: {
  label: string;
  tone: "cyan" | "amber" | "emerald";
  loading: boolean;
}) {
  const toneClass =
    tone === "cyan"
      ? "bg-cyan-500 text-slate-900 hover:bg-cyan-400"
      : tone === "amber"
      ? "bg-amber-400 text-slate-900 hover:bg-amber-300"
      : "bg-emerald-400 text-slate-900 hover:bg-emerald-300";

  return (
    <button
      type="submit"
      disabled={loading}
      className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${toneClass} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {loading ? "處理中..." : label}
    </button>
  );
}

export function ResultPanel({
  title,
  result,
}: {
  title: string;
  result: unknown | null;
}) {
  if (!result) return null;

  return (
    <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-300">
      <p className="mb-2 text-[11px] uppercase tracking-[0.3em] text-slate-500">
        {title}
      </p>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}

export function CardShell({
  badge,
  badgeTone,
  title,
  description,
  children,
}: {
  badge: string;
  badgeTone: "cyan" | "amber" | "emerald";
  title: string;
  description: string;
  children: ReactNode;
}) {
  const badgeClass =
    badgeTone === "cyan"
      ? "text-cyan-300"
      : badgeTone === "amber"
      ? "text-amber-300"
      : "text-emerald-300";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.8)] backdrop-blur animate-rise">
      <div className="mb-6">
        <p className={`text-xs uppercase tracking-[0.35em] ${badgeClass}`}>
          {badge}
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-white">{title}</h2>
        <p className="mt-2 text-sm text-slate-400">{description}</p>
      </div>
      {children}
    </div>
  );
}
