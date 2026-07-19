import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  MapPinned,
} from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  getDistrictByRoleSlug,
  trainingCityDistricts,
} from "@/lib/training-city";

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ district?: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      points: true,
      roleId: true,
      role: {
        select: {
          name: true,
          slug: true,
          level: true,
        },
      },
    },
  });

  if (!user?.roleId || !user.role) {
    return (
      <div className="osiris-card">
        <p className="osiris-eyebrow">Training City Curriculum</p>
        <h1 className="mt-3 text-3xl font-bold text-white">
          No Role Assigned
        </h1>
        <p className="mt-3 text-zinc-400">
          Your account does not currently have a training role assigned.
        </p>
      </div>
    );
  }

  const currentRole = user.role;

  const cityRoles = await prisma.role.findMany({
    where: {
      slug: {
        in: trainingCityDistricts.map((district) => district.roleSlug),
      },
    },
    orderBy: {
      level: "asc",
    },
    include: {
      courses: {
        where: {
          isPublished: true,
        },
        orderBy: {
          order: "asc",
        },
        take: 1,
        include: {
          role: true,
          modules: {
            where: {
              isPublished: true,
            },
            orderBy: {
              order: "asc",
            },
            include: {
              lessons: {
                orderBy: {
                  order: "asc",
                },
                include: {
                  progress: {
                    where: {
                      userId: session.user.id,
                      status: "completed",
                    },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const { district: requestedRoleSlug } = await searchParams;
  const requestedDistrict = requestedRoleSlug
    ? getDistrictByRoleSlug(requestedRoleSlug)
    : undefined;
  const currentDistrict = getDistrictByRoleSlug(currentRole.slug);
  const unlockedDistricts = trainingCityDistricts.filter(
    (district) => currentRole.level >= district.requiredLevel,
  );
  const selectedDistrict =
    requestedDistrict &&
    currentRole.level >= requestedDistrict.requiredLevel
      ? requestedDistrict
      : currentDistrict ?? unlockedDistricts[unlockedDistricts.length - 1];

  if (!selectedDistrict) {
    return (
      <div className="osiris-card">
        <p className="osiris-eyebrow">Training City Curriculum</p>
        <h1 className="mt-3 text-3xl font-bold text-white">
          District Mapping Required
        </h1>
        <p className="mt-3 text-zinc-400">
          Your role has not been mapped to a Mission Training City district.
        </p>
      </div>
    );
  }

  const selectedRole = cityRoles.find(
    (role) => role.slug === selectedDistrict.roleSlug,
  );
  const course = selectedRole?.courses[0];
  const allLessons = course?.modules.flatMap((module) => module.lessons) ?? [];
  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter(
    (lesson) => lesson.progress.length > 0,
  ).length;
  const totalXp = allLessons.reduce(
    (total, lesson) => total + lesson.xpReward,
    0,
  );
  const earnedXp = allLessons.reduce(
    (total, lesson) =>
      total + (lesson.progress.length > 0 ? lesson.xpReward : 0),
    0,
  );
  const progressPercentage =
    totalLessons === 0
      ? 0
      : Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="space-y-8 pb-10">
      <section className="osiris-panel overflow-hidden p-6 md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-400/30 bg-yellow-400/10 text-yellow-400">
                <MapPinned className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="osiris-eyebrow">Training City Curriculum</p>
            </div>
            <h1 className="mt-4 text-3xl font-black text-white md:text-4xl">
              Choose Your District
            </h1>
            <p className="mt-3 max-w-3xl osiris-subtitle">
              Your modules now follow the same district progression as Mission
              Training City. Previous districts remain available as your role
              clearance increases.
            </p>
          </div>
          <Link
            href="/city"
            className="osiris-button-secondary shrink-0 gap-2"
          >
            View city map
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {trainingCityDistricts.map((district) => {
            const isUnlocked = currentRole.level >= district.requiredLevel;
            const isSelected = district.slug === selectedDistrict.slug;
            const districtRole = cityRoles.find(
              (role) => role.slug === district.roleSlug,
            );
            const moduleCount = districtRole?.courses[0]?.modules.length ?? 0;
            const DistrictIcon = district.icon;
            const cardClassName = `relative min-h-44 rounded-2xl border p-4 transition ${
              isSelected
                ? "border-yellow-400 bg-yellow-400/10 shadow-[0_0_28px_rgba(250,204,21,0.1)]"
                : isUnlocked
                  ? "border-yellow-500/20 bg-black hover:-translate-y-1 hover:border-yellow-400/50"
                  : "border-white/5 bg-black/50 text-zinc-600"
            }`;
            const cardContent = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                      isUnlocked
                        ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-400"
                        : "border-zinc-800 bg-zinc-900 text-zinc-600"
                    }`}
                  >
                    <DistrictIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  {isSelected ? (
                    <CheckCircle2
                      className="h-5 w-5 text-yellow-400"
                      aria-label="Selected district"
                    />
                  ) : !isUnlocked ? (
                    <LockKeyhole
                      className="h-4 w-4 text-zinc-600"
                      aria-label="Locked district"
                    />
                  ) : null}
                </div>
                <p className="mt-4 text-[0.65rem] font-black uppercase tracking-[0.2em] text-zinc-500">
                  {district.callSign}
                </p>
                <h2
                  className={`mt-1 font-black ${
                    isUnlocked ? "text-white" : "text-zinc-600"
                  }`}
                >
                  {district.name}
                </h2>
                <p className="mt-2 text-xs font-bold text-zinc-500">
                  {isUnlocked
                    ? `${moduleCount} module${moduleCount === 1 ? "" : "s"}`
                    : `Requires ${district.requiredRole}`}
                </p>
              </>
            );

            return isUnlocked ? (
              <Link
                key={district.slug}
                href={district.learnHref}
                className={cardClassName}
                aria-current={isSelected ? "page" : undefined}
              >
                {cardContent}
              </Link>
            ) : (
              <div key={district.slug} className={cardClassName}>
                {cardContent}
              </div>
            );
          })}
        </div>
      </section>

      {!course ? (
        <section className="osiris-card">
          <p className="osiris-eyebrow">{selectedDistrict.name}</p>
          <h2 className="mt-3 text-3xl font-bold text-white">
            Modules Coming Soon
          </h2>
          <p className="mt-3 text-zinc-400">
            This district is unlocked, but its published curriculum has not
            been deployed yet.
          </p>
        </section>
      ) : (
        <>
          <section className="osiris-panel p-6 md:p-8">
            <p className="osiris-eyebrow">
              {selectedDistrict.callSign} {"\u00b7"} {selectedDistrict.name}
            </p>

            <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="osiris-title">{course.title}</h2>
                <p className="mt-4 max-w-3xl osiris-subtitle">
                  {course.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="osiris-badge">{course.difficulty}</span>
                  <span className="osiris-badge-dark">
                    {course.role.name}
                  </span>
                  {course.certification && (
                    <span className="osiris-badge-dark">
                      {course.certification}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid min-w-64 grid-cols-2 gap-3">
                <div className="rounded-2xl border border-yellow-500/20 bg-black p-4">
                  <p className="text-xs uppercase tracking-widest text-zinc-500">
                    Completed
                  </p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    {completedLessons}/{totalLessons}
                  </p>
                </div>

                <div className="rounded-2xl border border-yellow-500/20 bg-black p-4">
                  <p className="text-xs uppercase tracking-widest text-zinc-500">
                    Progress
                  </p>
                  <p className="mt-2 text-2xl font-bold text-yellow-400">
                    {progressPercentage}%
                  </p>
                </div>

                <div className="rounded-2xl border border-yellow-500/20 bg-black p-4">
                  <p className="text-xs uppercase tracking-widest text-zinc-500">
                    Course XP
                  </p>
                  <p className="mt-2 text-lg font-bold text-white">
                    {earnedXp}/{totalXp} XP
                  </p>
                </div>

                <div className="rounded-2xl border border-yellow-500/20 bg-black p-4">
                  <p className="text-xs uppercase tracking-widest text-zinc-500">
                    Account XP
                  </p>
                  <p className="mt-2 text-lg font-bold text-yellow-400">
                    {user.points} XP
                  </p>
                </div>

                <div className="col-span-2 rounded-2xl border border-yellow-500/20 bg-black p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs uppercase tracking-widest text-zinc-500">
                      Course Progress
                    </p>
                    <p className="text-sm font-bold text-yellow-400">
                      {progressPercentage}%
                    </p>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-zinc-900">
                    <div
                      className="h-full rounded-full bg-yellow-400 transition-all"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="col-span-2 rounded-2xl border border-yellow-500/20 bg-black p-4">
                  <p className="text-xs uppercase tracking-widest text-zinc-500">
                    Estimated Time
                  </p>
                  <p className="mt-2 text-lg font-bold text-white">
                    {course.estimatedHours
                      ? `${course.estimatedHours} hours`
                      : "Self-paced"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            {course.modules.map((module, moduleIndex) => {
              const moduleCompletedLessons = module.lessons.filter(
                (lesson) => lesson.progress.length > 0,
              ).length;
              const moduleProgress =
                module.lessons.length === 0
                  ? 0
                  : Math.round(
                      (moduleCompletedLessons / module.lessons.length) * 100,
                    );

              return (
                <div key={module.id} className="osiris-card">
                  <div className="flex flex-col gap-4 border-b border-yellow-500/10 pb-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="osiris-eyebrow">
                        {selectedDistrict.callSign} {"\u00b7"} Module{" "}
                        {moduleIndex + 1}
                      </p>
                      <h2 className="mt-3 text-2xl font-bold text-white">
                        {module.title}
                      </h2>
                      <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
                        {module.description}
                      </p>
                    </div>

                    <div className="min-w-44 rounded-2xl border border-yellow-500/20 bg-black px-4 py-3">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-bold text-yellow-400">
                          {moduleCompletedLessons}/{module.lessons.length}{" "}
                          completed
                        </p>
                        <p className="text-sm text-zinc-400">
                          {moduleProgress}%
                        </p>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-900">
                        <div
                          className="h-full rounded-full bg-yellow-400 transition-all"
                          style={{ width: `${moduleProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    {module.lessons.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-zinc-800 bg-black/40 p-5">
                        <p className="text-sm text-zinc-500">
                          Lessons for this module are coming soon.
                        </p>
                      </div>
                    ) : (
                      module.lessons.map((lesson, lessonIndex) => {
                        const isCompleted = lesson.progress.length > 0;

                        return (
                          <Link
                            key={lesson.id}
                            href={`/learn/${lesson.slug}`}
                            className={`block rounded-2xl border p-5 transition ${
                              isCompleted
                                ? "border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/50"
                                : "border-yellow-500/10 bg-black hover:border-yellow-500/30"
                            }`}
                          >
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                              <div>
                                <p className="text-xs uppercase tracking-widest text-zinc-500">
                                  Lesson {moduleIndex + 1}.{lessonIndex + 1}
                                </p>
                                <h3 className="mt-2 text-xl font-bold text-white">
                                  {lesson.title}
                                </h3>
                                <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
                                  {lesson.description}
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                  <span className="osiris-badge">
                                    {lesson.difficulty}
                                  </span>
                                  {isCompleted ? (
                                    <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-yellow-400">
                                      Completed
                                    </span>
                                  ) : (
                                    <span className="osiris-badge-dark">
                                      Open Lesson
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="rounded-xl border border-yellow-500/20 bg-zinc-950 px-4 py-3 text-sm font-bold text-yellow-400">
                                  {lesson.xpReward} XP
                                </div>
                                {isCompleted && (
                                  <p className="mt-2 text-xs font-medium text-yellow-400">
                                    XP earned
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                              <p className="text-xs uppercase tracking-widest text-zinc-500">
                                Lesson Preview
                              </p>
                              <p className="mt-2 text-sm leading-6 text-zinc-400">
                                {lesson.content}
                              </p>
                            </div>
                          </Link>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        </>
      )}
    </div>
  );
}
