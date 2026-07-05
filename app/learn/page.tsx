import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function LearnPage() {
  const courses = await prisma.course.findMany({
    include: {
      modules: {
        orderBy: {
          order: "asc",
        },
        include: {
          lessons: {
            orderBy: {
              order: "asc",
            },
          },
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <section className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
          Learning Path
        </p>
        <h1 className="mt-3 text-4xl font-bold">Cybersecurity Courses</h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          Build your foundation through structured courses, modules, and lessons.
        </p>
      </section>

      <section className="space-y-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-cyan-400">{course.level}</p>
                <h2 className="mt-1 text-2xl font-bold">{course.title}</h2>
                <p className="mt-2 text-slate-300">{course.description}</p>
              </div>

              <Link
                href="/dashboard"
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm hover:border-cyan-400"
              >
                Dashboard
              </Link>
            </div>

            <div className="space-y-4">
              {course.modules.map((module) => (
                <div
                  key={module.id}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                >
                  <h3 className="text-lg font-semibold">{module.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {module.description}
                  </p>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="rounded-lg border border-slate-800 bg-slate-900 p-4"
                      >
                        <p className="font-semibold">{lesson.title}</p>
                        <p className="mt-2 text-sm text-slate-400">
                          {lesson.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}