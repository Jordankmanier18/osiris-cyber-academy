import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to complete a mission." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const missionId = String(body.missionId || "").trim();
    const submittedAnswer = String(body.answer || "").trim();

    if (!missionId || !submittedAnswer) {
      return NextResponse.json(
        { error: "Mission ID and answer are required." },
        { status: 400 }
      );
    }

    const mission = await prisma.mission.findUnique({
      where: {
        id: missionId,
      },
    });

    if (!mission) {
      return NextResponse.json(
        { error: "Mission not found." },
        { status: 404 }
      );
    }

    const correctAnswer = String(mission.expectedAnswer || "").trim();

    if (!correctAnswer) {
      return NextResponse.json(
        { error: "This mission does not have an expected answer set yet." },
        { status: 400 }
      );
    }

    const isCorrect =
      submittedAnswer.toLowerCase() === correctAnswer.toLowerCase();

    if (!isCorrect) {
      return NextResponse.json(
        {
          error:
            "That answer does not match the expected answer. Review the mission and try again.",
        },
        { status: 400 }
      );
    }

    const existingSubmission = await prisma.submission.findFirst({
      where: {
        missionId: mission.id,
        userId: session.user.id,
        score: {
          gt: 0,
        },
      },
    });

    if (existingSubmission) {
      return NextResponse.json({
        success: true,
        message: "Mission already completed.",
        xpAwarded: 0,
      });
    }

    await prisma.$transaction([
      prisma.submission.create({
        data: {
          missionId: mission.id,
          userId: session.user.id,
          answer: submittedAnswer,
          score: 100,
          feedback: "Correct answer. Mission completed successfully.",
        },
      }),

      prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          points: {
            increment: mission.xpReward,
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Mission completed.",
      xpAwarded: mission.xpReward,
    });
  } catch (error) {
    console.error("Mission completion error:", error);

    return NextResponse.json(
      { error: "Failed to complete mission." },
      { status: 500 }
    );
  }
}