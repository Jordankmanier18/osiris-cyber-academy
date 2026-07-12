import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { prisma } from "@/lib/prisma";

export default async function MissionsPage() {
  const missions = await prisma.mission.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Missions</h1>
          <p className="mt-2 text-muted-foreground">
            Choose a mission, investigate the scenario, and submit your findings.
          </p>
        </div>

        <div className="grid gap-4">
          {missions.map((mission) => (
            <Link
              key={mission.id}
              href={`/missions/${mission.slug}`}
              className="block rounded-lg border p-4 transition hover:bg-muted"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold">{mission.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {mission.description}
                  </p>
                </div>

                <div className="text-right text-sm">
                  <p className="font-medium">{mission.difficulty}</p>
                  <p className="text-muted-foreground">{mission.xpReward} XP</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}