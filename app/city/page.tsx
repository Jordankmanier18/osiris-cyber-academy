import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Headphones,
  Landmark,
  LockKeyhole,
  Network,
  RadioTower,
  ShieldCheck,
  Siren,
} from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Mission Training City | Osiris Cyber Academy",
  description:
    "Explore the role-based districts of Osiris Mission Training City.",
};

const districts = [
  {
    name: "Orientation Center",
    callSign: "District 01",
    description:
      "Begin your academy briefing, learn the training system, and establish your cyber foundations.",
    requiredRole: "Cyber Cadet",
    requiredLevel: 1,
    href: "/learn",
    action: "Begin orientation",
    icon: Landmark,
    position:
      "lg:col-span-2 lg:col-start-3 lg:row-start-1",
  },
  {
    name: "Help Desk Office",
    callSign: "District 02",
    description:
      "Respond to user issues, document incidents, and practice structured technical support workflows.",
    requiredRole: "IT Support Trainee",
    requiredLevel: 2,
    href: "/tickets",
    action: "Open the ticket queue",
    icon: Headphones,
    position:
      "lg:col-span-2 lg:col-start-1 lg:row-start-2",
  },
  {
    name: "DNS Tower",
    callSign: "District 03",
    description:
      "Trace connectivity, inspect name resolution, and build practical network troubleshooting skills.",
    requiredRole: "Network Support Trainee",
    requiredLevel: 3,
    href: "/labs",
    action: "Access network labs",
    icon: RadioTower,
    position:
      "lg:col-span-2 lg:col-start-5 lg:row-start-2",
  },
  {
    name: "Security Awareness Office",
    callSign: "District 04",
    description:
      "Investigate threats, strengthen human defenses, and practice foundational security decisions.",
    requiredRole: "Security Trainee",
    requiredLevel: 4,
    href: "/missions",
    action: "Review security missions",
    icon: ShieldCheck,
    position:
      "lg:col-span-2 lg:col-start-2 lg:row-start-3",
  },
  {
    name: "SOC Police Station",
    callSign: "District 05",
    description:
      "Triage alerts, examine evidence, and coordinate the city’s defensive response operations.",
    requiredRole: "Junior Security Analyst",
    requiredLevel: 5,
    href: "/missions",
    action: "Enter SOC operations",
    icon: Siren,
    position:
      "lg:col-span-2 lg:col-start-4 lg:row-start-3",
  },
] as const;

