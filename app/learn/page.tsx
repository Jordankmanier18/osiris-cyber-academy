import { AppShell } from "@/components/layout/app-shell";

export default function LearnPage() {
  return (
    <AppShell>
      <section className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Learn</h1>
          <p className="mt-4 max-w-2xl text-gray-400">
            Course modules, lessons, and study paths will live here.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {["Cyber Foundations", "Networking Basics", "Linux Fundamentals"].map(
            (course) => (
              <div
                key={course}
                className="rounded-2xl border border-gray-800 bg-gray-950 p-6"
              >
                <p className="text-sm text-cyan-400">Course</p>
                <h2 className="mt-2 text-2xl font-semibold">{course}</h2>
                <p className="mt-3 text-gray-400">
                  Lessons, checkpoints, and practice activities will be added here.
                </p>
              </div>
            )
          )}
        </div>
      </section>
    </AppShell>
  );
}
