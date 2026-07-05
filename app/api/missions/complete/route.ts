import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const missionId = body.missionId;
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

    const correctAnswer = String(mission.flag || "").trim();

    if (!correctAnswer) {
      return NextResponse.json(
        { error: "This mission does not have a correct answer set yet." },
        { status: 400 }
      );
    }

    if (submittedAnswer.toLowerCase() !== correctAnswer.toLowerCase()) {
      return NextResponse.json(
        { error: "That answer is not correct yet. Try again." },
        { status: 400 }
      );
    }

    const profile = await prisma.profile.findFirst();

    if (!profile) {
      return NextResponse.json(
        { error: "Student profile not found." },
        { status: 404 }
      );
    }

    const existingSubmission = await prisma.submission.findFirst({
      where: {
        missionId: mission.id,
        profileId: profile.id,
      },
    });

    if (existingSubmission) {
      return NextResponse.json({
        success: true,
        message: "Mission already completed.",
      });
    }

    await prisma.$transaction([
      prisma.submission.create({
        data: {
          missionId: mission.id,
          profileId: profile.id,
          answer: submittedAnswer,
          isCorrect: true,
        },
      }),
      prisma.profile.update({
        where: {
          id: profile.id,
        },
        data: {
          xp: {
            increment: mission.points,
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Mission completed.",
      xpAwarded: mission.points,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to complete mission." },
      { status: 500 }
    );
  }
}
