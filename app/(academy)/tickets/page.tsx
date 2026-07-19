const tickets = [
  {
    id: "OSR-101",
    title: "Investigate suspicious login activity",
    priority: "Medium",
    status: "Open",
  },
  {
    id: "OSR-102",
    title: "Review exposed service on Linux host",
    priority: "High",
    status: "Open",
  },
  {
    id: "OSR-103",
    title: "Document remediation steps for weak password policy",
    priority: "Low",
    status: "Draft",
  },
];

export default function TicketsPage() {
  return (
    <section className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Tickets</h1>
          <p className="mt-4 max-w-2xl text-gray-400">
            Real-world work-order style assignments that prepare students for cybersecurity jobs.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-950">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="grid gap-4 border-b border-gray-800 p-6 last:border-b-0 md:grid-cols-4"
            >
              <p className="text-cyan-400">{ticket.id}</p>
              <p className="md:col-span-2">{ticket.title}</p>
              <p className="text-gray-400">
                {ticket.priority} · {ticket.status}
              </p>
            </div>
          ))}
        </div>
    </section>
  );
}
