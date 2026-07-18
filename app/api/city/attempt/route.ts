import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import {
  calculateTrainingCityResult,
  getTrainingCityMission,
} from "@/lib/training-city-missions";
import { prisma } from "@/lib/prisma";

const attemptSchema = z.object({
  missionKey: z.string().trim().min(1).max(100),
  controlsApplied: z.array(z.string().trim().min(1).max(100)).max(20),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  const parsed = attemptSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid mission attempt." }, { status: 400 });
  }

  const mission = getTrainingCityMission(parsed.data.missionKey);

  if (!mission) {
    return NextResponse.json({ error: "Training mission not found." }, { status: 404 });
  }

  const submittedControls = parsed.data.controlsApplied;
  const requiredControlIds = new Set(
    mission.controls.map((control) => control.id),
  );

  if (
    new Set(submittedControls).size !== submittedControls.length ||
    submittedControls.some((controlId) => !requiredControlIds.has(controlId))
  ) {
    return NextResponse.json(
      { error: "The control selection contains an invalid value." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      role: { select: { level: true } },
      cityProgress: {
        where: { status: "completed" },
        select: { missionKey: true },
      },
    },
  });

  if (!user || (user.role?.level ?? 1) < mission.requiredLevel) {
    return NextResponse.json(
      { error: `This mission requires ${mission.requiredRole}.` },
      { status: 403 },
    );
  }

  const completedMissionKeys = new Set(
    user.cityProgress.map((progress) => progress.missionKey),
  );

  if (
    mission.prerequisiteMissionId &&
    !completedMissionKeys.has(mission.prerequisiteMissionId)
  ) {
    return NextResponse.json(
      { error: "Complete the previous city mission first." },
      { status: 403 },
    );
  }

  const result = calculateTrainingCityResult(
    mission,
    submittedControls,
  );
  const existing = await prisma.trainingCityProgress.findUnique({
    where: {
      userId_missionKey: {
        userId: session.user.id,
        missionKey: mission.id,
      },
    },
  });

  const progress = await prisma.trainingCityProgress.upsert({
    where: {
      userId_missionKey: {
        userId: session.user.id,
        missionKey: mission.id,
      },
    },
    create: {
      userId: session.user.id,
      missionKey: mission.id,
      status: "in_progress",
      attemptCount: 1,
      failedAttemptCount: result.blocked ? 0 : 1,
      bestScore: result.score,
      secureScore: result.secureScore,
      controlsApplied: result.validControls,
      lastAttackResult: result.blocked ? "blocked" : "breached",
      lastAttemptAt: new Date(),
    },
    update: {
      status: existing?.status === "completed" ? "completed" : "in_progress",
      attemptCount: { increment: 1 },
      failedAttemptCount: result.blocked ? undefined : { increment: 1 },
      bestScore: Math.max(existing?.bestScore ?? 0, result.score),
      secureScore: result.secureScore,
      controlsApplied: result.validControls,
      lastAttackResult: result.blocked ? "blocked" : "breached",
      lastAttemptAt: new Date(),
    },
  });

  return NextResponse.json({
    blocked: result.blocked,
    score: result.score,
    secureScore: result.secureScore,
    attemptCount: progress.attemptCount,
    failedAttemptCount: progress.failedAttemptCount,
  });
}
