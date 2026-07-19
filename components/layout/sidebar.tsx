"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Building2,
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
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-yellow-500/15 bg-zinc-950/95 p-5 backdrop-blur xl:flex">
        <Link href="/dashboard" className="rounded-2xl px-2 py-2">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-yellow-400">
            Osiris
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white">
            Cyber Academy
          </h1>
        </Link>

        <div className="mt-5 rounded-2xl border border-yellow-500/20 bg-black p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-black">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-white">
                {user.name}
              </p>
              <p className="truncate text-xs font-bold text-yellow-400">
                Level {user.roleLevel} · {user.roleName}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-yellow-500/10 pt-3 text-xs">
            <span className="text-zinc-500">Academy XP</span>
            <span className="font-black text-white">{user.points}</span>
          </div>
        </div>

        <nav className="mt-6 flex-1 space-y-5 overflow-y-auto pr-1">
          {navigationGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 text-[0.65rem] font-black uppercase tracking-[0.2em] text-zinc-600">
                {group.label}
              </p>
              <div className="mt-2 space-y-1">
                {group.items.map((item) => {
                  const ItemIcon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-bold transition ${
                        active
                          ? "border-yellow-400/35 bg-yellow-400/10 text-yellow-400"
                          : "border-transparent text-zinc-400 hover:border-yellow-500/20 hover:bg-white/[0.03] hover:text-white"
                      }`}
                    >
                      <ItemIcon className="h-4 w-4" aria-hidden="true" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-4 rounded-2xl border border-green-500/15 bg-green-500/5 p-3">
          <p className="flex items-center gap-2 text-xs font-bold text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
            Training environment online
          </p>
        </div>
      </aside>

      <header className="sticky top-0 z-40 border-b border-yellow-500/15 bg-black/90 px-4 py-3 backdrop-blur xl:hidden">
        <div className="flex items-center justify-between gap-4">
          <Link href="/dashboard">
            <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-yellow-400">
              Osiris
            </p>
            <p className="font-black text-white">Cyber Academy</p>
          </Link>
          <div className="text-right">
            <p className="text-xs font-bold text-white">{user.roleName}</p>
            <p className="text-[0.65rem] font-black text-yellow-400">
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
                className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold ${
                  active
                    ? "border-yellow-400 bg-yellow-400 text-black"
                    : "border-yellow-500/15 bg-zinc-950 text-zinc-400"
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
