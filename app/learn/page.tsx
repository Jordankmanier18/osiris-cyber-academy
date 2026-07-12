import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function LearnPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      role: true,
    },
  });

  if (!user?.roleId) {
    return (
      <div className="osiris-card">
        <p className="osiris-eyebrow">Learning Path</p>

        <h1 className="mt-3 text-3xl font-bold text-white">
          No Role Assigned
        </h1>

        <p className="mt-3 text-zinc-400">
          Your account does not currently have a training role assigned.
        </p>
      </div>
    );
  }

  const course = await prisma.course.findFirst({
    where: {
      roleId: user.roleId,
      isPublished: true,
    },
    orderBy: {
      order: "asc",
    },
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
  });

  if (!course) {
    return (
      <div className="osiris-card">
        <p className="osiris-eyebrow">Learning Path</p>

        <h1 className="mt-3 text-3xl font-bold text-white">
          No Course Available
        </h1>

        <p className="mt-3 text-zinc-400">
          No published course is currently assigned to your role.
        </p>
      </div>
    );
  }

  const allLessons = course.modules.flatMap((module) => module.lessons);

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
    <div className="space-y-8">
      <section className="osiris-panel p-8">
        <p className="osiris-eyebrow">Learning Path</p>

        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="osiris-title">{course.title}</h1>

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
                  style={{
                    width: `${progressPercentage}%`,
                  }}
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
                    Module {moduleIndex + 1}
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
                      {moduleCompletedLessons}/{module.lessons.length} completed
                    </p>

                    <p className="text-sm text-zinc-400">
                      {moduleProgress}%
                    </p>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-900">
                    <div
                      className="h-full rounded-full bg-yellow-400 transition-all"
                      style={{
                        width: `${moduleProgress}%`,
                      }}
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
    </div>
  );
}