import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const [profiles, courses, missions, labs, tickets] = await Promise.all([
    prisma.profile.findMany({
      orderBy: {
        xp: "desc",
      },
      take: 5,
    }),
    prisma.course.findMany({
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    }),
    prisma.mission.findMany(),
    prisma.lab.findMany(),
    prisma.ticket.findMany({
      orderBy: {
        ticketCode: "asc",
      },
    }),
  ]);

  const totalLessons = courses.reduce((total, course) => {
    return (
      total +
      course.modules.reduce((moduleTotal, module) => {
        return moduleTotal + module.lessons.length;
      }, 0)
    );
  }, 0);

  const openTickets = tickets.filter((ticket) => ticket.status === "OPEN").length;
  const readyLabs = labs.filter((lab) => lab.status === "READY").length;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <section className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
          Osiris Cyber Academy
        </p>
        <h1 className="mt-3 text-4xl font-bold">Student Command Center</h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          Track courses, missions, labs, help desk tickets, and student progress
          from one central training dashboard.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <DashboardCard title="Courses" value={courses.length} href="/learn" />
        <DashboardCard title="Lessons" value={totalLessons} href="/learn" />
        <DashboardCard title="Missions" value={missions.length} href="/missions" />
        <DashboardCard title="Ready Labs" value={readyLabs} href="/labs" />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Active Tickets</h2>
            <Link href="/tickets" className="text-sm text-cyan-400">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {tickets.slice(0, 4).map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold">{ticket.title}</p>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs">
                    {ticket.priority}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-400">{ticket.ticketCode}</p>
                <p className="mt-2 text-sm text-slate-300">{ticket.description}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-slate-400">
            Open tickets: {openTickets}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Leaderboard</h2>
            <Link href="/leaderboard" className="text-sm text-cyan-400">
              View leaderboard
            </Link>
          </div>

          <div className="space-y-3">
            {profiles.map((profile, index) => (
              <div
                key={profile.id}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <div>
                  <p className="font-semibold">
                    #{index + 1} {profile.fullName}
                  </p>
                  <p className="text-sm text-slate-400">{profile.role}</p>
                </div>
                <p className="font-bold text-cyan-400">{profile.xp} XP</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function DashboardCard({
  title,
  value,
  href,
}: {
  title: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5 hover:border-cyan-400"
    >
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-4xl font-bold">{value}</p>
    </Link>
  );
}
