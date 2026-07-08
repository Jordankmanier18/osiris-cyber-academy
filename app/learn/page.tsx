import { prisma } from "@/lib/prisma";

export default async function LearnPage() {
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
      lessons: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  const currentRole = user?.currentRole ?? roles[0];

  if (!currentRole) {
    return (
      <div className="osiris-card">
        <p className="osiris-eyebrow">Learning Path</p>
        <h1 className="mt-3 text-3xl font-bold text-white">No Lessons Found</h1>
        <p className="mt-3 text-zinc-400">
          No roles were found. Run the seed command first.
        </p>
      </div>
    );
  }

  const unlockedRoles = roles.filter((role) => role.level <= currentRole.level);

  const lessons = unlockedRoles.flatMap((role) =>
    role.lessons.map((lesson) => ({
      ...lesson,
      roleName: role.name,
      framework: role.framework,
    })),
  );

  return (
    <div className="space-y-8">
      <section className="osiris-panel p-8">
        <p className="osiris-eyebrow">Learning Path</p>
        <h1 className="mt-3 osiris-title">Unlocked Lessons</h1>
        <p className="mt-4 max-w-3xl osiris-subtitle">
          Lessons gradually build the knowledge needed for each role. As the
          student is promoted, deeper cybersecurity concepts unlock.
        </p>
      </section>

      <section className="space-y-4">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="osiris-card osiris-card-hover">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="osiris-badge">{lesson.difficulty}</span>
                  <span className="osiris-badge-dark">{lesson.roleName}</span>
                  <span className="osiris-badge-dark">{lesson.framework}</span>
                </div>

                <h2 className="mt-5 text-2xl font-bold text-white">
                  {lesson.title}
                </h2>

                <p className="mt-3 max-w-4xl text-sm leading-6 text-zinc-400">
                  {lesson.description}
                </p>
              </div>

              <div className="rounded-2xl border border-yellow-500/20 bg-black px-4 py-3 text-sm font-bold text-yellow-400">
                {lesson.xpReward} XP
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-yellow-500/10 bg-black p-4">
              <p className="text-xs uppercase tracking-widest text-zinc-500">
                Lesson Preview
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {lesson.content}
              </p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
