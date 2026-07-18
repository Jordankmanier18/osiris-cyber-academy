"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  Banknote,
  Building2,
  Camera,
  CheckCircle2,
  CircleAlert,
  Database,
  DoorOpen,
  Flame,
  Home,
  KeyRound,
  LockKeyhole,
  Play,
  RotateCcw,
  Server,
  Shield,
  ShieldCheck,
} from "lucide-react";

type Control = {
  id: string;
  label: string;
  description: string;
  score: number;
};

type Mission = {
  id: string;
  title: string;
  briefing: string;
  objective: string;
  requiredLevel: number;
  requiredRole: string;
  targetAsset: string;
  attackPath: string[];
  controls: Control[];
};

const missions: Mission[] = [
  {
    id: "open-ssh-door",
    title: "Open SSH Door",
    briefing: "The Payroll App Server is exposing SSH to the entire internet.",
    objective: "Restrict the door and replace password access before the attacker arrives.",
    requiredLevel: 1,
    requiredRole: "Cyber Cadet",
    targetAsset: "Payroll App Server",
    attackPath: ["Internet Gate", "Payroll App Server", "Payroll Bank"],
    controls: [
      { id: "nsg", label: "Restrict NSG rule", description: "Allow SSH only from the administrator network.", score: 25 },
      { id: "ssh-key", label: "Require SSH key", description: "Disable password-based server access.", score: 20 },
      { id: "logging", label: "Enable sign-in logging", description: "Send access events to the SOC Police Station.", score: 15 },
    ],
  },
  {
    id: "unpatched-workstation",
    title: "Unpatched Workstation",
    briefing: "An employee house is missing critical updates and endpoint protection.",
    objective: "Patch the workstation and activate its local defenses.",
    requiredLevel: 2,
    requiredRole: "IT Support Trainee",
    targetAsset: "Employee House",
    attackPath: ["Phishing Mailbox", "Employee House", "Payroll App Server"],
    controls: [
      { id: "patch", label: "Install security updates", description: "Close known workstation vulnerabilities.", score: 25 },
      { id: "defender", label: "Enable Defender", description: "Turn on endpoint detection and protection.", score: 25 },
      { id: "mfa", label: "Require MFA", description: "Protect the employee identity from password theft.", score: 15 },
    ],
  },
  {
    id: "public-database",
    title: "Public Database",
    briefing: "The Payroll Bank accepts traffic from outside the city network.",
    objective: "Remove public access and monitor every attempt to reach payroll data.",
    requiredLevel: 3,
    requiredRole: "Network Support Trainee",
    targetAsset: "Payroll Bank",
    attackPath: ["Internet Gate", "Public Endpoint", "Payroll Bank"],
    controls: [
      { id: "private-endpoint", label: "Create private endpoint", description: "Move database access onto a private city road.", score: 30 },
      { id: "firewall", label: "Close public firewall", description: "Deny database traffic from the internet.", score: 25 },
      { id: "audit", label: "Enable database auditing", description: "Record queries and failed connections.", score: 15 },
    ],
  },
  {
    id: "stolen-secret",
    title: "Stolen Secret",
    briefing: "A deployment secret was copied from the Key Vault into application code.",
    objective: "Rotate the secret, remove the exposed copy, and enforce least privilege.",
    requiredLevel: 4,
    requiredRole: "Security Trainee",
    targetAsset: "Key Vault",
    attackPath: ["Payroll App Server", "Exposed Secret", "Key Vault"],
    controls: [
      { id: "rotate", label: "Rotate secret", description: "Invalidate the exposed credential immediately.", score: 25 },
      { id: "managed-identity", label: "Use managed identity", description: "Remove the secret from application code.", score: 30 },
      { id: "rbac", label: "Enforce vault RBAC", description: "Grant only the permissions the application needs.", score: 20 },
    ],
  },
];

type AssetId = "employee" | "admin" | "server" | "bank" | "soc" | "vault";

const assets: Record<AssetId, { name: string; meaning: string }> = {
  employee: { name: "Employee House", meaning: "Workstation and user identity" },
  admin: { name: "Administrator House", meaning: "Privileged workstation" },
  server: { name: "Payroll App Server", meaning: "Linux business application server" },
  bank: { name: "Payroll Bank", meaning: "Sensitive payroll database" },
  soc: { name: "SOC Police Station", meaning: "Security monitoring and response" },
  vault: { name: "Key Vault", meaning: "Secrets, keys, and certificates" },
};

