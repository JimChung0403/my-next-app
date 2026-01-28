import Link from "next/link";

export default function PageShell({
  title,
  subtitle,
  badge,
  children,
}: {
  title: string;
  subtitle: string;
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-100">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2563eb33,transparent_60%),radial-gradient(circle_at_70%_20%,#22d3ee33,transparent_55%),radial-gradient(circle_at_bottom,#f59e0b33,transparent_55%)]" />
        <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#1f2937] blur-3xl opacity-50" />
        <main className="relative mx-auto flex max-w-3xl flex-col gap-10 px-6 pb-16 pt-16">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <Link
              href="/"
              className="rounded-full border border-slate-800 px-4 py-2 transition hover:border-slate-500"
            >
              返回首頁
            </Link>
            <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
              {badge}
            </span>
          </div>

          <section className="flex flex-col gap-4 animate-fade">
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">
              {title}
            </h1>
            <p className="text-base text-slate-300 sm:text-lg">{subtitle}</p>
          </section>

          <section className="stagger">{children}</section>
        </main>
      </div>
    </div>
  );
}
