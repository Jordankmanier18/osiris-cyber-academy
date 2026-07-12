import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function submitQuiz(formData: FormData): Promise<void> {
  "use server";

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const lessonId = String(formData.get("lessonId") || "").trim();
  const lessonSlug = String(formData.get("lessonSlug") || "").trim();
  const questionId = String(formData.get("questionId") || "").trim();
  const choiceId = String(formData.get("choiceId") || "").trim();

  if (!lessonId || !lessonSlug || !questionId || !choiceId) {
    redirect(`/learn/${lessonSlug}?quiz=missing-answer`);
  }

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    select: {
      id: true,
      slug: true,
      xpReward: true,
    },
  });

  if (!lesson || lesson.slug !== lessonSlug) {
    throw new Error("Lesson not found.");
  }

  const choice = await prisma.quizChoice.findFirst({
    where: {
      id: choiceId,
      questionId,
      question: {
        lessonId: lesson.id,
      },
    },
    select: {
      isCorrect: true,
    },
  });

  if (!choice) {
    redirect(`/learn/${lessonSlug}?quiz=invalid-answer`);
  }

  if (!choice.isCorrect) {
    redirect(`/learn/${lessonSlug}?quiz=incorrect`);
  }

  await prisma.$transaction(async (tx) => {
    const existingProgress = await tx.userProgress.findFirst({
      where: {
        userId: session.user.id,
        lessonId: lesson.id,
      },
    });

    if (existingProgress?.status === "completed") {
      return;
    }

    if (existingProgress) {
      await tx.userProgress.update({
        where: {
          id: existingProgress.id,
        },
        data: {
          status: "completed",
          completedAt: new Date(),
        },
      });
    } else {
      await tx.userProgress.create({
        data: {
          userId: session.user.id,
          lessonId: lesson.id,
          status: "completed",
          completedAt: new Date(),
        },
      });
    }

    await tx.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        points: {
          increment: lesson.xpReward,
        },
      },
    });
  });

  revalidatePath("/learn");
  revalidatePath(`/learn/${lessonSlug}`);

  redirect(`/learn/${lessonSlug}?quiz=passed`);
}

export default async function LessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ quiz?: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { slug } = await params;
  const { quiz } = await searchParams;

  const lesson = await prisma.lesson.findUnique({
    where: {
      slug,
    },
    include: {
      role: true,
      module: {
        include: {
          course: true,
        },
      },
      progress: {
        where: {
          userId: session.user.id,
          status: "completed",
        },
        take: 1,
      },
      quizQuestions: {
        orderBy: {
          order: "asc",
        },
        include: {
          choices: {
            orderBy: {
              order: "asc",
            },
          },
        },
      },
    },
  });

  if (!lesson) {
    notFound();
  }

  const isCompleted = lesson.progress.length > 0;
  const quizQuestion = lesson.quizQuestions[0];

  return (
    <div className="space-y-8">
      <section className="osiris-panel p-8">
        <Link
          href="/learn"
          className="text-sm font-medium text-yellow-400 hover:text-yellow-300"
        >
          ← Back to Learning Path
        </Link>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="osiris-eyebrow">
              {lesson.module?.title ?? lesson.role.name}
            </p>

            <h1 className="mt-3 osiris-title">{lesson.title}</h1>

            <p className="mt-4 max-w-3xl osiris-subtitle">
              {lesson.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="osiris-badge">{lesson.difficulty}</span>

              <span className="osiris-badge-dark">
                {lesson.role.name}
              </span>

              {lesson.module?.course.certification && (
                <span className="osiris-badge-dark">
                  {lesson.module.course.certification}
                </span>
              )}

              {isCompleted && (
                <span className="osiris-badge">Completed</span>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-yellow-500/20 bg-black px-5 py-4 text-center">
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              Reward
            </p>

            <p className="mt-2 text-2xl font-bold text-yellow-400">
              {lesson.xpReward} XP
            </p>
          </div>
        </div>
      </section>

      <section className="osiris-card">
        <p className="osiris-eyebrow">Lesson Content</p>

        <div className="mt-5 whitespace-pre-wrap text-base leading-8 text-zinc-300">
          {lesson.content}
        </div>
      </section>

      <section className="osiris-card">
        <p className="osiris-eyebrow">Knowledge Check</p>

        <h2 className="mt-3 text-2xl font-bold text-white">
          Lesson Quiz
        </h2>

        {isCompleted ? (
          <>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              You passed this knowledge check and earned {lesson.xpReward} XP.
            </p>

            <div className="mt-5 inline-flex rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-5 py-3 font-bold text-yellow-400">
              Lesson Completed
            </div>

            {quizQuestion?.explanation && (
              <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  Explanation
                </p>

                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  {quizQuestion.explanation}
                </p>
              </div>
            )}
          </>
        ) : !quizQuestion ? (
          <div className="mt-5 rounded-xl border border-dashed border-zinc-800 bg-black/40 p-5">
            <p className="text-sm text-zinc-400">
              No quiz has been assigned to this lesson yet.
            </p>
          </div>
        ) : (
          <>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Select the correct answer to complete the lesson and earn XP.
            </p>

            {quiz === "incorrect" && (
              <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <p className="font-bold text-red-300">
                  Incorrect answer
                </p>

                <p className="mt-2 text-sm text-red-200/80">
                  Review the lesson content and try again.
                </p>
              </div>
            )}

            {quiz === "missing-answer" && (
              <div className="mt-5 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
                <p className="font-bold text-yellow-300">
                  Select an answer before submitting.
                </p>
              </div>
            )}

            {quiz === "invalid-answer" && (
              <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <p className="font-bold text-red-300">
                  That answer could not be validated.
                </p>
              </div>
            )}

            <form action={submitQuiz} className="mt-6 space-y-5">
              <input type="hidden" name="lessonId" value={lesson.id} />
              <input
                type="hidden"
                name="lessonSlug"
                value={lesson.slug}
              />
              <input
                type="hidden"
                name="questionId"
                value={quizQuestion.id}
              />

              <fieldset>
                <legend className="text-lg font-bold text-white">
                  {quizQuestion.question}
                </legend>

                <div className="mt-5 space-y-3">
                  {quizQuestion.choices.map((choice) => (
                    <label
                      key={choice.id}
                      className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4 transition hover:border-yellow-500/30"
                    >
                      <input
                        type="radio"
                        name="choiceId"
                        value={choice.id}
                        required
                        className="mt-1"
                      />

                      <span className="text-sm leading-6 text-zinc-300">
                        {choice.text}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <button
                type="submit"
                className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-5 py-3 font-bold text-yellow-400 transition hover:bg-yellow-500/20"
              >
                Submit Answer
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}