export default async function CityPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      name: true,
      points: true,
      role: {
        select: {
          name: true,
          level: true,
          description: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const currentRoleLevel = user.role?.level ?? 0;
  const unlockedDistricts = districts.filter(
    (district) => currentRoleLevel >= district.requiredLevel,
  );
  const nextDistrict = districts.find(
    (district) => currentRoleLevel < district.requiredLevel,
  );

  return (
    <div className="space-y-8 pb-10">
      <section className="osiris-panel relative overflow-hidden p-6 md:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(250,204,21,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(250,204,21,0.08) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-400/30 bg-yellow-400/10 text-yellow-400">
                <Building2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="osiris-eyebrow">Interactive Training Zone</p>
            </div>

            <h1 className="osiris-title mt-5">Mission Training City</h1>
            <p className="mt-4 max-w-2xl osiris-subtitle">
              Every role grants a new level of city clearance. Enter unlocked
              districts to train through real-world lessons, tickets, labs, and
              missions.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[34rem]">
            <div className="rounded-2xl border border-yellow-500/20 bg-black/80 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                Operative
              </p>
              <p className="mt-2 truncate font-bold text-white">
                {user.name ?? session.user.email ?? "Academy Recruit"}
              </p>
            </div>
            <div className="rounded-2xl border border-yellow-500/20 bg-black/80 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                Clearance
              </p>
              <p className="mt-2 font-bold text-yellow-400">
                {user.role?.name ?? "Role unassigned"}
              </p>
            </div>
            <div className="rounded-2xl border border-yellow-500/20 bg-black/80 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                City Access
              </p>
              <p className="mt-2 font-bold text-white">
                {unlockedDistricts.length}/{districts.length} districts
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="relative overflow-hidden rounded-[2rem] border border-yellow-500/20 bg-zinc-950 p-5 shadow-2xl shadow-black/50 md:p-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(30deg, rgba(250,204,21,0.06) 12%, transparent 12.5%, transparent 87%, rgba(250,204,21,0.06) 87.5%), linear-gradient(150deg, rgba(250,204,21,0.06) 12%, transparent 12.5%, transparent 87%, rgba(250,204,21,0.06) 87.5%)",
              backgroundSize: "72px 126px",
            }}
          />

          <div className="relative z-10 mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="osiris-eyebrow">City Grid // OSR-01</p>
              <h2 className="mt-2 text-2xl font-black text-white">
                District Map
              </h2>
            </div>
            <div className="flex items-center gap-4 rounded-full border border-yellow-500/20 bg-black/80 px-4 py-2 text-xs font-bold uppercase tracking-wider">
              <span className="flex items-center gap-2 text-green-400">
                <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.9)]" />
                Open
              </span>
              <span className="flex items-center gap-2 text-zinc-500">
                <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
                Locked
              </span>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-[15%] top-[35%] hidden h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent lg:block" />
          <div className="pointer-events-none absolute inset-x-[19%] top-[68%] hidden h-px -rotate-6 bg-gradient-to-r from-transparent via-yellow-400/25 to-transparent lg:block" />
          <div className="pointer-events-none absolute bottom-[17%] left-1/2 top-[21%] hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-yellow-400/30 to-transparent lg:block" />

          <div className="relative z-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-6 lg:grid-rows-3">
            {districts.map((district) => {
              const isUnlocked = currentRoleLevel >= district.requiredLevel;
              const DistrictIcon = district.icon;

              return (
                <article
                  key={district.name}
                  className={`${district.position} group relative flex min-h-64 flex-col overflow-hidden rounded-3xl border p-5 transition duration-200 ${
                    isUnlocked
                      ? "border-yellow-400/35 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black shadow-[0_20px_55px_rgba(0,0,0,0.45)] hover:-translate-y-1 hover:border-yellow-400/70"
                      : "border-white/10 bg-black/80 text-zinc-500"
                  }`}
                >
                  <div
                    className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl ${
                      isUnlocked ? "bg-yellow-400/10" : "bg-zinc-800/20"
                    }`}
                  />

                  <div className="relative flex items-start justify-between gap-4">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                        isUnlocked
                          ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-400"
                          : "border-zinc-800 bg-zinc-900/80 text-zinc-600"
                      }`}
                    >
                      <DistrictIcon className="h-6 w-6" aria-hidden="true" />
                    </span>

                    {isUnlocked ? (
                      <span className="flex items-center gap-1.5 rounded-full border border-green-400/20 bg-green-400/10 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wider text-green-400">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Unlocked
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wider text-zinc-500">
                        <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
                        Level {district.requiredLevel}
                      </span>
                    )}
                  </div>

                  <div className="relative mt-5 flex flex-1 flex-col">
                    <p
                      className={`text-[0.65rem] font-black uppercase tracking-[0.22em] ${
                        isUnlocked ? "text-yellow-400" : "text-zinc-600"
                      }`}
                    >
                      {district.callSign}
                    </p>
                    <h3
                      className={`mt-2 text-xl font-black ${
                        isUnlocked ? "text-white" : "text-zinc-500"
                      }`}
                    >
                      {district.name}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-500">
                      {district.description}
                    </p>

                    <div className="mt-auto pt-5">
                      {isUnlocked ? (
                        <Link
                          href={district.href}
                          className="flex items-center justify-between rounded-xl border border-yellow-400/25 bg-yellow-400/10 px-4 py-3 text-sm font-black text-yellow-400 transition hover:border-yellow-400/50 hover:bg-yellow-400 hover:text-black"
                        >
                          {district.action}
                          <ArrowRight
                            className="h-4 w-4 transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </Link>
                      ) : (
                        <div className="flex items-center gap-2 border-t border-white/5 pt-4 text-xs font-bold text-zinc-600">
                          <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                          Requires {district.requiredRole}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="osiris-card">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-black">
                <Network className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Access Profile
                </p>
                <p className="font-black text-white">Level {currentRoleLevel}</p>
              </div>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-zinc-900">
              <div
                className="h-full rounded-full bg-yellow-400"
                style={{
                  width: `${Math.min(
                    (unlockedDistricts.length / districts.length) * 100,
                    100,
                  )}%`,
                }}
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              {user.role?.description ??
                "Your academy role has not been assigned. Contact an administrator to receive city clearance."}
            </p>
            <div className="mt-5 flex items-center justify-between border-t border-yellow-500/10 pt-4 text-sm">
              <span className="text-zinc-500">Academy XP</span>
              <span className="font-black text-yellow-400">{user.points} XP</span>
            </div>
          </div>

          <div className="rounded-3xl border border-yellow-500/20 bg-gradient-to-b from-yellow-400/10 to-zinc-950 p-6">
            <p className="osiris-eyebrow">Next Deployment</p>
            {nextDistrict ? (
              <>
                <h2 className="mt-3 text-xl font-black text-white">
                  {nextDistrict.name}
                </h2>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Advance to {nextDistrict.requiredRole} to receive clearance
                  for this district.
                </p>
                <Link
                  href="/learn"
                  className="mt-5 flex items-center justify-between rounded-xl bg-yellow-400 px-4 py-3 text-sm font-black text-black transition hover:bg-yellow-300"
                >
                  Continue training
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </>
            ) : (
              <>
                <h2 className="mt-3 text-xl font-black text-white">
                  Full City Clearance
                </h2>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  All five districts are operational. Continue completing
                  missions to sharpen your defensive skills.
                </p>
                <Link
                  href="/missions"
                  className="mt-5 flex items-center justify-between rounded-xl bg-yellow-400 px-4 py-3 text-sm font-black text-black transition hover:bg-yellow-300"
                >
                  View active missions
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
