import Link from "next/link";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Learn", href: "/learn" },
  { label: "Missions", href: "/missions" },
  { label: "Labs", href: "/labs" },
  { label: "Tickets", href: "/tickets" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Admin", href: "/admin" },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-yellow-500/20 bg-zinc-950/95 p-6 text-white xl:block">
      <Link href="/dashboard" className="block">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-400">
          Osiris
        </p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-white">
          Cyber Academy
        </h1>
      </Link>

      <div className="mt-8 rounded-2xl border border-yellow-500/20 bg-black p-4">
        <p className="text-xs uppercase tracking-widest text-zinc-500">
          Current Path
        </p>
        <p className="mt-2 font-semibold text-yellow-400">
          Cyber Cadet Track
        </p>
        <p className="mt-1 text-xs leading-5 text-zinc-500">
          Progress through lessons, labs, missions, and tickets.
        </p>
      </div>

      <nav className="mt-8 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-xl border border-transparent px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:border-yellow-500/30 hover:bg-yellow-400/10 hover:text-yellow-400"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-yellow-500/20 bg-black p-4">
        <p className="text-xs uppercase tracking-widest text-zinc-500">
          System Status
        </p>
        <p className="mt-2 text-sm font-semibold text-green-400">
          Training Environment Online
        </p>
      </div>
    </aside>
  );
}