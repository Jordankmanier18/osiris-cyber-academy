import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <section className="max-w-4xl text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400 mb-4">
          Osiris Cyber Academy
        </p>

        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Train like a real cyber professional.
        </h1>

        <p className="text-lg text-slate-300 mb-8">
          Learn cybersecurity through missions, labs, tickets, dashboards, and
          hands-on simulations built to prepare students for real-world work.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
          >
            Enter Dashboard
          </Link>

          <Link
            href="/learn"
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-white hover:bg-slate-900"
          >
            Start Learning
          </Link>
        </div>
      </section>
    </main>
  );
}