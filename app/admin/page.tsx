import { AppShell } from "@/components/layout/app-shell";

const adminCards = [
  {
    title: "Courses",
    description: "Create and manage course paths like Cyber Foundations and SOC Analyst.",
  },
  {
    title: "Missions",
    description: "Build hands-on challenges with XP, difficulty, and completion rules.",
  },
  {
    title: "Labs",
    description: "Define cyber range environments students can launch.",
  },
  {
    title: "Tickets",
    description: "Create real-world work-order assignments for students.",
  },
];

export default function AdminPage() {
  return (
    <AppShell>
      <section className="space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
            Admin Console
          </p>
          <h1 className="mt-3 text-4xl font-bold">Platform Management</h1>
          <p className="mt-4 max-w-2xl text-gray-400">
            Manage courses, missions, labs, tickets, and student progress for Osiris Cyber Academy.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {adminCards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-gray-800 bg-gray-950 p-6"
            >
              <h2 className="text-2xl font-semibold">{card.title}</h2>
              <p className="mt-3 text-gray-400">{card.description}</p>
              <button className="mt-6 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-black">
                Manage
              </button>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
