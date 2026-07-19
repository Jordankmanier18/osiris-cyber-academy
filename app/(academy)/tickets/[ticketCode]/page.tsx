import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  FileWarning,
  ShieldCheck,
} from "lucide-react";
import { auth } from "@/auth";
import { CapstoneTicketForm } from "@/components/tickets/capstone-ticket-form";
import { getCapstoneByCode } from "@/lib/capstone-tickets";
import { prisma } from "@/lib/prisma";
import { getPromotionStatusForRole } from "@/lib/progression";

export const metadata: Metadata = {
  title: "Capstone Ticket | Osiris Cyber Academy",
  description: "Complete a promotion capstone ticket.",
};

export default async function TicketWorkbenchPage({
  params,
}: {
  params: Promise<{ ticketCode: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { ticketCode } = await params;
  const definition = getCapstoneByCode(ticketCode);

  if (!definition) {
    notFound();
  }

  const [ticket, user, status, promotion] = await Promise.all([
    prisma.ticket.findUnique({
      where: { ticketCode },
      include: {
        role: {
          select: {
            name: true,
            slug: true,
            level: true,
            framework: true,
          },
        },
        work: {
          where: { userId: session.user.id },
          take: 1,
        },
      },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        role: {
          select: {
            slug: true,
            level: true,
          },
        },
      },
    }),
    getPromotionStatusForRole(session.user.id, definition.roleSlug),
    prisma.rolePromotion.findUnique({
      where: {
        userId_fromRoleSlug: {
          userId: session.user.id,
          fromRoleSlug: definition.roleSlug,
        },
      },
      select: {
        toRoleSlug: true,
      },
    }),
  ]);

  if (!ticket || !user?.role || user.role.level < ticket.role.level) {
    notFound();
  }

  const ticketProgress = ticket.work[0];
  const isCurrentRole = user.role.slug === definition.roleSlug;
  const initialCompleted = ticketProgress?.status === "completed";
  const canSubmit =
    isCurrentRole && Boolean(status?.capstone.ready) && !initialCompleted;
  const lockedReason = !isCurrentRole
    ? initialCompleted
      ? null
      : "This capstone belongs to a previous role and cannot be submitted from your current clearance."
    : !status?.lessons.complete
      ? `Complete ${status?.lessons.missingSlugs.length ?? 0} remaining role lesson${status?.lessons.missingSlugs.length === 1 ? "" : "s"}.`
      : !status.city.complete
        ? "Complete and document the Open SSH Door mission in Training City."
        : null;
  const promotedRole = promotion
    ? await prisma.role.findUnique({
        where: { slug: promotion.toRoleSlug },
        select: { name: true },
      })
    : null;

  return (
    <div className="space-y-6 pb-10">
      <Link
        href="/tickets"
        className="inline-flex items-center gap-2 text-sm font-bold text-yellow-400 hover:text-yellow-300"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to ticket queue
      </Link>

      <section className="relative overflow-hidden rounded-3xl border border-yellow-500/20 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.12),transparent_34%),linear-gradient(135deg,#18181b,#050505_62%)] p-6 shadow-2xl md:p-8">
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="osiris-badge">Promotion capstone</span>
              <span className="osiris-badge-dark">{ticket.ticketCode}</span>
              <span className="osiris-badge-dark">
                Priority · {ticket.priority}
              </span>
            </div>
            <h1 className="mt-5 text-3xl font-black text-white md:text-5xl">
              {ticket.title}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400 md:text-base">
              {ticket.scenario}
            </p>
          </div>
          <div className="rounded-2xl border border-yellow-500/20 bg-black/70 p-5">
            <p className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-zinc-600">
              Promotion path
            </p>
            <p className="mt-2 text-xl font-black text-yellow-400">
              {ticket.role.name} → {status?.nextRole?.name ?? "Next role"}
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 text-sm">
              <span className="text-zinc-500">Reward</span>
              <span className="font-black text-white">
                {ticket.xpReward} XP
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-zinc-500">Passing score</span>
              <span className="font-black text-white">
                {definition.passingScore}%
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="osiris-card">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-400/25 bg-yellow-400/10 text-yellow-400">
              <FileWarning className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="osiris-eyebrow">Evidence</p>
              <h2 className="mt-1 font-black text-white">What you observed</h2>
            </div>
          </div>
          <pre className="mt-5 whitespace-pre-wrap rounded-2xl border border-white/5 bg-black p-4 font-mono text-xs leading-6 text-zinc-400">
            {ticket.evidence}
          </pre>
        </div>

        <div className="osiris-card">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-400/25 bg-yellow-400/10 text-yellow-400">
              <ClipboardList className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="osiris-eyebrow">Required action</p>
              <h2 className="mt-1 font-black text-white">Your assignment</h2>
            </div>
          </div>
          <p className="mt-5 text-sm leading-7 text-zinc-400">
            {ticket.requiredAction}
          </p>
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-green-500/15 bg-green-500/5 p-4">
            <CheckCircle2
              className="mt-0.5 h-5 w-5 shrink-0 text-green-400"
              aria-hidden="true"
            />
            <p className="text-xs leading-6 text-zinc-400">
              Your score is calculated from risk interpretation, remediation
              controls, validation steps, and the clarity of your closure note.
            </p>
          </div>
        </div>
      </section>

      <section className="flex items-center gap-3 rounded-2xl border border-yellow-500/15 bg-zinc-950 p-4">
        <ShieldCheck
          className="h-5 w-5 shrink-0 text-yellow-400"
          aria-hidden="true"
        />
        <p className="text-sm leading-6 text-zinc-400">
          This is a simulated academy evaluation. Scoring is based on a fixed,
          transparent rubric—not a live manager or production system.
        </p>
      </section>

      <CapstoneTicketForm
        definition={definition}
        canSubmit={canSubmit}
        lockedReason={lockedReason}
        initialCompleted={initialCompleted}
        previousScore={ticketProgress?.bestScore ?? 0}
        promotedToName={promotedRole?.name ?? null}
      />
    </div>
  );
}
