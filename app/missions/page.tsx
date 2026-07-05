import { AppShell } from "@/components/layout/app-shell";

const missions = [
  {
    title: "Linux Basics Lab",
    level: "Beginner",
    points: 100,
    description: "Use basic Linux commands to navigate files, inspect users, and find your first flag.",
  },
  {
    title: "Network Recon Mission",
    level: "Beginner",
    points: 150,
    description: "Identify open ports, services, and basic network information in a safe lab environment.",
  },
  {
    title: "SOC Alert Triage",
    level: "Beginner",
    points: 200,
    description: "Review a simulated security alert and decide whether it is a true positive or false positive.",
  },
];

export default function MissionsPage() {
  return (
    <AppShell>
      <section className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Missions</h1>
          <p className="mt-4 max-w-2xl text-gray-400">
            Hands-on cybersecurity challenges that turn lessons into real experience.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {missions.map((mission) => (
            <div
              key={mission.title}
              className="rounded-2xl border border-gray-800 bg-gray-950 p-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-cyan-400">{mission.level}</p>
                <p className="text-sm text-gray-400">{mission.points} XP</p>
              </div>
              <h2 className="mt-3 text-2xl font-semibold">{mission.title}</h2>
              <p className="mt-3 text-gray-400">{mission.description}</p>
              <button className="mt-6 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-black">
                Start Mission
              </button>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
