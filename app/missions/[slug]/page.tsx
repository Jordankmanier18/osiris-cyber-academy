import CompleteMissionForm from "./complete-mission-form";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type MissionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function MissionPage({ params }: MissionPageProps) {
  const { slug } = await params;

  const mission = await prisma.mission.findFirst({
    where: {
      slug,
    },
  });

  if (!mission) {
    notFound();
  }

  return (
    <main className="p-8 max-w-4xl space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">Mission</p>
        <h1 className="text-4xl font-bold mt-2">{mission.title}</h1>

        <div className="flex gap-3 mt-4">
          <span className="rounded-full border px-3 py-1 text-sm">
            {mission.difficulty}
          </span>

          <span className="rounded-full border px-3 py-1 text-sm">
            {mission.points} XP
          </span>
        </div>
      </div>

      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Scenario</h2>
        <p className="text-muted-foreground leading-7">
          {mission.scenario || mission.description}
        </p>

        <CompleteMissionForm missionId={mission.id} />
      </section>

      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Objective</h2>
        <p className="text-muted-foreground">
          Read the scenario, investigate the issue, and submit the correct flag
          or answer.
        </p>

        <div className="rounded-lg border p-4">
          <p className="font-semibold">Submission form coming next.</p>
          <p className="text-sm text-muted-foreground mt-2">
            This page is now connected to the mission database.
          </p>
        </div>
      </section>
    </main>
  );
}
