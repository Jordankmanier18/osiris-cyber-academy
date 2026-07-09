import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function submitMission(formData: FormData) {
  "use server";

  const missionId = formData.get("missionId") as string;
  const answer = formData.get("answer") as string;

  if (!missionId || !answer) {
    throw new Error("Mission ID and answer are required.");
  }

  const demoProfile = await prisma.profile.upsert({
  where: {
    email: "demo@student.osiris.local",
  },
  update: {},
  create: {
    email: "demo@student.osiris.local",
    fullName: "Demo Student",
    role: "STUDENT",
  },
});

const session = await auth();

if (!session?.user) {
  redirect("/login");
}

await prisma.submission.create({
  data: {
    answer,
    missionId: mission.id,
    userId: session.user.id,
  },
});

  redirect("/missions");
}

export default async function MissionSubmitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const mission = await prisma.mission.findFirst({
    where: {
      slug,
    },
  });

  if (!mission) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Mission Not Found</h1>
        <p className="text-muted-foreground">
          We could not find this mission.
        </p>
        <Link href="/missions" className="underline">
          Back to Missions
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/missions/${mission.slug}`} className="text-sm underline">
          ← Back to Mission
        </Link>

        <h1 className="mt-4 text-3xl font-bold">
          Submit Mission: {mission.title}
        </h1>

        <p className="mt-2 text-muted-foreground">
          Submit your answer or evidence for this mission.
        </p>
      </div>

      <form action={submitMission} className="rounded-lg border p-6 space-y-4">
        <input type="hidden" name="missionId" value={mission.id} />

        <div>
          <label className="text-sm font-medium">Submission</label>
          <textarea
            name="answer"
            required
            className="mt-2 min-h-32 w-full rounded-md border bg-background p-3 text-sm"
            placeholder="Paste your answer, command output, screenshot notes, or investigation summary here..."
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Submit Mission
        </button>
      </form>
    </div>
  );
}