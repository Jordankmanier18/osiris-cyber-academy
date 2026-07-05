import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { prisma } from "@/lib/prisma";

export default async function AdminSubmissionsPage() {
  const submissions = await prisma.submission.findMany({
    include: {
      mission: true,
      profile: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <Link href="/admin" className="text-sm underline">
            ← Back to Admin
          </Link>

          <h1 className="mt-4 text-3xl font-bold">Submission Review</h1>

          <p className="mt-2 text-muted-foreground">
            Review student mission submissions and verify their answers.
          </p>
        </div>

        <div className="grid gap-4">
          {submissions.length === 0 ? (
            <div className="rounded-lg border p-6">
              <p className="font-medium">No submissions yet.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Student mission submissions will appear here.
              </p>
            </div>
          ) : (
            submissions.map((submission) => (
              <div key={submission.id} className="rounded-lg border p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold">
                      {submission.mission.title}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Submitted by {submission.profile.fullName}
                    </p>
                  </div>

                  <div className="text-right text-sm">
                    <p className="font-medium">
                      {submission.isCorrect ? "Correct" : "Pending Review"}
                    </p>
                    <p className="text-muted-foreground">
                      {submission.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-md bg-muted p-4">
                  <p className="text-sm whitespace-pre-wrap">
                    {submission.answer}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}