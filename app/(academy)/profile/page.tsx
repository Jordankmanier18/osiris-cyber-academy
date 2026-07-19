import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      role: true,
      submissions: {
        include: {
          mission: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      progress: {
        include: {
          lesson: true,
          lab: true,
          ticket: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const completedProgress = user.progress.filter(
    (item) => item.status === "completed"
  );

  return (
    <main className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-sm text-muted-foreground">
            Your Osiris Cyber Academy account and training activity.
          </p>
        </div>

        <LogoutButton />
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Name</p>
          <p className="mt-1 font-semibold">{user.name || "No name set"}</p>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="mt-1 font-semibold">{user.email}</p>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Points</p>
          <p className="mt-1 font-semibold">{user.points} XP</p>
        </div>
      </section>

      <section className="rounded-xl border p-4">
        <h2 className="text-lg font-semibold">Current Role Track</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {user.role
            ? `${user.role.name} — ${user.role.description}`
            : "No role track assigned yet."}
        </p>
      </section>

      <section className="rounded-xl border p-4">
        <h2 className="text-lg font-semibold">Progress Summary</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Completed Items</p>
            <p className="text-2xl font-bold">{completedProgress.length}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Mission Submissions</p>
            <p className="text-2xl font-bold">{user.submissions.length}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Total Progress Items</p>
            <p className="text-2xl font-bold">{user.progress.length}</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border p-4">
        <h2 className="text-lg font-semibold">Recent Mission Submissions</h2>

        {user.submissions.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            You have not submitted any missions yet.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {user.submissions.map((submission) => (
              <div key={submission.id} className="rounded-lg border p-3">
                <p className="font-medium">{submission.mission.title}</p>
                <p className="text-sm text-muted-foreground">
                  Score: {submission.score ?? "Pending"} | Submitted:{" "}
                  {submission.createdAt.toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}