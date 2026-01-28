import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-100">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2563eb33,transparent_60%),radial-gradient(circle_at_70%_20%,#22d3ee33,transparent_55%),radial-gradient(circle_at_bottom,#f59e0b33,transparent_55%)]" />
        <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#1f2937] blur-3xl opacity-50" />
        <main className="relative mx-auto flex max-w-5xl flex-col gap-10 px-6 pb-16 pt-20">
          <section className="flex flex-col gap-6 animate-fade">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-300">
              Next.js BFF Demo
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
              現代化登入 / 註冊 / 用戶查詢流程
            </h1>
            <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
              所有資料皆以 BFF 假資料回傳，專注於 UI 與流程展示。你可以從下方進入三個功能頁。
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-3 stagger">
            <Link
              href="/login"
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.8)] backdrop-blur transition hover:-translate-y-1 hover:border-cyan-400/60"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Login</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">登入</h2>
              <p className="mt-2 text-sm text-slate-400">
                測試固定帳號登入與 token 回傳。
              </p>
            </Link>
            <Link
              href="/register"
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.8)] backdrop-blur transition hover:-translate-y-1 hover:border-amber-300/60"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-amber-300">
                Register
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">註冊</h2>
              <p className="mt-2 text-sm text-slate-400">
                模擬建立新用戶並回傳假資料。
              </p>
            </Link>
            <Link
              href="/users"
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.8)] backdrop-blur transition hover:-translate-y-1 hover:border-emerald-300/60"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">
                Lookup
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">用戶查詢</h2>
              <p className="mt-2 text-sm text-slate-400">
                透過 ID 查詢用戶詳情。
              </p>
            </Link>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300 animate-rise">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                  API Endpoints
                </p>
                <p className="mt-2 text-base text-white">
                  /api/login · /api/register · /api/users/[id]
                </p>
              </div>
              <div className="rounded-full border border-slate-700 px-4 py-2 text-xs text-slate-400">
                All data mocked in BFF
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
