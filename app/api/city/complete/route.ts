import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { getTrainingCityMission } from "@/lib/training-city-missions";
import { prisma } from "@/lib/prisma";
import { lockUserForProgression } from "@/lib/progression";

const completionSchema = z.object({
  missionKey: z.string().trim().min(1).max(100),
  reflection: z.string().trim().min(20).max(1500),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be logged in." },
      { status: 401 },
    );
  }

  const parsed = completionSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Write at least 20 characters in the after-action review." },
      { status: 400 },
    );
  }

  const mission = getTrainingCityMission(parsed.data.missionKey);

  if (!mission) {
    return NextResponse.json(
      { error: "Training mission not found." },
      { status: 404 },
    );
  }

  const existing = await prisma.trainingCityProgress.findUnique({
    where: {
      userId_missionKey: {
        userId: session.user.id,
        missionKey: mission.id,
      },
    },
  });

  if (!existing || existing.lastAttackResult !== "blocked") {
    return NextResponse.json(
      { error: "Block the latest attack test before completing the mission." },
      { status: 400 },
    );
  }

  const result = await prisma.$transaction(async (transaction) => {
    await lockUserForProgression(transaction, session.user.id);

    const claimed = await transaction.trainingCityProgress.updateMany({
      where: {
        userId: session.user.id,
        missionKey: mission.id,
        status: { not: "completed" },
        lastAttackResult: "blocked",
      },
      data: {
        status: "completed",
        reflection: parsed.data.reflection,
        xpAwarded: mission.xpReward,
        completedAt: new Date(),
      },
    });

    if (claimed.count === 1) {
      await transaction.user.update({
        where: { id: session.user.id },
        data: { points: { increment: mission.xpReward } },
      });
    } else {
      await transaction.trainingCityProgress.update({
        where: {
          userId_missionKey: {
            userId: session.user.id,
            missionKey: mission.id,
          },
        },
        data: { reflection: parsed.data.reflection },
      });
    }

    const [progress, user] = await Promise.all([
      transaction.trainingCityProgress.findUniqueOrThrow({
        where: {
          userId_missionKey: {
            userId: session.user.id,
            missionKey: mission.id,
          },
        },
      }),
      transaction.user.findUniqueOrThrow({
        where: { id: session.user.id },
        select: { points: true },
      }),
    ]);

    return {
      firstCompletion: claimed.count === 1,
      progress,
      totalXp: user.points,
    };
  });

  return NextResponse.json({
    success: true,
    firstCompletion: result.firstCompletion,
    xpAwarded: result.firstCompletion ? mission.xpReward : 0,
    totalXp: result.totalXp,
    score: result.progress.bestScore,
    secureScore: result.progress.secureScore,
    attemptCount: result.progress.attemptCount,
    failedAttemptCount: result.progress.failedAttemptCount,
    framework: mission.framework,
    debrief: mission.debrief,
  });
}
