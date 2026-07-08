import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await prisma.user.findFirst({
    include: {
      currentRole: true,
    },
  });

  const roles = await prisma.role.findMany({
    orderBy: {
      level: "asc",
    },
    include: {
      lessons: true,
      labs: true,
      missions: true,
      tickets: true,
    },
  });

  const currentRole = user?.currentRole ?? roles[0];

  if (!currentRole) {
    return (
      <main className="min-h-screen bg-black p-8 text-white">
        <div className="rounded-2xl border border-yellow-500/30 bg-zinc-950 p-6">
          <h1 className="text-2xl font-bold text-yellow-400">Dashboard</h1>
          <p className="mt-2 text-zinc-400">
            No roles were found in the database. Run the seed command first.
          </p>
        </div>
      </main>
    );
  }

  const unlockedRoles = roles.filter((role) => role.level <= currentRole.level);
  const nextRole = roles.find((role) => role.level === currentRole.level + 1);

  const unlockedLessons = unlockedRoles.flatMap((role) => role.lessons);
  const unlockedLabs = unlockedRoles.flatMap((role) => role.labs);
  const unlockedMissions = unlockedRoles.flatMap((role) => role.missions);
  const unlockedTickets = unlockedRoles.flatMap((role) => role.tickets);

  const totalXp = user?.totalXp ?? 0;
  const nextRoleXp = nextRole?.xpRequired ?? currentRole.xpRequired;
  const progressPercent = nextRole
    ? Math.min(Math.round((totalXp / nextRoleXp) * 100), 100)
    : 100;

  const recommendedMission = unlockedMissions[0];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="overflow-hidden rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 p-8 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-yellow-400">
                Osiris Cyber Academy
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-5xl">
                Welcome back, {user?.name ?? "Cyber Cadet"}
              </h1>

              <p className="mt-4 max-w-2xl text-zinc-400">
                Continue your journey through role-based cybersecurity training.
                Complete lessons, labs, missions, and tickets to unlock your
                next professional role.
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-500/30 bg-black/60 p-6 text-center">
              <p className="text-sm uppercase tracking-widest text-zinc-400">
                Current Role
              </p>
              <h2 className="mt-2 text-3xl font-bold text-yellow-400">
                {currentRole.name}
              </h2>
              <p className="mt-2 max-w-xs text-sm text-zinc-400">
                {currentRole.framework}
              </p>
            </div>
          </div>
        </section>

        {/* Main Stats */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total XP"
            value={totalXp.toString()}
            description="XP earned across platform activities."
          />

          <StatCard
            label="Next Promotion"
            value={nextRole ? nextRole.name : "Max Level"}
            description={
              nextRole
                ? `${nextRole.xpRequired} XP required`
                : "You completed the current ladder."
            }
          />

          <StatCard
            label="Unlocked Roles"
            value={unlockedRoles.length.toString()}
            description="Roles currently available."
          />

          <StatCard
            label="Role Level"
            value={`Level ${currentRole.level}`}
            description={currentRole.certification ?? "Osiris role path"}
          />
        </section>

        {/* Progress */}
        <section className="rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Promotion Progress
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Progress toward your next Osiris role.
              </p>
            </div>

            <div className="rounded-full border border-yellow-500/30 px-4 py-2 text-sm font-semibold text-yellow-400">
              {progressPercent}%
            </div>
          </div>

          <div className="h-4 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-yellow-400"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-3 flex justify-between text-xs text-zinc-500">
            <span>{totalXp} XP earned</span>
            <span>{nextRole ? `${nextRoleXp} XP target` : "Complete"}</span>
          </div>
        </section>

        {/* Content Unlock Cards */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ContentCard
            href="/learn"
            title="Lessons"
            count={unlockedLessons.length}
            description="Build the knowledge for your current role."
          />

          <ContentCard
            href="/labs"
            title="Labs"
            count={unlockedLabs.length}
            description="Practice realistic technical workflows."
          />

          <ContentCard
            href="/missions"
            title="Missions"
            count={unlockedMissions.length}
            description="Complete scenario-based challenges."
          />

          <ContentCard
            href="/tickets"
            title="Tickets"
            count={unlockedTickets.length}
            description="Work simulated cybersecurity tickets."
          />
        </section>

        {/* Bottom Section */}
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-yellow-400">
                  Recommended
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  Next Mission
                </h2>
              </div>
            </div>

            {recommendedMission ? (
              <div className="mt-6 rounded-2xl border border-zinc-800 bg-black p-5">
                <p className="text-lg font-semibold text-white">
                  {recommendedMission.title}
                </p>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {recommendedMission.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-400">
                    {recommendedMission.difficulty}
                  </span>

                  <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300">
                    {recommendedMission.category}
                  </span>

                  <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300">
                    {recommendedMission.xpReward} XP
                  </span>
                </div>

                <Link
                  href={`/missions/${recommendedMission.slug}`}
                  className="mt-6 inline-flex rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-yellow-300"
                >
                  Start Mission
                </Link>
              </div>
            ) : (
              <p className="mt-4 text-sm text-zinc-400">
                No missions are unlocked yet.
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-[0.2em] text-yellow-400">
              Role Briefing
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              {currentRole.name}
            </h2>

            <p className="mt-4 leading-7 text-zinc-400">
              {currentRole.description}
            </p>

            <div className="mt-6 space-y-3 rounded-2xl border border-zinc-800 bg-black p-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  Framework
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                  {currentRole.framework}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  Certification Model
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                  {currentRole.certification}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  Next Role
                </p>
                <p className="mt-1 text-sm font-medium text-yellow-400">
                  {nextRole ? nextRole.name : "Final role reached"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Role Path Preview */}
        <section className="rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 shadow-xl">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.2em] text-yellow-400">
              Career Path
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Osiris Role Ladder
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {roles.slice(0, 5).map((role) => {
              const unlocked = role.level <= currentRole.level;
              const active = role.id === currentRole.id;

              return (
                <div
                  key={role.id}
                  className={`rounded-2xl border p-4 ${
                    active
                      ? "border-yellow-400 bg-yellow-400/10"
                      : unlocked
                        ? "border-green-500/30 bg-green-500/5"
                        : "border-zinc-800 bg-black"
                  }`}
                >
                  <p className="text-xs uppercase tracking-widest text-zinc-500">
                    Level {role.level}
                  </p>

                  <h3
                    className={`mt-2 font-semibold ${
                      active ? "text-yellow-400" : "text-white"
                    }`}
                  >
                    {role.name}
                  </h3>

                  <p className="mt-2 text-xs text-zinc-500">
                    {unlocked ? "Unlocked" : "Locked"}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 shadow-xl">
      <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </p>
      <h2 className="mt-3 text-3xl font-bold text-yellow-400">{value}</h2>
      <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>
    </div>
  );
}

function ContentCard({
  href,
  title,
  count,
  description,
}: {
  href: string;
  title: string;
  count: number;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-yellow-500/20 bg-zinc-950 p-6 shadow-xl transition hover:-translate-y-1 hover:border-yellow-400/60 hover:bg-zinc-900"
    >
      <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
        {title}
      </p>

      <h2 className="mt-3 text-4xl font-bold text-white">{count}</h2>

      <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>

      <p className="mt-5 text-sm font-semibold text-yellow-400">
        Open {title} →
      </p>
    </Link>
  );
}