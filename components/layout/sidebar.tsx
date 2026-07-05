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
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-gray-800 bg-gray-950 p-6 text-white">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
          Osiris
        </p>
        <h1 className="mt-2 text-xl font-bold">Cyber Academy</h1>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-xl px-4 py-3 text-sm text-gray-300 hover:bg-cyan-950/40 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-cyan-900/60 bg-cyan-950/20 p-4">
        <p className="text-sm font-semibold">Student Mode</p>
        <p className="mt-1 text-xs text-gray-400">
          MVP build in progress
        </p>
      </div>
    </aside>
  );
}
