import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  LockKeyhole,
  TicketCheck,
} from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getPromotionStatus } from "@/lib/progression";

export const metadata: Metadata = {
  title: "Ticket Queue | Osiris Cyber Academy",
  description: "Work role-based academy and promotion tickets.",
};

export default async function TicketsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [user, promotionStatus] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        role: {
          select: {
            name: true,
            slug: true,
            level: true,
          },
        },
      },
    }),
    getPromotionStatus(session.user.id),
  ]);

  if (!user?.role) {
    redirect("/dashboard");
  }

  const tickets = await prisma.ticket.findMany({
    where: {
      role: {
        level: { lte: user.role.level },
      },
    },
    orderBy: [{ role: { level: "asc" } }, { ticketCode: "asc" }],
    include: {
      role: {
        select: { name: true, slug: true, level: true },
      },
      work: {
        where: { userId: session.user.id },
        take: 1,
      },
    },
  });
  const capstoneCode = promotionStatus?.capstone.ticketCode;
  const capstoneTicket = tickets.find(
    (ticket) => ticket.ticketCode === capstoneCode,
  );
  const practiceTickets = tickets.filter(
    (ticket) => ticket.ticketCode !== capstoneCode,
  );
  const capstoneState = promotionStatus?.capstone.complete
    ? "Passed"
    : promotionStatus?.capstone.ready
      ? "Ready"
      : "Locked";

  return (
    <div className="space-y-6 pb-10">
      <section className="osiris-panel p-6 md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-yellow-400/25 bg-yellow-400/10 text-yellow-400">
                <TicketCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="osiris-eyebrow">Academy Work Queue</p>
            </div>
            <h1 className="mt-4 text-3xl font-black text-white md:text-4xl">
              Tickets turn training into job practice
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
              Review evidence, choose an action, validate the outcome, and
              document the work as if another technician will read it next.
            </p>
          </div>
          <span className="osiris-badge-dark">
            Current queue · {user.role.name}
          </span>
        </div>
      </section>

      {capstoneTicket && promotionStatus?.definition ? (
        <section className="relative overflow-hidden rounded-3xl border border-yellow-400/35 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.18),transparent_35%),linear-gradient(135deg,#18181b,#050505_60%)] p-6 shadow-2xl md:p-8">
          <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="osiris-badge">Promotion capstone</span>
                <span className="osiris-badge-dark">
                  {capstoneTicket.ticketCode}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${
                    capstoneState === "Passed"
                      ? "bg-green-500/10 text-green-400"
                      : capstoneState === "Ready"
                        ? "bg-yellow-400 text-black"
                        : "bg-zinc-900 text-zinc-600"
                  }`}
                >
                  {capstoneState === "Passed" ? (
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : capstoneState === "Ready" ? (
                    <ClipboardCheck
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                  ) : (
                    <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {capstoneState}
                </span>
              </div>
              <h2 className="mt-5 text-3xl font-black text-white">
                {capstoneTicket.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
                {capstoneTicket.scenario}
              </p>
            </div>
            <div className="rounded-2xl border border-yellow-500/20 bg-black/70 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Lessons</span>
                <span className="font-black text-white">
                  {promotionStatus.lessons.completed}/
                  {promotionStatus.lessons.total}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-zinc-500">City defense</span>
                <span className="font-black text-white">
                  {promotionStatus.city.complete ? "Passed" : "Required"}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-zinc-500">Reward</span>
                <span className="font-black text-yellow-400">
                  {capstoneTicket.xpReward} XP
                </span>
              </div>
              <Link
                href={`/tickets/${capstoneTicket.ticketCode}`}
                className={`mt-5 flex items-center justify-center gap-2 ${
                  capstoneState === "Locked"
                    ? "osiris-button-secondary"
                    : "osiris-button"
                }`}
              >
                {capstoneState === "Passed"
                  ? "Review capstone"
                  : capstoneState === "Ready"
                    ? "Work capstone"
                    : "View requirements"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-3xl border border-dashed border-zinc-800 bg-black/30 p-6">
          <p className="font-black text-white">Next capstone in development</p>
          <p className="mt-2 text-sm text-zinc-500">
            Your current role curriculum is available, and its promotion ticket
            will be connected in the next content release.
          </p>
        </section>
      )}

      <section className="osiris-panel p-6 md:p-7">
        <div>
          <p className="osiris-eyebrow">Practice queue</p>
          <h2 className="mt-2 text-2xl font-black text-white">
            Workplace tickets
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            These existing scenarios are now organized by role. Interactive
            scoring will be added after the promotion capstones are complete.
          </p>
        </div>
        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          {practiceTickets.map((ticket) => (
            <article
              key={ticket.id}
              className="rounded-2xl border border-white/5 bg-black p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-400">
                    {ticket.ticketCode}
                  </p>
                  <h3 className="mt-2 font-black text-white">{ticket.title}</h3>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-zinc-900 px-3 py-1 text-xs font-bold text-zinc-500">
                  <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                  Practice
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                {ticket.scenario}
              </p>
              <p className="mt-4 text-xs font-bold text-zinc-600">
                {ticket.role.name} · {ticket.priority} priority
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