export function TrainingCitySimulator({
  operativeName,
  roleName,
  roleLevel,
  academyXp,
}: {
  operativeName: string;
  roleName: string;
  roleLevel: number;
  academyXp: number;
}) {
  const firstUnlocked = missions.find((mission) => mission.requiredLevel <= roleLevel) ?? missions[0];
  const [missionId, setMissionId] = useState(firstUnlocked.id);
  const [selectedAsset, setSelectedAsset] = useState<AssetId>("server");
  const [enabledControls, setEnabledControls] = useState<string[]>([]);
  const [attackState, setAttackState] = useState<"ready" | "blocked" | "breached">("ready");
  const [events, setEvents] = useState<string[]>([
    "City simulation online.",
    `Clearance confirmed: ${roleName}.`,
  ]);

  const mission = missions.find((item) => item.id === missionId) ?? firstUnlocked;
  const secureScore = useMemo(
    () => Math.min(100, 25 + mission.controls.filter((control) => enabledControls.includes(control.id)).reduce((total, control) => total + control.score, 0)),
    [enabledControls, mission],
  );
  const threatLevel = attackState === "breached" ? "Critical" : secureScore >= 70 ? "Low" : secureScore >= 45 ? "Elevated" : "High";

  function selectMission(nextMission: Mission) {
    if (nextMission.requiredLevel > roleLevel) return;
    setMissionId(nextMission.id);
    setEnabledControls([]);
    setAttackState("ready");
    setEvents([`Mission loaded: ${nextMission.title}.`, nextMission.briefing]);
    setSelectedAsset(nextMission.id === "unpatched-workstation" ? "employee" : nextMission.id === "public-database" ? "bank" : nextMission.id === "stolen-secret" ? "vault" : "server");
  }

  function toggleControl(control: Control) {
    setEnabledControls((current) => {
      const enabled = current.includes(control.id);
      setEvents((items) => [`${enabled ? "Removed" : "Applied"} control: ${control.label}.`, ...items].slice(0, 8));
      setAttackState("ready");
      return enabled ? current.filter((id) => id !== control.id) : [...current, control.id];
    });
  }

  function launchAttack() {
    const blocked = enabledControls.length === mission.controls.length;
    setAttackState(blocked ? "blocked" : "breached");
    setEvents((items) => [
      blocked
        ? `Attack blocked at ${mission.targetAsset}. Mission objective complete.`
        : `Attack reached ${mission.targetAsset}. Apply every recommended control and retry.`,
      `Attack path: ${mission.attackPath.join(" → ")}.`,
      ...items,
    ].slice(0, 8));
  }

  function resetMission() {
    setEnabledControls([]);
    setAttackState("ready");
    setEvents([`Mission reset: ${mission.title}.`, mission.briefing]);
  }

  return (
    <div className="space-y-5 pb-8">
      <header className="osiris-panel overflow-hidden p-5 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="osiris-eyebrow">Live Cyber Range // OSR-CITY-01</p>
            <h1 className="mt-2 text-3xl font-black text-white md:text-4xl">Mission Training City</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">Protect the town by translating familiar city defenses into real cybersecurity controls.</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Hud label="Operative" value={operativeName} />
            <Hud label="Role" value={roleName} gold />
            <Hud label="Secure score" value={`${secureScore}%`} gold />
            <Hud label="Threat" value={threatLevel} danger={threatLevel === "Critical" || threatLevel === "High"} />
          </div>
        </div>
      </header>

      <div className="grid gap-5 2xl:grid-cols-[18rem_minmax(36rem,1fr)_21rem]">
        <aside className="osiris-panel p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="osiris-eyebrow">Assignments</p>
              <h2 className="mt-1 text-xl font-black">Mission Queue</h2>
            </div>
            <span className="osiris-badge">{academyXp} XP</span>
          </div>
          <div className="mt-4 space-y-3">
            {missions.map((item, index) => {
              const unlocked = item.requiredLevel <= roleLevel;
              const active = item.id === mission.id;
              return (
                <button key={item.id} type="button" onClick={() => selectMission(item)} disabled={!unlocked} className={`w-full rounded-2xl border p-4 text-left transition ${active ? "border-yellow-400 bg-yellow-400/10" : unlocked ? "border-zinc-800 bg-black hover:border-yellow-400/40" : "cursor-not-allowed border-zinc-900 bg-black/50 opacity-50"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Mission {String(index + 1).padStart(2, "0")}</span>
                    {unlocked ? <CheckCircle2 className="h-4 w-4 text-yellow-400" /> : <LockKeyhole className="h-4 w-4 text-zinc-600" />}
                  </div>
                  <p className="mt-2 font-bold text-white">{item.title}</p>
                  <p className="mt-2 text-xs leading-5 text-zinc-500">{unlocked ? item.briefing : `Requires ${item.requiredRole}`}</p>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="space-y-5">
          <section className="relative min-h-[640px] overflow-hidden rounded-[2rem] border border-yellow-500/20 bg-[#07110c] shadow-2xl shadow-black/60">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(250,204,21,.08) 1px, transparent 1px),linear-gradient(90deg,rgba(250,204,21,.08) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
            <div className="absolute left-[8%] right-[8%] top-[47%] h-16 rounded-xl border-y border-yellow-400/20 bg-zinc-800/80" />
            <div className="absolute bottom-[8%] left-[46%] top-[8%] w-16 rounded-xl border-x border-yellow-400/20 bg-zinc-800/80" />
            <div className="absolute left-5 top-5 z-20 max-w-md rounded-2xl border border-yellow-400/25 bg-black/90 p-4 backdrop-blur">
              <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-yellow-400" /><p className="text-xs font-black uppercase tracking-widest text-yellow-400">Active mission</p></div>
              <h2 className="mt-2 text-xl font-black">{mission.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{mission.objective}</p>
            </div>

            <TownAsset id="employee" icon={Home} label="Employee House" subtitle="Workstation" className="left-[7%] top-[28%]" selected={selectedAsset === "employee"} onSelect={setSelectedAsset} />
            <TownAsset id="admin" icon={Home} label="Admin House" subtitle="Privileged endpoint" className="left-[11%] bottom-[9%]" selected={selectedAsset === "admin"} onSelect={setSelectedAsset} />
            <TownAsset id="server" icon={Server} label="Payroll App" subtitle="Linux server" className="left-[39%] top-[29%]" selected={selectedAsset === "server"} onSelect={setSelectedAsset} warning={mission.targetAsset === "Payroll App Server"} />
            <TownAsset id="bank" icon={Banknote} label="Payroll Bank" subtitle="Database" className="right-[7%] top-[24%]" selected={selectedAsset === "bank"} onSelect={setSelectedAsset} warning={mission.targetAsset === "Payroll Bank"} />
            <TownAsset id="soc" icon={ShieldCheck} label="SOC Police" subtitle="Monitoring" className="right-[10%] bottom-[8%]" selected={selectedAsset === "soc"} onSelect={setSelectedAsset} />
            <TownAsset id="vault" icon={KeyRound} label="Key Vault" subtitle="Secrets" className="left-[42%] bottom-[8%]" selected={selectedAsset === "vault"} onSelect={setSelectedAsset} warning={mission.targetAsset === "Key Vault"} />

            <div className="absolute right-5 top-5 z-20 flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs font-black uppercase tracking-wider text-red-400"><Flame className="h-4 w-4" /> Threat actor</div>
            <div className={`absolute inset-x-5 bottom-5 z-30 rounded-2xl border p-4 text-center font-black transition ${attackState === "blocked" ? "border-green-400/40 bg-green-500/15 text-green-400" : attackState === "breached" ? "border-red-400/40 bg-red-500/15 text-red-400" : "pointer-events-none translate-y-8 border-transparent bg-transparent text-transparent opacity-0"}`}>
              {attackState === "blocked" ? "ATTACK BLOCKED — CITY DEFENSES HELD" : "BREACH DETECTED — REVIEW THE MISSING CONTROLS"}
            </div>
          </section>

          <section className="osiris-panel p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="osiris-eyebrow">Attack path</p><p className="mt-1 text-sm text-zinc-300">{mission.attackPath.join("  →  ")}</p></div>
              <div className="flex gap-2"><button type="button" onClick={launchAttack} className="osiris-button gap-2"><Play className="h-4 w-4" />Launch attack</button><button type="button" onClick={resetMission} className="osiris-button-secondary gap-2"><RotateCcw className="h-4 w-4" />Reset</button></div>
            </div>
          </section>
        </main>

        <aside className="space-y-5">
          <section className="osiris-panel p-5">
            <p className="osiris-eyebrow">Selected Asset</p>
            <h2 className="mt-2 text-xl font-black">{assets[selectedAsset].name}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{assets[selectedAsset].meaning}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs"><Metaphor icon={DoorOpen} label="Doors" value="Ports" /><Metaphor icon={Shield} label="Guards" value="Firewall" /><Metaphor icon={Camera} label="Cameras" value="Logs" /><Metaphor icon={Database} label="Vaults" value="Data" /></div>
          </section>

          <section className="osiris-panel p-5">
            <p className="osiris-eyebrow">Available Controls</p>
            <div className="mt-4 space-y-3">
              {mission.controls.map((control) => {
                const enabled = enabledControls.includes(control.id);
                return <button key={control.id} type="button" onClick={() => toggleControl(control)} className={`w-full rounded-2xl border p-4 text-left transition ${enabled ? "border-green-400/35 bg-green-500/10" : "border-zinc-800 bg-black hover:border-yellow-400/40"}`}><div className="flex items-center justify-between gap-3"><span className="font-bold text-white">{control.label}</span><span className={`flex h-6 w-6 items-center justify-center rounded-full ${enabled ? "bg-green-400 text-black" : "bg-zinc-800 text-zinc-500"}`}>{enabled ? <CheckCircle2 className="h-4 w-4" /> : <CircleAlert className="h-4 w-4" />}</span></div><p className="mt-2 text-xs leading-5 text-zinc-500">{control.description}</p></button>;
              })}
            </div>
          </section>

          <section className="osiris-panel p-5">
            <p className="osiris-eyebrow">Event Timeline</p>
            <ol className="mt-4 space-y-3">{events.map((event, index) => <li key={`${event}-${index}`} className="flex gap-3 text-xs leading-5 text-zinc-400"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-yellow-400" /><span>{event}</span></li>)}</ol>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Hud({ label, value, gold = false, danger = false }: { label: string; value: string; gold?: boolean; danger?: boolean }) {
  return <div className="min-w-32 rounded-2xl border border-yellow-500/15 bg-black p-3"><p className="text-[.6rem] font-black uppercase tracking-widest text-zinc-600">{label}</p><p className={`mt-1 truncate text-sm font-black ${danger ? "text-red-400" : gold ? "text-yellow-400" : "text-white"}`}>{value}</p></div>;
}

function TownAsset({ id, icon: Icon, label, subtitle, className, selected, warning = false, onSelect }: { id: AssetId; icon: typeof Building2; label: string; subtitle: string; className: string; selected: boolean; warning?: boolean; onSelect: (id: AssetId) => void }) {
  return <button type="button" onClick={() => onSelect(id)} className={`absolute z-10 w-36 rounded-2xl border p-4 text-center shadow-2xl transition hover:-translate-y-1 ${className} ${selected ? "border-yellow-400 bg-yellow-400/15" : warning ? "border-red-400/50 bg-red-500/10" : "border-yellow-500/20 bg-black/90"}`}><Icon className={`mx-auto h-9 w-9 ${warning ? "text-red-400" : "text-yellow-400"}`} /><p className="mt-2 text-sm font-black text-white">{label}</p><p className="mt-1 text-[.65rem] uppercase tracking-wider text-zinc-500">{subtitle}</p>{warning && <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"><CircleAlert className="h-4 w-4" /></span>}</button>;
}

function Metaphor({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) {
  return <div className="rounded-xl border border-yellow-500/10 bg-black p-3"><Icon className="h-4 w-4 text-yellow-400" /><p className="mt-2 text-zinc-500">{label}</p><p className="font-bold text-white">{value}</p></div>;
}
