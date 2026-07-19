import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { getCapstoneByRole } from "@/lib/capstone-tickets";
import { prisma } from "@/lib/prisma";
import { lockUserForProgression } from "@/lib/progression";

async function submitQuiz(formData: FormData): Promise<void> {
  "use server";

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const lessonId = String(formData.get("lessonId") || "").trim();
  const lessonSlug = String(formData.get("lessonSlug") || "").trim();

  if (!lessonId || !lessonSlug) {
    redirect("/learn");
  }

  const [lesson, user] = await Promise.all([
    prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
      select: {
        id: true,
        slug: true,
        xpReward: true,
        role: {
          select: {
            level: true,
          },
        },
        quizQuestions: {
          orderBy: { order: "asc" },
          select: { id: true },
        },
      },
    }),
    prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        role: {
          select: {
            level: true,
          },
        },
      },
    }),
  ]);

  if (!lesson || lesson.slug !== lessonSlug) {
    throw new Error("Lesson not found.");
  }

  if (!user?.role || user.role.level < lesson.role.level) {
    redirect("/learn");
  }

  if (lesson.quizQuestions.length === 0) {
    redirect(`/learn/${lessonSlug}?quiz=unavailable`);
  }

  const selectedChoiceByQuestion = new Map(
    lesson.quizQuestions.map((question) => [
      question.id,
      String(formData.get(`question-${question.id}`) || "").trim(),
    ]),
  );

  if ([...selectedChoiceByQuestion.values()].some((choiceId) => !choiceId)) {
    redirect(`/learn/${lessonSlug}?quiz=missing-answer`);
  }

  const selectedChoices = await prisma.quizChoice.findMany({
    where: {
      id: { in: [...selectedChoiceByQuestion.values()] },
      questionId: { in: lesson.quizQuestions.map((question) => question.id) },
    },
    select: {
      id: true,
      questionId: true,
      isCorrect: true,
    },
  });
  const answerByQuestion = new Map(
    selectedChoices.map((choice) => [choice.questionId, choice]),
  );
  const answersAreValid = lesson.quizQuestions.every((question) => {
    const selectedChoiceId = selectedChoiceByQuestion.get(question.id);
    const answer = answerByQuestion.get(question.id);

    return Boolean(answer && answer.id === selectedChoiceId);
  });

  if (!answersAreValid) {
    redirect(`/learn/${lessonSlug}?quiz=invalid-answer`);
  }

  if ([...answerByQuestion.values()].some((answer) => !answer.isCorrect)) {
    redirect(`/learn/${lessonSlug}?quiz=incorrect`);
  }

  await prisma.$transaction(async (tx) => {
    await lockUserForProgression(tx, session.user.id);

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

  const [lesson, user] = await Promise.all([
    prisma.lesson.findUnique({
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
    }),
    prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        role: {
          select: {
            level: true,
          },
        },
      },
    }),
  ]);

  if (!lesson) {
    notFound();
  }

  if (!user?.role || user.role.level < lesson.role.level) {
    notFound();
  }

  const isCompleted = lesson.progress.length > 0;
  const quizQuestions = lesson.quizQuestions;
  const promotionDefinition = getCapstoneByRole(lesson.role.slug);
  const lessonSequence = promotionDefinition?.requiredLessonSlugs ?? [];
  const lessonIndex = lessonSequence.indexOf(lesson.slug);
  const nextLessonSlug =
    lessonIndex >= 0 ? lessonSequence[lessonIndex + 1] : undefined;

  return (
    <div className="space-y-8">
      <section className="osiris-panel p-8">
        <Link
          href={`/learn?district=${lesson.role.slug}`}
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

              <span className="osiris-badge-dark">{lesson.role.name}</span>

              {lesson.module?.course.certification && (
                <span className="osiris-badge-dark">
                  {lesson.module.course.certification}
                </span>
              )}

              {isCompleted && <span className="osiris-badge">Completed</span>}
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

        <h2 className="mt-3 text-2xl font-bold text-white">Lesson Quiz</h2>

        {isCompleted ? (
          <>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              You passed this knowledge check and earned {lesson.xpReward} XP.
            </p>

            <div className="mt-5 inline-flex rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-5 py-3 font-bold text-yellow-400">
              Lesson Completed
            </div>

            <div className="mt-5 space-y-3">
              {quizQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                >
                  <p className="text-xs uppercase tracking-widest text-zinc-500">
                    Question {index + 1} explanation
                  </p>

                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    {question.explanation}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {nextLessonSlug ? (
                <Link
                  href={`/learn/${nextLessonSlug}`}
                  className="osiris-button"
                >
                  Continue to next lesson
                </Link>
              ) : promotionDefinition ? (
                <Link href="/city" className="osiris-button">
                  Enter Mission Training City
                </Link>
              ) : null}

              <Link
                href={`/learn?district=${lesson.role.slug}`}
                className="osiris-button-secondary"
              >
                Return to learning path
              </Link>
            </div>
          </>
        ) : quizQuestions.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-zinc-800 bg-black/40 p-5">
            <p className="text-sm text-zinc-400">
              No quiz has been assigned to this lesson yet.
            </p>
          </div>
        ) : (
          <>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Answer all {quizQuestions.length} questions correctly to complete
              the lesson and earn XP.
            </p>

            {quiz === "incorrect" && (
              <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <p className="font-bold text-red-300">Incorrect answer</p>

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

            {quiz === "unavailable" && (
              <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <p className="font-bold text-red-300">
                  This knowledge check is not available yet.
                </p>
              </div>
            )}

            <form action={submitQuiz} className="mt-6 space-y-5">
              <input type="hidden" name="lessonId" value={lesson.id} />
              <input type="hidden" name="lessonSlug" value={lesson.slug} />

              {quizQuestions.map((question, questionIndex) => (
                <fieldset
                  key={question.id}
                  className="rounded-2xl border border-zinc-800 bg-black/40 p-5"
                >
                  <legend className="px-2 text-lg font-bold text-white">
                    {questionIndex + 1}. {question.question}
                  </legend>

                  <div className="mt-4 space-y-3">
                    {question.choices.map((choice) => (
                      <label
                        key={choice.id}
                        className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4 transition hover:border-yellow-500/30 has-[:checked]:border-yellow-400 has-[:checked]:bg-yellow-400/10"
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={choice.id}
                          required
                          className="mt-1 accent-yellow-400"
                        />

                        <span className="text-sm leading-6 text-zinc-300">
                          {choice.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}

              <button
                type="submit"
                className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-5 py-3 font-bold text-yellow-400 transition hover:bg-yellow-500/20"
              >
                Submit Knowledge Check
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
