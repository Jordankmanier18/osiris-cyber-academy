import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { auth } from "@/auth";
import { LogoutButton } from "@/components/auth/logout-button";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Training Record | Osiris Cyber Academy",
  description: "Your role, XP, completed work, and promotion history.",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      role: true,
      submissions: {
        include: { mission: true },
        orderBy: { createdAt: "desc" },
      },
      progress: {
        where: { status: "completed" },
        include: {
          lesson: true,
          lab: true,
          ticket: true,
        },
        orderBy: { completedAt: "desc" },
      },
      cityProgress: {
        where: { status: "completed" },
        orderBy: { completedAt: "desc" },
      },
      ticketProgress: {
        include: { ticket: true },
        orderBy: { updatedAt: "desc" },
      },
      promotions: {
        orderBy: { promotedAt: "desc" },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const completedLessons = user.progress.filter((item) => item.lessonId);
  const passedTickets = user.ticketProgress.filter(
    (item) => item.status === "completed",
  );

  return (
    <div className="space-y-6 pb-10">
      <section className="relative overflow-hidden rounded-3xl border border-yellow-500/20 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.13),transparent_34%),linear-gradient(135deg,#18181b,#050505_62%)] p-6 shadow-2xl md:p-8">
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-yellow-400/25 bg-yellow-400/10 text-yellow-400">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="osiris-eyebrow">Permanent Academy Record</p>
            </div>
            <h1 className="mt-5 text-3xl font-black text-white md:text-5xl">
              {user.name ?? "Osiris Operative"}
            </h1>
            <p className="mt-3 text-sm font-bold text-zinc-500">{user.email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="osiris-badge">
              Level {user.role?.level ?? 1} · {user.role?.name ?? "Recruit"}
            </span>
            <LogoutButton />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <RecordStat
          label="Academy XP"
          value={user.points.toString()}
          icon={Sparkles}
        />
        <RecordStat
          label="Lessons passed"
          value={completedLessons.length.toString()}
          icon={BookOpen}
        />
        <RecordStat
          label="City missions"
          value={user.cityProgress.length.toString()}
          icon={Building2}
        />
        <RecordStat
          label="Capstones"
          value={passedTickets.length.toString()}
          icon={ClipboardCheck}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="osiris-panel p-6">
          <p className="osiris-eyebrow">Current role</p>
          <h2 className="mt-3 text-2xl font-black text-yellow-400">
            {user.role?.name ?? "No role assigned"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            {user.role?.description ??
              "Your account does not currently have a role track."}
          </p>
          {user.role?.framework ? (
            <div className="mt-5 rounded-2xl border border-yellow-500/15 bg-black p-4">
              <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-zinc-600">
                Framework
              </p>
              <p className="mt-2 text-sm font-black text-white">
                {user.role.framework}
              </p>
            </div>
          ) : null}
        </div>

        <div className="osiris-panel p-6">
          <div className="flex items-center gap-3">
            <Award className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            <div>
              <p className="osiris-eyebrow">Role history</p>
              <h2 className="mt-1 text-xl font-black text-white">
                Earned promotions
              </h2>
            </div>
          </div>
          {user.promotions.length === 0 ? (
            <p className="mt-5 rounded-2xl border border-dashed border-zinc-800 bg-black/40 p-5 text-sm leading-6 text-zinc-500">
              Complete the lessons, city defense, and capstone for your first
              promotion to appear here.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {user.promotions.map((promotion) => (
                <div
                  key={promotion.id}
                  className="flex items-start gap-3 rounded-2xl border border-green-500/15 bg-green-500/5 p-4"
                >
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-green-400"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-black text-white">
                      {formatRoleSlug(promotion.fromRoleSlug)} →{" "}
                      {formatRoleSlug(promotion.toRoleSlug)}
                    </p>
                    <p className="mt-1 text-xs font-bold text-zinc-500">
                      {promotion.promotedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="osiris-panel p-6">
        <p className="osiris-eyebrow">Evidence of work</p>
        <h2 className="mt-2 text-2xl font-black text-white">
          Recent completions
        </h2>
        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          {[
            ...completedLessons.slice(0, 4).map((item) => ({
              id: item.id,
              title: item.lesson?.title ?? "Completed lesson",
              type: "Lesson",
              detail: item.completedAt?.toLocaleDateString() ?? "Completed",
            })),
            ...passedTickets.slice(0, 3).map((item) => ({
              id: item.id,
              title: item.ticket.title,
              type: "Capstone ticket",
              detail: `${item.bestScore}% score`,
            })),
          ].map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="rounded-2xl border border-white/5 bg-black p-4"
            >
              <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-yellow-400">
                {item.type}
              </p>
              <p className="mt-2 font-black text-white">{item.title}</p>
              <p className="mt-2 text-xs font-bold text-zinc-600">
                {item.detail}
              </p>
            </div>
          ))}
          {completedLessons.length === 0 && passedTickets.length === 0 ? (
            <p className="text-sm text-zinc-500">
              Completed work will appear here as you progress.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

type RecordIcon = typeof BookOpen;

function RecordStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: RecordIcon;
}) {
  return (
    <div className="rounded-2xl border border-yellow-500/15 bg-zinc-950 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-zinc-600">
            {label}
          </p>
          <p className="mt-2 text-3xl font-black text-white">{value}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-400/10 text-yellow-400">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

function formatRoleSlug(roleSlug: string) {
  return roleSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
