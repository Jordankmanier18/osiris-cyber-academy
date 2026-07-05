import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";

const quickLinks = [
  {
    title: "Learn",
    href: "/learn",
    description: "Open course modules, lessons, and study paths.",
  },
  {
    title: "Missions",
    href: "/missions",
    description: "Start hands-on cybersecurity challenges.",
  },
  {
    title: "Labs",
    href: "/labs",
    description: "Launch safe cyber range training environments.",
  },
  {
    title: "Tickets",
    href: "/tickets",
    description: "Work real-world cybersecurity task tickets.",
  },
];

export default function DashboardPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-7xl space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
            Osiris Cyber Academy
          </p>
          <h1 className="mt-3 text-4xl font-bold">
            Student Command Center
          </h1>
          <p className="mt-3 max-w-2xl text-gray-400">
            Track your learning, launch cyber labs, complete missions, work
            tickets, and build real-world cybersecurity skills.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-sm text-gray-400">Current Course</p>
            <h2 className="mt-2 text-2xl font-semibold">Cyber Foundations</h2>
            <p className="mt-3 text-gray-400">
              Learn computing, networking, security, and real-world cyber operations.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-sm text-gray-400">Active Mission</p>
            <h2 className="mt-2 text-2xl font-semibold">Linux Basics Lab</h2>
            <p className="mt-3 text-gray-400">
              Complete terminal-based tasks and submit your first flag.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-sm text-gray-400">Student XP</p>
            <h2 className="mt-2 text-2xl font-semibold">0 Points</h2>
            <p className="mt-3 text-gray-400">
              Points increase as students complete lessons, labs, tickets, and missions.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-cyan-900/60 bg-cyan-950/20 p-6 transition hover:border-cyan-400 hover:bg-cyan-950/40"
            >
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-400">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
