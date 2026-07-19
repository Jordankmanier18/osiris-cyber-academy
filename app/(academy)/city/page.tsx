import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { TrainingCitySimulator } from "@/components/city/training-city-simulator";
import { prisma } from "@/lib/prisma";
import { getPromotionStatus } from "@/lib/progression";

export const metadata: Metadata = {
  title: "Mission Training City | Osiris Cyber Academy",
  description:
    "Protect a simulated cyber town through role-based security missions.",
};

export default async function CityPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/city");
  }

  const [user, promotionStatus] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        points: true,
        cityProgress: {
          select: {
            missionKey: true,
            status: true,
            attemptCount: true,
            bestScore: true,
          },
        },
        role: {
          select: {
            name: true,
            level: true,
          },
        },
      },
    }),
    getPromotionStatus(session.user.id),
  ]);

  if (!user) {
    redirect("/login?callbackUrl=/city");
  }

  return (
    <TrainingCitySimulator
      operativeName={user.name ?? user.email}
      roleName={user.role?.name ?? "Academy Recruit"}
      roleLevel={user.role?.level ?? 1}
      academyXp={user.points}
      initialProgress={user.cityProgress}
      promotionPath={
        promotionStatus?.available &&
        promotionStatus.definition &&
        promotionStatus.city.missionKey
          ? {
              missionKey: promotionStatus.city.missionKey,
              capstoneHref: `/tickets/${promotionStatus.definition.ticketCode}`,
              capstoneReady: promotionStatus.capstone.ready,
              remainingLessonCount:
                promotionStatus.lessons.total -
                promotionStatus.lessons.completed,
            }
          : null
      }
    />
  );
}
