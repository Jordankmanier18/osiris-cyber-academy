import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleGauge,
  ClipboardCheck,
  LockKeyhole,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { trainingCityMissions } from "@/lib/training-city-missions";

export const metadata: Metadata = {
  title: "Dashboard | Osiris Cyber Academy",
  description: "Your role, progress, and next training assignment.",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      points: true,
      role: {
        select: {
          name: true,
          slug: true,
          level: true,
          description: true,
          framework: true,
          certification: true,
          xpRequired: true,
          nextRoleSlug: true,
          courses: {
            where: { isPublished: true },
            orderBy: { order: "asc" },
            include: {
              modules: {
                where: { isPublished: true },
                orderBy: { order: "asc" },
                include: {
                  lessons: {
                    orderBy: { order: "asc" },
                    select: {
                      id: true,
                      title: true,
                      slug: true,
                      description: true,
                      xpReward: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      progress: {
        where: { status: "completed" },
        select: {
          lessonId: true,
          labId: true,
          ticketId: true,
        },
      },
      cityProgress: {
        select: {
          missionKey: true,
          status: true,
          bestScore: true,
          attemptCount: true,
          xpAwarded: true,
        },
      },
      submissions: {
        select: { id: true },
      },
    },
  });

  if (!user?.role) {
    redirect("/login");
  }

  const currentRole = user.role;
  const nextRole = currentRole.nextRoleSlug
    ? await prisma.role.findUnique({
        where: { slug: currentRole.nextRoleSlug },
        select: {
          name: true,
          slug: true,
          level: true,
          xpRequired: true,
        },
      })
    : null;

  const roleLessons = currentRole.courses.flatMap((course) =>
    course.modules.flatMap((module) => module.lessons),
  );
  const completedLessonIds = new Set(
    user.progress
      .map((item) => item.lessonId)
      .filter((lessonId): lessonId is string => Boolean(lessonId)),
  );
  const nextLesson = roleLessons.find(
    (lesson) => !completedLessonIds.has(lesson.id),
  );
  const currentRoleLessonsComplete = roleLessons.filter((lesson) =>
    completedLessonIds.has(lesson.id),
  ).length;

  const completedCityMissionIds = new Set(
    user.cityProgress
      .filter((progress) => progress.status === "completed")
      .map((progress) => progress.missionKey),
  );
  const nextCityMission = trainingCityMissions.find(
    (mission) =>
      mission.requiredLevel <= currentRole.level &&
      !completedCityMissionIds.has(mission.id) &&
      (!mission.prerequisiteMissionId ||
        completedCityMissionIds.has(mission.prerequisiteMissionId)),
  );
  const completedCityMissions = user.cityProgress.filter(
    (progress) => progress.status === "completed",
  );
  const bestCityScore = user.cityProgress.reduce(
    (bestScore, progress) => Math.max(bestScore, progress.bestScore),
    0,
  );

  const currentRoleThreshold = currentRole.xpRequired;
  const nextRoleThreshold = nextRole?.xpRequired ?? currentRoleThreshold;
  const xpRange = Math.max(nextRoleThreshold - currentRoleThreshold, 1);
  const xpIntoRole = Math.max(user.points - currentRoleThreshold, 0);
  const promotionPercent = nextRole
    ? Math.min(Math.round((xpIntoRole / xpRange) * 100), 100)
    : 100;
  const xpRemaining = nextRole
    ? Math.max(nextRole.xpRequired - user.points, 0)
    : 0;

  const recommendedAction = nextLesson
    ? {
        eyebrow: "Continue learning",
        title: nextLesson.title,
        description: nextLesson.description,
        href: `/learn/${nextLesson.slug}`,
        label: "Open lesson",
        reward: `${nextLesson.xpReward} XP`,
        icon: BookOpen,
      }
    : nextCityMission
      ? {
          eyebrow: "City assignment ready",
          title: nextCityMission.title,
          description: nextCityMission.objective,
          href: `/city?mission=${nextCityMission.id}`,
          label: "Enter Training City",
          reward: `${nextCityMission.xpReward} XP`,
          icon: Building2,
        }
      : {
          eyebrow: "Review your progress",
          title: nextRole
            ? `Prepare for ${nextRole.name}`
            : "Role path complete",
          description: nextRole
            ? "You have completed the available activities for this role. Review your record while the next promotion requirements are prepared."
            : "You have reached the highest role currently available in the academy.",
          href: "/profile",
          label: "View profile",
          reward: nextRole ? `${xpRemaining} XP remaining` : "Top clearance",
          icon: Trophy,
        };
  const RecommendedIcon = recommendedAction.icon;
  const operativeName = user.name ?? user.email.split("@")[0];

  return (
    <div className="space-y-6 pb-10 md:space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-yellow-500/20 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.13),transparent_34%),linear-gradient(135deg,#18181b_0%,#050505_58%,#09090b_100%)] p-6 shadow-2xl md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border border-yellow-400/10" />
        <div className="pointer-events-none absolute -right-2 -top-6 h-36 w-36 rounded-full border border-yellow-400/10" />
        <div className="relative grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-400/30 bg-yellow-400/10 text-yellow-400">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="osiris-eyebrow">Academy Command Center</p>
            </div>
            <h1 className="mt-5 max-w-3xl text-3xl font-black tracking-tight text-white md:text-5xl">
              Welcome back, {operativeName}.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
              Build the knowledge, apply it inside Mission Training City, and
              earn the clearance for your next cybersecurity role.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={recommendedAction.href}
                className="osiris-button gap-2"
              >
                {recommendedAction.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/city" className="osiris-button-secondary gap-2">
                <MapPinned className="h-4 w-4" aria-hidden="true" />
                View city map
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-yellow-500/20 bg-black/70 p-5 backdrop-blur">
            <p className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-zinc-500">
              Current clearance
            </p>
            <div className="mt-3 flex items-start justify-between gap-4">
              <div>
                <p className="text-2xl font-black text-yellow-400">
                  {currentRole.name}
                </p>
                <p className="mt-1 text-sm font-bold text-zinc-500">
                  Level {currentRole.level} · {currentRole.framework}
                </p>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-400 font-black text-black">
                {currentRole.level}
              </span>
            </div>
            <p className="mt-4 border-t border-white/5 pt-4 text-xs leading-6 text-zinc-500">
              {currentRole.description}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Academy XP"
          value={user.points.toLocaleString()}
          detail={
            nextRole ? `${xpRemaining} until next role` : "Top role reached"
          }
          icon={Sparkles}
        />
        <StatCard
          label="Role lessons"
          value={`${currentRoleLessonsComplete}/${roleLessons.length}`}
          detail="Knowledge checks passed"
          icon={BookOpen}
        />
        <StatCard
          label="City missions"
          value={`${completedCityMissions.length}/${trainingCityMissions.length}`}
          detail={`${bestCityScore}% best defense score`}
          icon={Building2}
        />
        <StatCard
          label="Assignments"
          value={user.submissions.length.toString()}
          detail="Mission reports submitted"
          icon={ClipboardCheck}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="osiris-panel p-6 md:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="osiris-eyebrow">Promotion path</p>
              <h2 className="mt-2 text-2xl font-black text-white">
                {nextRole
                  ? `${currentRole.name} → ${nextRole.name}`
                  : "Highest current clearance"}
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                {nextRole
                  ? `${user.points} of ${nextRole.xpRequired} XP earned`
                  : "More specialist roles will be added as the academy expands."}
              </p>
            </div>
            <span className="w-fit rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1.5 text-xs font-black text-yellow-400">
              {promotionPercent}%
            </span>
          </div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-zinc-900">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-600 via-yellow-400 to-yellow-200 transition-all"
              style={{ width: `${promotionPercent}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-bold text-zinc-600">
            <span>{currentRole.xpRequired} XP</span>
            <span>{nextRole ? `${nextRole.xpRequired} XP` : "Complete"}</span>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <ProgressCheckpoint
              label="Learn"
              detail={`${currentRoleLessonsComplete} lesson${currentRoleLessonsComplete === 1 ? "" : "s"} complete`}
              complete={
                roleLessons.length > 0 &&
                currentRoleLessonsComplete === roleLessons.length
              }
            />
            <ProgressCheckpoint
              label="Apply"
              detail={`${completedCityMissions.length} city mission${completedCityMissions.length === 1 ? "" : "s"} complete`}
              complete={completedCityMissions.length > 0}
            />
            <ProgressCheckpoint
              label="Document"
              detail={`${user.submissions.length} report${user.submissions.length === 1 ? "" : "s"} submitted`}
              complete={user.submissions.length > 0}
            />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-yellow-400/30 bg-yellow-400 p-6 text-black shadow-[0_24px_80px_rgba(250,204,21,0.12)] md:p-7">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border border-black/10" />
          <div className="relative">
            <div className="flex items-center justify-between gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-yellow-400">
                <RecommendedIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="rounded-full bg-black/10 px-3 py-1 text-xs font-black">
                {recommendedAction.reward}
              </span>
            </div>
            <p className="mt-6 text-[0.65rem] font-black uppercase tracking-[0.22em] text-black/55">
              {recommendedAction.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-black">
              {recommendedAction.title}
            </h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-black/65">
              {recommendedAction.description}
            </p>
            <Link
              href={recommendedAction.href}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-black text-yellow-400 transition hover:-translate-y-0.5"
            >
              {recommendedAction.label}
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="osiris-panel p-6 md:p-7">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="osiris-eyebrow">The Osiris training loop</p>
            <h2 className="mt-2 text-2xl font-black text-white">
              One journey, not disconnected course pages
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-zinc-500">
            Each role follows the same repeatable path so you always know what
            to do and why it matters on the job.
          </p>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <JourneyStep
            number="01"
            title="Learn the concept"
            description="Complete concise role-based lessons and knowledge checks."
            href={`/learn?district=${currentRole.slug}`}
            icon={BookOpen}
          />
          <JourneyStep
            number="02"
            title="Defend the city"
            description="Apply controls, launch the test, and observe the attack path."
            href="/city"
            icon={Building2}
          />
          <JourneyStep
            number="03"
            title="Review the result"
            description="Use the debrief and score to understand what worked and why."
            href="/city"
            icon={CircleGauge}
          />
          <JourneyStep
            number="04"
            title="Earn role clearance"
            description="Build XP and a record of completed work toward promotion."
            href="/profile"
            icon={Target}
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <QuickLink
          href="/learn"
          label="Learning Path"
          description="See every unlocked district, course, module, and lesson."
          icon={BookOpen}
        />
        <QuickLink
          href="/city"
          label="Mission Training City"
          description="Protect the town through hands-on security simulations."
          icon={Building2}
        />
        <QuickLink
          href="/profile"
          label="Training Record"
          description="Review your role, XP, completions, and submitted work."
          icon={Trophy}
        />
      </section>
    </div>
  );
}

type IconType = typeof BookOpen;

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: IconType;
}) {
  return (
    <div className="rounded-2xl border border-yellow-500/15 bg-zinc-950 p-5 shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-zinc-600">
            {label}
          </p>
          <p className="mt-3 text-3xl font-black text-white">{value}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-400/10 text-yellow-400">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-xs font-bold text-zinc-500">{detail}</p>
    </div>
  );
}

function ProgressCheckpoint({
  label,
  detail,
  complete,
}: {
  label: string;
  detail: string;
  complete: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-black p-4">
      <div className="flex items-center gap-2">
        {complete ? (
          <CheckCircle2 className="h-4 w-4 text-green-400" aria-hidden="true" />
        ) : (
          <LockKeyhole className="h-4 w-4 text-zinc-600" aria-hidden="true" />
        )}
        <p className="text-sm font-black text-white">{label}</p>
      </div>
      <p className="mt-2 text-xs leading-5 text-zinc-500">{detail}</p>
    </div>
  );
}

function JourneyStep({
  number,
  title,
  description,
  href,
  icon: Icon,
}: {
  number: string;
  title: string;
  description: string;
  href: string;
  icon: IconType;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/5 bg-black p-5 transition hover:-translate-y-1 hover:border-yellow-400/30"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-black tracking-[0.2em] text-yellow-400">
          {number}
        </span>
        <Icon
          className="h-5 w-5 text-zinc-600 transition group-hover:text-yellow-400"
          aria-hidden="true"
        />
      </div>
      <h3 className="mt-5 font-black text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>
    </Link>
  );
}

function QuickLink({
  href,
  label,
  description,
  icon: Icon,
}: {
  href: string;
  label: string;
  description: string;
  icon: IconType;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-2xl border border-yellow-500/15 bg-zinc-950 p-5 transition hover:-translate-y-1 hover:border-yellow-400/40"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-black">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span>
        <span className="flex items-center gap-2 font-black text-white">
          {label}
          <ChevronRight
            className="h-4 w-4 text-yellow-400 transition group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
        <span className="mt-1 block text-sm leading-6 text-zinc-500">
          {description}
        </span>
      </span>
    </Link>
  );
}
