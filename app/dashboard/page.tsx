import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {session.user.name || session.user.email}
          </p>
        </div>

        <LogoutButton />
      </div>

      <div className="rounded-xl border p-6">
        <h2 className="text-lg font-semibold">Your Training Progress</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your personalized progress, points, missions, labs, and lessons will
          appear here.
        </p>
      </div>
    </main>
  );
}