import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleGauge,
  ClipboardCheck,
  Crosshair,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  TicketCheck,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { auth } from "@/auth";
import { EnterpriseMap } from "@/components/dashboard/enterprise-map";
import { JourneyRail } from "@/components/dashboard/journey-rail";
import { prisma } from "@/lib/prisma";
import { getPromotionStatus } from "@/lib/progression";
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

  const [user, allRoles, promotionStatus] = await Promise.all([
    prisma.user.findUnique({
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
          orderBy: { completedAt: "desc" },
          select: {
            lessonId: true,
            labId: true,
            ticketId: true,
            completedAt: true,
            lesson: {
              select: { title: true, slug: true },
            },
          },
        },
        cityProgress: {
          orderBy: { completedAt: "desc" },
          select: {
            missionKey: true,
            status: true,
            bestScore: true,
            attemptCount: true,
            xpAwarded: true,
            completedAt: true,
          },
        },
        ticketProgress: {
          where: { status: "completed" },
          orderBy: { updatedAt: "desc" },
          select: {
            id: true,
            bestScore: true,
            updatedAt: true,
            ticket: {
              select: { title: true, ticketCode: true },
            },
          },
        },
        submissions: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            createdAt: true,
            mission: { select: { title: true } },
          },
        },
      },
    }),
    prisma.role.findMany({
      orderBy: { level: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        level: true,
        framework: true,
        xpRequired: true,
      },
    }),
    getPromotionStatus(session.user.id),
  ]);

  if (!user?.role) {
    redirect("/login");
  }

  const currentRole = user.role;
  const fallbackNextRole = currentRole.nextRoleSlug
    ? (allRoles.find((role) => role.slug === currentRole.nextRoleSlug) ?? null)
    : null;
  const nextRole = promotionStatus?.nextRole ?? fallbackNextRole;
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
  const lessonProgressPercent =
    roleLessons.length === 0
      ? 0
      : Math.round((currentRoleLessonsComplete / roleLessons.length) * 100);

  const completedCityMissionIds = new Set(
    user.cityProgress
      .filter((progress) => progress.status === "completed")
      .map((progress) => progress.missionKey),
  );
  const unlockedCityMissions = trainingCityMissions.filter(
    (mission) => mission.requiredLevel <= currentRole.level,
  );
  const completedCityMissions = unlockedCityMissions.filter((mission) =>
    completedCityMissionIds.has(mission.id),
  );
  const nextCityMission = trainingCityMissions.find(
    (mission) =>
      mission.requiredLevel <= currentRole.level &&
      !completedCityMissionIds.has(mission.id) &&
      (!mission.prerequisiteMissionId ||
        completedCityMissionIds.has(mission.prerequisiteMissionId)),
  );
  const bestCityScore = user.cityProgress.reduce(
    (bestScore, progress) => Math.max(bestScore, progress.bestScore),
    0,
  );

  const currentRoleThreshold = currentRole.xpRequired;
  const nextRoleThreshold = nextRole?.xpRequired ?? currentRoleThreshold;
  const xpRange = Math.max(nextRoleThreshold - currentRoleThreshold, 1);
  const xpIntoRole = Math.max(user.points - currentRoleThreshold, 0);
  const xpPromotionPercent = nextRole
    ? Math.min(Math.round((xpIntoRole / xpRange) * 100), 100)
    : 100;
  const promotionPercent = promotionStatus?.available
    ? Math.round(
        (promotionStatus.completedRequirements /
          promotionStatus.totalRequirements) *
          100,
      )
    : xpPromotionPercent;
  const xpRemaining = nextRole
    ? Math.max(nextRole.xpRequired - user.points, 0)
    : 0;

  const requiredCityMission = promotionStatus?.city.missionKey
    ? trainingCityMissions.find(
        (mission) => mission.id === promotionStatus.city.missionKey,
      )
    : null;
  const recommendedAction =
    promotionStatus?.available &&
    promotionStatus.firstIncompleteStep === "lessons"
      ? {
          eyebrow: "Continue learning",
          title: nextLesson?.title ?? "Finish your required lessons",
          description:
            nextLesson?.description ??
            "Complete every knowledge check required for your current role.",
          href: nextLesson
            ? "/learn/" + nextLesson.slug
            : "/learn?district=" + currentRole.slug,
          label: "Open lesson",
          reward: nextLesson ? nextLesson.xpReward + " XP" : "Required",
          icon: BookOpen,
        }
      : promotionStatus?.available &&
          promotionStatus.firstIncompleteStep === "city"
        ? {
            eyebrow: "City defense ready",
            title: requiredCityMission?.title ?? "Required city mission",
            description:
              requiredCityMission?.objective ??
              "Apply the controls, block the attack, and complete the after-action review.",
            href: requiredCityMission
              ? "/city?mission=" + requiredCityMission.id
              : "/city",
            label: "Enter Training City",
            reward: requiredCityMission
              ? requiredCityMission.xpReward + " XP"
              : "Required",
            icon: Building2,
          }
        : promotionStatus?.available &&
            promotionStatus.firstIncompleteStep === "capstone" &&
            promotionStatus.definition
          ? {
              eyebrow: "Promotion capstone unlocked",
              title: "Orientation Center Security Review",
              description:
                "Review the evidence, choose the correct remediation, validate the result, and close your first workplace ticket.",
              href: "/tickets/" + promotionStatus.definition.ticketCode,
              label: "Work capstone",
              reward: promotionStatus.definition.xpReward + " XP",
              icon: ClipboardCheck,
            }
          : nextLesson
            ? {
                eyebrow: "Continue learning",
                title: nextLesson.title,
                description: nextLesson.description,
                href: "/learn/" + nextLesson.slug,
                label: "Open lesson",
                reward: nextLesson.xpReward + " XP",
                icon: BookOpen,
              }
            : nextCityMission
              ? {
                  eyebrow: "City assignment ready",
                  title: nextCityMission.title,
                  description: nextCityMission.objective,
                  href: "/city?mission=" + nextCityMission.id,
                  label: "Enter Training City",
                  reward: nextCityMission.xpReward + " XP",
                  icon: Building2,
                }
              : {
                  eyebrow: "Review your record",
                  title: nextRole
                    ? "Prepare for " + nextRole.name
                    : "Role path complete",
                  description: nextRole
                    ? "Your available activities are complete. Review your record while the next promotion requirements are prepared."
                    : "You have reached the highest role currently available in the academy.",
                  href: "/profile",
                  label: "View profile",
                  reward: nextRole
                    ? xpRemaining + " XP remaining"
                    : "Top clearance",
                  icon: Trophy,
                };
  const RecommendedIcon = recommendedAction.icon;
  const operativeName = user.name ?? user.email.split("@")[0];
  const enterpriseMission =
    requiredCityMission ??
    nextCityMission ??
    [...unlockedCityMissions].reverse()[0] ??
    trainingCityMissions[0];
  const requiredCityComplete = promotionStatus?.available
    ? promotionStatus.city.complete
    : false;
  const lessonsComplete = promotionStatus?.available
    ? promotionStatus.lessons.complete
    : roleLessons.length > 0 &&
      currentRoleLessonsComplete === roleLessons.length;

  const recentActivity = [
    ...user.progress
      .filter((item) => item.lesson && item.completedAt)
      .map((item) => ({
        id: "lesson-" + item.lessonId,
        title: item.lesson?.title ?? "Lesson completed",
        detail: "Knowledge check passed",
        date: item.completedAt as Date,
        icon: BookOpen,
      })),
    ...user.ticketProgress.map((item) => ({
      id: "ticket-" + item.id,
      title: item.ticket.title,
      detail: item.ticket.ticketCode + " · " + item.bestScore + "% score",
      date: item.updatedAt,
      icon: TicketCheck,
    })),
    ...user.cityProgress
      .filter((item) => item.status === "completed" && item.completedAt)
      .map((item) => ({
        id: "city-" + item.missionKey,
        title:
          trainingCityMissions.find(
            (mission) => mission.id === item.missionKey,
          )?.title ?? "City mission completed",
        detail: item.bestScore + "% defense score",
        date: item.completedAt as Date,
        icon: Building2,
      })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 4);

  return (
    <div className="space-y-3 pb-8">
      <section className="grid gap-3 2xl:grid-cols-[0.72fr_1.28fr]">
        <div className="osiris-panel relative min-h-[248px] overflow-hidden p-5 md:p-6">
          <ShieldCheck
            className="pointer-events-none absolute -bottom-16 -right-10 h-64 w-64 text-yellow-400/[0.035]"
            strokeWidth={0.8}
            aria-hidden="true"
          />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <p className="osiris-eyebrow">Academy Command Center</p>
              <h1 className="mt-3 max-w-xl text-3xl font-black uppercase leading-[1.02] tracking-[-0.045em] text-white md:text-4xl">
                Building the next generation of{" "}
                <span className="osiris-gold-text">cyber defenders</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
                Welcome back, {operativeName}. Learn the role, defend the city,
                prove the work, and earn your next clearance.
              </p>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link href={recommendedAction.href} className="osiris-button gap-2">
                {recommendedAction.label}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <span className="font-mono text-[0.62rem] font-black uppercase tracking-[0.12em] text-zinc-600">
                {recommendedAction.reward}
              </span>
            </div>
          </div>
        </div>

        <JourneyRail roles={allRoles} currentLevel={currentRole.level} />
      </section>

      <section className="grid gap-3 2xl:grid-cols-[minmax(0,1.38fr)_minmax(380px,0.82fr)]">
        <section className="osiris-panel overflow-hidden p-4">
          <div className="flex flex-col gap-3 border-b border-yellow-500/15 pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center border border-yellow-400/25 bg-yellow-400/10 text-yellow-400">
                <CircleGauge className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="osiris-section-heading">Dashboard</p>
                <p className="mt-0.5 text-xs text-zinc-600">
                  Live academy progression
                </p>
              </div>
            </div>
            <div className="flex min-w-56 items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex items-center justify-between font-mono text-[0.56rem] font-black uppercase text-zinc-600">
                  <span>XP {user.points.toLocaleString()}</span>
                  <span>{promotionPercent}%</span>
                </div>
                <div className="osiris-progress-track !h-1.5">
                  <div
                    className="osiris-progress-fill"
                    style={{ width: promotionPercent + "%" }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <ConsoleCard label="Current Role" icon={ShieldCheck}>
              <div className="mt-3 flex items-center gap-4">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center border border-yellow-300/55 bg-yellow-400/10 text-yellow-300 shadow-[0_0_24px_rgba(227,170,34,0.15)] [clip-path:polygon(50%_0%,92%_22%,92%_75%,50%_100%,8%_75%,8%_22%)]">
                  <ShieldCheck className="h-7 w-7" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xl font-black uppercase text-white">
                    {currentRole.name}
                  </p>
                  <p className="mt-1 font-mono text-[0.62rem] font-black uppercase tracking-[0.1em] text-yellow-400">
                    Level {currentRole.level} · {currentRole.framework}
                  </p>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-xs leading-5 text-zinc-600">
                {currentRole.description}
              </p>
              <Link
                href="/profile"
                className="mt-3 inline-flex items-center gap-1 text-xs font-black text-yellow-400"
              >
                View role record
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </ConsoleCard>

            <ConsoleCard label="Next Promotion" icon={Award}>
              <div className="mt-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-black uppercase text-white">
                    {nextRole?.name ?? "Highest clearance"}
                  </p>
                  <p className="mt-1 font-mono text-[0.62rem] font-black uppercase text-yellow-400">
                    {nextRole ? "Level " + nextRole.level : "Role path complete"}
                  </p>
                </div>
                <span className="font-mono text-sm font-black text-yellow-400">
                  {promotionPercent}%
                </span>
              </div>
              <div className="mt-3 space-y-2">
                <RequirementRow
                  label="Complete role lessons"
                  complete={lessonsComplete}
                />
                <RequirementRow
                  label="Defend required city mission"
                  complete={requiredCityComplete}
                />
                <RequirementRow
                  label="Pass promotion capstone"
                  complete={promotionStatus?.capstone.complete ?? false}
                />
              </div>
              <div className="mt-3 osiris-progress-track !h-1.5">
                <div
                  className="osiris-progress-fill"
                  style={{ width: promotionPercent + "%" }}
                />
              </div>
            </ConsoleCard>

            <ConsoleCard label="Active Assignment" icon={Crosshair}>
              <div className="mt-3 flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-yellow-400/25 bg-yellow-400/10 text-yellow-400">
                  <RecommendedIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-black text-white">
                    {recommendedAction.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-zinc-600">
                    {recommendedAction.description}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <Link href={recommendedAction.href} className="osiris-button-secondary gap-2">
                  Continue assignment
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
                <span className="font-mono text-[0.62rem] font-black uppercase text-yellow-400">
                  {recommendedAction.reward}
                </span>
              </div>
            </ConsoleCard>

            <ConsoleCard label="Academy Stats" icon={Activity}>
              <div className="mt-2 divide-y divide-yellow-500/10">
                <MetricRow
                  label="Lessons passed"
                  value={currentRoleLessonsComplete + "/" + roleLessons.length}
                />
                <MetricRow
                  label="City missions secured"
                  value={completedCityMissions.length + "/" + unlockedCityMissions.length}
                />
                <MetricRow
                  label="Tickets resolved"
                  value={user.ticketProgress.length.toString()}
                />
                <MetricRow
                  label="Academy XP"
                  value={user.points.toLocaleString()}
                  accent
                />
              </div>
            </ConsoleCard>

            <ConsoleCard label="Recent Activity" icon={ClipboardCheck}>
              <div className="mt-2 space-y-1">
                {recentActivity.length > 0 ? (
                  recentActivity.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 border-b border-white/[0.035] py-2 last:border-0"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-yellow-500/15 bg-yellow-400/[0.04] text-yellow-400">
                          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-black text-zinc-200">
                            {item.title}
                          </p>
                          <p className="mt-0.5 truncate font-mono text-[0.52rem] uppercase text-zinc-700">
                            {item.detail}
                          </p>
                        </div>
                        <span className="shrink-0 font-mono text-[0.52rem] text-zinc-700">
                          {formatActivityDate(item.date)}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="py-4 text-xs text-zinc-600">
                    Your completed work will appear here.
                  </p>
                )}
              </div>
            </ConsoleCard>

            <ConsoleCard label="Skill Progress" icon={Sparkles}>
              <div className="mt-3 space-y-3">
                <ProgressLine label="Role knowledge" value={lessonProgressPercent} />
                <ProgressLine label="City defense" value={bestCityScore} />
                <ProgressLine label="Promotion readiness" value={promotionPercent} />
              </div>
              <p className="mt-4 border-t border-yellow-500/10 pt-3 text-xs leading-5 text-zinc-600">
                {currentRole.certification ?? currentRole.framework}
              </p>
            </ConsoleCard>
          </div>
        </section>

        <EnterpriseMap
          missionTitle={enterpriseMission.title}
          missionObjective={enterpriseMission.objective}
          targetAsset={enterpriseMission.targetAsset}
          attackPath={[...enterpriseMission.attackPath]}
          completed={completedCityMissionIds.has(enterpriseMission.id)}
        />
      </section>

      <section className="grid gap-3 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="osiris-panel p-4">
          <div className="flex items-center justify-between border-b border-yellow-500/15 pb-3">
            <div>
              <p className="osiris-section-heading">From Learner to Defender</p>
              <p className="mt-1 text-xs text-zinc-600">
                The same repeatable workflow powers every role.
              </p>
            </div>
            <span className="osiris-badge-dark">Learn · Apply · Prove</span>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <TrainingStep
              number="01"
              title="Learn"
              description="Build the role knowledge."
              href={"/learn?district=" + currentRole.slug}
              icon={BookOpen}
            />
            <TrainingStep
              number="02"
              title="Defend"
              description="Secure the simulated city."
              href="/city"
              icon={Building2}
            />
            <TrainingStep
              number="03"
              title="Prove"
              description="Close the capstone ticket."
              href="/tickets"
              icon={TicketCheck}
            />
            <TrainingStep
              number="04"
              title="Advance"
              description="Unlock your next role."
              href="/profile"
              icon={Trophy}
            />
          </div>
        </div>

        <div className="osiris-panel p-4">
          <p className="osiris-section-heading">Academy Operations</p>
          <div className="mt-3 divide-y divide-yellow-500/10 border-t border-yellow-500/15">
            <QuickAccess
              href="/learn"
              label="Learning Path"
              detail={currentRoleLessonsComplete + " lessons completed"}
            />
            <QuickAccess
              href="/city"
              label="Mission Training City"
              detail={completedCityMissions.length + " defenses secured"}
            />
            <QuickAccess
              href="/tickets"
              label="Ticket Queue"
              detail={user.ticketProgress.length + " tickets resolved"}
            />
            <QuickAccess
              href="/profile"
              label="Training Record"
              detail={user.points.toLocaleString() + " total XP"}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ConsoleCard({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <article className="border border-yellow-500/15 bg-black/75 p-4">
      <div className="flex items-center justify-between border-b border-yellow-500/10 pb-2">
        <p className="font-mono text-[0.62rem] font-black uppercase tracking-[0.12em] text-yellow-400">
          {label}
        </p>
        <Icon className="h-3.5 w-3.5 text-yellow-500/70" aria-hidden="true" />
      </div>
      {children}
    </article>
  );
}

function RequirementRow({
  label,
  complete,
}: {
  label: string;
  complete: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {complete ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-green-400" aria-hidden="true" />
      ) : (
        <LockKeyhole className="h-3.5 w-3.5 text-yellow-500/70" aria-hidden="true" />
      )}
      <span className={complete ? "text-zinc-400" : "text-zinc-600"}>
        {label}
      </span>
    </div>
  );
}

function MetricRow({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2 text-xs">
      <span className="text-zinc-600">{label}</span>
      <span
        className={
          "font-mono font-black " +
          (accent ? "text-yellow-400" : "text-zinc-200")
        }
      >
        {value}
      </span>
    </div>
  );
}

function ProgressLine({ label, value }: { label: string; value: number }) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[0.65rem]">
        <span className="font-semibold text-zinc-500">{label}</span>
        <span className="font-mono font-black text-zinc-300">{safeValue}%</span>
      </div>
      <div className="osiris-progress-track !h-1.5">
        <div
          className="osiris-progress-fill"
          style={{ width: safeValue + "%" }}
        />
      </div>
    </div>
  );
}

function TrainingStep({
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
  icon: LucideIcon;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 border border-yellow-500/12 bg-black/65 p-3 transition hover:border-yellow-400/40 hover:bg-yellow-400/[0.035]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-yellow-400/25 bg-yellow-400/10 text-yellow-400">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block font-mono text-[0.52rem] font-black tracking-[0.16em] text-yellow-500/70">
          {number}
        </span>
        <span className="block text-xs font-black uppercase text-white">
          {title}
        </span>
        <span className="mt-0.5 block truncate text-[0.62rem] text-zinc-700">
          {description}
        </span>
      </span>
    </Link>
  );
}

function QuickAccess({
  href,
  label,
  detail,
}: {
  href: string;
  label: string;
  detail: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-3 py-3"
    >
      <span>
        <span className="block text-xs font-black text-zinc-200 group-hover:text-yellow-400">
          {label}
        </span>
        <span className="mt-0.5 block font-mono text-[0.54rem] uppercase text-zinc-700">
          {detail}
        </span>
      </span>
      <ChevronRight
        className="h-4 w-4 text-zinc-700 transition group-hover:translate-x-1 group-hover:text-yellow-400"
        aria-hidden="true"
      />
    </Link>
  );
}

function formatActivityDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
