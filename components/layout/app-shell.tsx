import { Sidebar } from "./sidebar";
import Link from "next/link";
import { Bell, ChevronDown, ShieldCheck } from "lucide-react";

export type AcademyShellUser = {
  name: string;
  roleName: string;
  roleLevel: number;
  points: number;
};

export function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: AcademyShellUser;
}) {
  return (
    <div className="min-h-screen text-white">
      <Sidebar user={user} />

      <div className="xl:pl-60">
        <header className="sticky top-0 z-20 hidden h-16 items-center justify-between border-b border-yellow-500/15 bg-black/90 px-6 backdrop-blur-xl xl:flex">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center border border-yellow-400/30 bg-yellow-400/10 text-yellow-400">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="font-mono text-[0.62rem] font-black uppercase tracking-[0.22em] text-yellow-400">
                Osiris Operations
              </p>
              <p className="text-xs font-semibold text-zinc-500">
                Academy training environment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="font-mono text-[0.6rem] font-black uppercase tracking-[0.16em] text-zinc-600">
                Academy XP
              </p>
              <p className="font-mono text-sm font-black text-yellow-400">
                {user.points.toLocaleString()}
              </p>
            </div>
            <span className="h-7 w-px bg-yellow-500/15" />
            <span
              aria-hidden="true"
              className="relative flex h-9 w-9 items-center justify-center border border-yellow-500/15 bg-yellow-400/[0.03] text-zinc-500 transition hover:border-yellow-400/40 hover:text-yellow-400"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.9)]" />
            </span>
            <Link
              href="/profile"
              className="flex items-center gap-3 border-l border-yellow-500/15 pl-5"
            >
              <span className="flex h-9 w-9 items-center justify-center border border-yellow-400/30 bg-gradient-to-br from-yellow-400/20 to-black font-mono text-xs font-black text-yellow-400">
                {user.name.slice(0, 2).toUpperCase()}
              </span>
              <span>
                <span className="block max-w-44 truncate text-sm font-black text-white">
                  {user.name}
                </span>
                <span className="block max-w-44 truncate text-[0.65rem] font-semibold text-zinc-500">
                  Level {user.roleLevel} · {user.roleName}
                </span>
              </span>
              <ChevronDown className="h-4 w-4 text-zinc-600" aria-hidden="true" />
            </Link>
          </div>
        </header>

        <main>
          <div className="osiris-container px-3 py-4 sm:px-4 md:px-6 md:py-6 xl:px-5">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
