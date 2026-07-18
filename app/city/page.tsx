import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { TrainingCitySimulator } from "@/components/city/training-city-simulator";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Mission Training City | Osiris Cyber Academy",
  description:
    "Protect a simulated cyber town through role-based security missions.",
};

export default async function CityPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
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
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <TrainingCitySimulator
      operativeName={user.name ?? user.email}
      roleName={user.role?.name ?? "Academy Recruit"}
      roleLevel={user.role?.level ?? 1}
      academyXp={user.points}
      initialProgress={user.cityProgress}
    />
  );
}
