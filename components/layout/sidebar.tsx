"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Building2,
  Eye,
  LayoutDashboard,
  ShieldCheck,
  TicketCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { AcademyShellUser } from "./app-shell";

type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const navigationGroups: Array<{
  label: string;
  items: NavigationItem[];
}> = [
  {
    label: "Command",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Train",
    items: [
      { label: "Training City", href: "/city", icon: Building2 },
      { label: "Learning Path", href: "/learn", icon: BookOpen },
    ],
  },
  {
    label: "Prove",
    items: [{ label: "Ticket Queue", href: "/tickets", icon: TicketCheck }],
  },
  {
    label: "Account",
    items: [{ label: "Profile", href: "/profile", icon: UserRound }],
  },
];

const mobileItems = navigationGroups.flatMap((group) => group.items);

export function Sidebar({ user }: { user: AcademyShellUser }) {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-yellow-500/20 bg-[linear-gradient(180deg,rgba(12,11,7,0.98),rgba(2,2,2,0.99))] p-4 backdrop-blur xl:flex">
        <Link href="/dashboard" className="flex items-center gap-3 border-b border-yellow-500/15 px-1 pb-5 pt-1">
          <span className="relative flex h-14 w-14 shrink-0 items-center justify-center border border-yellow-400/45 bg-yellow-400/[0.04] text-yellow-400 shadow-[0_0_24px_rgba(227,170,34,0.12)] [clip-path:polygon(50%_0%,92%_22%,92%_75%,50%_100%,8%_75%,8%_22%)]">
            <Eye className="h-8 w-8" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-2xl font-black tracking-[0.04em] text-white">
              OSIRIS
            </span>
            <span className="block font-mono text-[0.62rem] font-black uppercase tracking-[0.12em] text-yellow-400">
              Cyber Academy
            </span>
          </span>
        </Link>

        <p className="mt-3 px-1 font-mono text-[0.52rem] font-bold uppercase tracking-[0.18em] text-zinc-600">
          Learn · Practice · Defend · Advance
        </p>

        <div className="mt-4 border border-yellow-500/20 bg-black/80 p-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center border border-yellow-400/30 bg-yellow-400/10 text-yellow-400">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-mono text-[0.58rem] font-black uppercase tracking-[0.12em] text-zinc-600">
                Current role
              </p>
              <p className="mt-0.5 truncate text-xs font-black text-yellow-400">
                {user.roleName}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-yellow-500/10 pt-2.5 font-mono text-[0.65rem]">
            <span className="font-bold text-zinc-600">LEVEL {user.roleLevel}</span>
            <span className="font-black text-white">{user.points.toLocaleString()} XP</span>
          </div>
        </div>

        <nav className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1">
          {navigationGroups.map((group) => (
            <div key={group.label}>
              <p className="px-2 font-mono text-[0.54rem] font-black uppercase tracking-[0.18em] text-zinc-700">
                {group.label}
              </p>
              <div className="mt-1.5 space-y-0.5">
                {group.items.map((item) => {
                  const ItemIcon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative flex items-center gap-3 border px-2.5 py-2 text-xs font-bold transition ${
                        active
                          ? "border-yellow-400/30 bg-[linear-gradient(90deg,rgba(227,170,34,0.16),rgba(227,170,34,0.035))] text-yellow-400 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-yellow-400"
                          : "border-transparent text-zinc-500 hover:border-yellow-500/15 hover:bg-yellow-400/[0.035] hover:text-zinc-200"
                      }`}
                    >
                      <ItemIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-3 border border-green-500/15 bg-green-500/5 p-2.5">
          <p className="flex items-center gap-2 font-mono text-[0.58rem] font-bold uppercase tracking-[0.08em] text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
            Environment online
          </p>
        </div>
      </aside>

      <header className="sticky top-0 z-40 border-b border-yellow-500/20 bg-black/95 px-3 py-3 backdrop-blur xl:hidden">
        <div className="flex items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center border border-yellow-400/40 text-yellow-400 [clip-path:polygon(50%_0%,92%_22%,92%_75%,50%_100%,8%_75%,8%_22%)]">
              <Eye className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-black tracking-[0.08em] text-white">OSIRIS</span>
              <span className="block font-mono text-[0.5rem] font-black uppercase tracking-[0.1em] text-yellow-400">Cyber Academy</span>
            </span>
          </Link>
          <div className="text-right">
            <p className="max-w-36 truncate text-[0.65rem] font-bold text-white">{user.roleName}</p>
            <p className="font-mono text-[0.58rem] font-black text-yellow-400">
              {user.points} XP
            </p>
          </div>
        </div>
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {mobileItems.map((item) => {
            const ItemIcon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-10 shrink-0 items-center gap-2 border px-3 py-2 text-xs font-bold ${
                  active
                    ? "border-yellow-400/50 bg-yellow-400/15 text-yellow-400"
                    : "border-yellow-500/15 bg-black text-zinc-500"
                }`}
              >
                <ItemIcon className="h-3.5 w-3.5" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
    </>
  );
}
