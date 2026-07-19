const students = [
  { rank: 1, name: "Demo Student", xp: 450, badge: "Cyber Starter" },
  { rank: 2, name: "Future Analyst", xp: 300, badge: "Linux Rookie" },
  { rank: 3, name: "SOC Trainee", xp: 200, badge: "Alert Hunter" },
];

export default function LeaderboardPage() {
  return (
    <section className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Leaderboard</h1>
          <p className="mt-4 max-w-2xl text-gray-400">
            Track student XP, badges, rankings, and training progress.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-950">
          {students.map((student) => (
            <div
              key={student.rank}
              className="grid gap-4 border-b border-gray-800 p-6 last:border-b-0 md:grid-cols-4"
            >
              <p className="text-cyan-400">#{student.rank}</p>
              <p className="font-semibold">{student.name}</p>
              <p className="text-gray-400">{student.xp} XP</p>
              <p className="text-gray-400">{student.badge}</p>
            </div>
          ))}
        </div>
    </section>
  );
}
