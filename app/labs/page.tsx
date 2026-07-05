import { AppShell } from "@/components/layout/app-shell";

const labs = [
  {
    title: "Linux Terminal Sandbox",
    status: "Ready",
    description: "A safe beginner lab for practicing commands, files, permissions, and navigation.",
  },
  {
    title: "Windows Workstation Investigation",
    status: "Coming Soon",
    description: "Practice basic endpoint investigation and suspicious activity review.",
  },
  {
    title: "Web App Security 101",
    status: "Coming Soon",
    description: "Learn how common web vulnerabilities appear in real applications.",
  },
];

export default function LabsPage() {
  return (
    <AppShell>
      <section className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Labs</h1>
          <p className="mt-4 max-w-2xl text-gray-400">
            Launch safe training environments where students can build real technical skill.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {labs.map((lab) => (
            <div
              key={lab.title}
              className="rounded-2xl border border-gray-800 bg-gray-950 p-6"
            >
              <p className="text-sm text-cyan-400">{lab.status}</p>
              <h2 className="mt-3 text-2xl font-semibold">{lab.title}</h2>
              <p className="mt-3 text-gray-400">{lab.description}</p>
              <button className="mt-6 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-black">
                Launch Lab
              </button>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
