"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CardShell,
  Field,
  ReadOnlyField,
  ResultPanel,
  SelectField,
  SubmitButton,
} from "./components/ui";

type OptionsPayload = {
  code: number;
  msg: string;
  data: {
    Feb: number[];
    Geometry: string[];
  };
};

type SavePayload = {
  code: number;
  msg: string;
  data: Record<string, unknown>;
};

const nowString = () =>
  new Date().toLocaleString("zh-TW", {
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

export default function MaintainTl5Page() {
  const [fieldA, setFieldA] = useState("");
  const [fieldB, setFieldB] = useState("");
  const [createTime, setCreateTime] = useState(() => nowString());
  const [updateTime, setUpdateTime] = useState(() => nowString());
  const [feb, setFeb] = useState("");
  const [geometry, setGeometry] = useState("");
  const [options, setOptions] = useState<OptionsPayload["data"]>({
    Feb: [],
    Geometry: [],
  });
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [result, setResult] = useState<SavePayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timestamp = nowString();
    setCreateTime(timestamp);
    setUpdateTime(timestamp);
  }, []);

  useEffect(() => {
    let active = true;
    async function fetchOptions() {
      setLoadingOptions(true);
      try {
        const response = await fetch("/api/maintain/options");
        if (!response.ok) {
          throw new Error(`Options error: ${response.status}`);
        }
        const data = (await response.json()) as OptionsPayload;
        if (active) {
          setOptions(data.data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "無法載入下拉選單資料"
          );
        }
      } finally {
        if (active) {
          setLoadingOptions(false);
        }
      }
    }

    fetchOptions();
    return () => {
      active = false;
    };
  }, []);

  const validation = useMemo(() => {
    return {
      fieldA: fieldA ? "" : "A 必填",
      fieldB: fieldB ? "" : "B 必填",
    };
  }, [fieldA, fieldB]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);

    if (!fieldA || !fieldB) {
      setError("請完成必填欄位 A 與 B");
      return;
    }
    if (!feb || !geometry) {
      setError("請選擇 Feb 與 Geometry");
      return;
    }

    const timestamp = nowString();
    setUpdateTime(timestamp);
    setLoadingSubmit(true);

    try {
      const response = await fetch("/api/maintain/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          A: fieldA,
          B: fieldB,
          CreateTime: createTime,
          UpdateTime: timestamp,
          Feb: feb,
          Geometry: geometry,
        }),
      });
      if (!response.ok) {
        throw new Error(`Save error: ${response.status}`);
      }
      const data = (await response.json()) as SavePayload;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "送出失敗");
    } finally {
      setLoadingSubmit(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#bae6fd88,transparent_60%),radial-gradient(circle_at_70%_10%,#bbf7d055,transparent_55%),radial-gradient(circle_at_bottom,#fed7aa77,transparent_55%)]" />
        <div className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-white blur-3xl opacity-70" />
        <main className="relative mx-auto flex max-w-4xl flex-col gap-10 px-6 pb-16 pt-16">
          <section className="flex flex-col gap-4 animate-fade">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Maintain TL5
            </p>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              建制維護表單 · Next.js BFF
            </h1>
            <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
              表單欄位含 A、B、時間欄位與動態下拉選單，透過 Next.js BFF
              API 模擬儲存資料。
            </p>
          </section>

          <CardShell
            badge="BFF Form"
            badgeTone="cyan"
            title="Maintain TL5 Function"
            description="必填 A/B、時間欄位預設瀏覽器時間，Feb 與 Geometry 從 API 取得。"
          >
            <form className="grid gap-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="A"
                  value={fieldA}
                  required
                  tone="cyan"
                  placeholder="輸入 A"
                  error={validation.fieldA}
                  onChange={(value) => setFieldA(value)}
                />
                <Field
                  label="B"
                  value={fieldB}
                  required
                  tone="cyan"
                  placeholder="輸入 B"
                  error={validation.fieldB}
                  onChange={(value) => setFieldB(value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <ReadOnlyField
                  label="Create Time"
                  value={createTime}
                  tone="emerald"
                />
                <ReadOnlyField
                  label="Update Time"
                  value={updateTime}
                  tone="emerald"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <SelectField
                  label="Feb"
                  value={feb}
                  required
                  loading={loadingOptions}
                  options={options.Feb}
                  tone="amber"
                  onChange={(value) => setFeb(value)}
                />
                <SelectField
                  label="Geometry"
                  value={geometry}
                  required
                  loading={loadingOptions}
                  options={options.Geometry}
                  tone="amber"
                  onChange={(value) => setGeometry(value)}
                />
              </div>

              {error ? (
                <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  送出後將回傳 mock 資料並顯示於下方。
                </p>
                <SubmitButton
                  label="送出"
                  tone="cyan"
                  loading={loadingSubmit}
                />
              </div>
            </form>
            <ResultPanel title="Save Result" result={result} />
          </CardShell>
        </main>
      </div>
    </div>
  );
}
