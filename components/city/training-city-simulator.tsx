"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Activity,
  Award,
  Banknote,
  Building2,
  Camera,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Database,
  DoorOpen,
  Flame,
  Home,
  KeyRound,
  Loader2,
  LockKeyhole,
  Play,
  RotateCcw,
  Server,
  Shield,
  ShieldCheck,
} from "lucide-react";
import {
  calculateTrainingCityResult,
  trainingCityMissions,
  type TrainingCityControl,
  type TrainingCityMission,
} from "@/lib/training-city-missions";

type AssetId = "employee" | "admin" | "server" | "bank" | "soc" | "vault";
type AttackState = "ready" | "blocked" | "breached";

type InitialProgress = {
  missionKey: string;
  status: string;
  attemptCount: number;
  bestScore: number;
};

type ProgressSummary = {
  status: string;
  attemptCount: number;
  bestScore: number;
};

type CompletionResult = {
  firstCompletion: boolean;
  xpAwarded: number;
  totalXp: number;
  score: number;
  secureScore: number;
  attemptCount: number;
  failedAttemptCount: number;
  framework: string;
  debrief: string;
};

const assets: Record<AssetId, { name: string; meaning: string }> = {
  employee: {
    name: "Employee House",
    meaning: "Workstation and user identity",
  },
  admin: {
    name: "Administrator House",
    meaning: "Privileged workstation",
  },
  server: {
    name: "Payroll App Server",
    meaning: "Linux business application server",
  },
  bank: { name: "Payroll Bank", meaning: "Sensitive payroll database" },
  soc: {
    name: "SOC Police Station",
    meaning: "Security monitoring and response",
  },
  vault: { name: "Key Vault", meaning: "Secrets, keys, and certificates" },
};

export function TrainingCitySimulator({
  operativeName,
  roleName,
  roleLevel,
  academyXp,
  initialProgress,
}: {
  operativeName: string;
  roleName: string;
  roleLevel: number;
  academyXp: number;
  initialProgress: InitialProgress[];
}) {
  const router = useRouter();
  const initialProgressMap = Object.fromEntries(
    initialProgress.map((progress) => [
      progress.missionKey,
      {
        status: progress.status,
        attemptCount: progress.attemptCount,
        bestScore: progress.bestScore,
      },
    ]),
  );
  const initialCompleted = new Set(
    initialProgress
      .filter((progress) => progress.status === "completed")
      .map((progress) => progress.missionKey),
  );
  const firstUnlocked =
    trainingCityMissions.find(
      (mission) =>
        mission.requiredLevel <= roleLevel &&
        (!mission.prerequisiteMissionId ||
          initialCompleted.has(mission.prerequisiteMissionId)) &&
        !initialCompleted.has(mission.id),
    ) ??
    [...trainingCityMissions]
      .reverse()
      .find(
        (mission) =>
          mission.requiredLevel <= roleLevel &&
          (!mission.prerequisiteMissionId ||
            initialCompleted.has(mission.prerequisiteMissionId)),
      ) ??
    trainingCityMissions[0];

  const [missionId, setMissionId] = useState(firstUnlocked.id);
  const [selectedAsset, setSelectedAsset] = useState<AssetId>("server");
  const [enabledControls, setEnabledControls] = useState<string[]>([]);
  const [attackState, setAttackState] = useState<AttackState>("ready");
  const [events, setEvents] = useState<string[]>([
    "City simulation online.",
    `Clearance confirmed: ${roleName}.`,
  ]);
  const [completedMissionIds, setCompletedMissionIds] = useState(initialCompleted);
  const [progressByMission, setProgressByMission] =
    useState<Record<string, ProgressSummary>>(initialProgressMap);
  const [currentXp, setCurrentXp] = useState(academyXp);
  const [reflection, setReflection] = useState("");
  const [completionResult, setCompletionResult] =
    useState<CompletionResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mission =
    trainingCityMissions.find((item) => item.id === missionId) ?? firstUnlocked;
  const localResult = useMemo(
    () => calculateTrainingCityResult(mission, enabledControls),
    [enabledControls, mission],
  );
  const secureScore = localResult.secureScore;
  const threatLevel =
    attackState === "breached"
      ? "Critical"
      : secureScore >= 70
        ? "Low"
        : secureScore >= 45
          ? "Elevated"
          : "High";

  function isMissionUnlocked(item: TrainingCityMission) {
    return (
      item.requiredLevel <= roleLevel &&
      (!item.prerequisiteMissionId ||
        completedMissionIds.has(item.prerequisiteMissionId))
    );
  }

  function selectMission(nextMission: TrainingCityMission) {
    if (!isMissionUnlocked(nextMission)) return;

    setMissionId(nextMission.id);
    setEnabledControls([]);
    setAttackState("ready");
    setReflection("");
    setCompletionResult(null);
    setError(null);
    setEvents([
      `Mission loaded: ${nextMission.title}.`,
      nextMission.briefing,
    ]);
    setSelectedAsset(
      nextMission.id === "unpatched-workstation"
        ? "employee"
        : nextMission.id === "public-database"
          ? "bank"
          : nextMission.id === "stolen-secret"
            ? "vault"
            : "server",
    );
  }

  function toggleControl(control: TrainingCityControl) {
    setEnabledControls((current) => {
      const enabled = current.includes(control.id);
      setEvents((items) =>
        [
          `${enabled ? "Removed" : "Applied"} control: ${control.label}.`,
          ...items,
        ].slice(0, 8),
      );
      setAttackState("ready");
      setCompletionResult(null);
      setError(null);
      return enabled
        ? current.filter((id) => id !== control.id)
        : [...current, control.id];
    });
  }

  async function launchAttack() {
    setIsTesting(true);
    setError(null);
    setCompletionResult(null);

    try {
      const response = await fetch("/api/city/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missionKey: mission.id,
          controlsApplied: enabledControls,
        }),
      });
      const result = (await response.json()) as {
        error?: string;
        blocked?: boolean;
        score?: number;
        secureScore?: number;
        attemptCount?: number;
      };

      if (!response.ok || typeof result.blocked !== "boolean") {
        throw new Error(result.error ?? "The attack test could not be saved.");
      }

      setAttackState(result.blocked ? "blocked" : "breached");
      setProgressByMission((current) => ({
        ...current,
        [mission.id]: {
          status: current[mission.id]?.status ?? "in_progress",
          attemptCount: result.attemptCount ?? 1,
          bestScore: Math.max(
            current[mission.id]?.bestScore ?? 0,
            result.score ?? 0,
          ),
        },
      }));
      setEvents((items) =>
        [
          result.blocked
            ? `Attack blocked at ${mission.targetAsset}. After-action review unlocked.`
            : `Attack reached ${mission.targetAsset}. Review the missing controls and retry.`,
          `Server-verified test recorded with a ${result.score ?? 0}% score.`,
          `Attack path: ${mission.attackPath.join(" → ")}.`,
          ...items,
        ].slice(0, 8),
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The attack test could not be saved.",
      );
    } finally {
      setIsTesting(false);
    }
  }

  async function completeMission() {
    setIsCompleting(true);
    setError(null);

    try {
      const response = await fetch("/api/city/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missionKey: mission.id, reflection }),
      });
      const result = (await response.json()) as CompletionResult & {
        error?: string;
        success?: boolean;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.error ?? "The mission could not be completed.");
      }

      setCompletionResult(result);
      setCurrentXp(result.totalXp);
      setCompletedMissionIds((current) => new Set([...current, mission.id]));
      setProgressByMission((current) => ({
        ...current,
        [mission.id]: {
          status: "completed",
          attemptCount: result.attemptCount,
          bestScore: result.score,
        },
      }));
      setEvents((items) =>
        [
          result.firstCompletion
            ? `Mission complete. ${result.xpAwarded} XP awarded.`
            : "Mission replay complete. XP was already awarded.",
          "After-action review saved to your academy record.",
          ...items,
        ].slice(0, 8),
      );
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The mission could not be completed.",
      );
    } finally {
      setIsCompleting(false);
    }
  }

  function resetMission() {
    setEnabledControls([]);
    setAttackState("ready");
    setReflection("");
    setCompletionResult(null);
    setError(null);
    setEvents([`Mission reset: ${mission.title}.`, mission.briefing]);
  }

  const currentMissionIndex = trainingCityMissions.findIndex(
    (item) => item.id === mission.id,
  );
  const nextMission = trainingCityMissions[currentMissionIndex + 1];
  const nextMissionIsUnlocked = nextMission
    ? nextMission.requiredLevel <= roleLevel &&
      (!nextMission.prerequisiteMissionId ||
        (nextMission.prerequisiteMissionId === mission.id
          ? Boolean(completionResult) || completedMissionIds.has(mission.id)
          : completedMissionIds.has(nextMission.prerequisiteMissionId)))
    : false;

  return (
    <div className="space-y-5 pb-8">
      <header className="osiris-panel overflow-hidden p-5 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="osiris-eyebrow">Live Cyber Range // OSR-CITY-01</p>
            <h1 className="mt-2 text-3xl font-black text-white md:text-4xl">
              Mission Training City
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Protect the town by translating familiar city defenses into real
              cybersecurity controls.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Hud label="Operative" value={operativeName} />
            <Hud label="Role" value={roleName} gold />
            <Hud label="Secure score" value={`${secureScore}%`} gold />
            <Hud
              label="Threat"
              value={threatLevel}
              danger={threatLevel === "Critical" || threatLevel === "High"}
            />
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
            <span className="osiris-badge">{currentXp} XP</span>
          </div>
          <div className="mt-4 space-y-3">
            {trainingCityMissions.map((item, index) => {
              const unlocked = isMissionUnlocked(item);
              const active = item.id === mission.id;
              const progress = progressByMission[item.id];
              const completed = progress?.status === "completed";

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectMission(item)}
                  disabled={!unlocked}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-yellow-400 bg-yellow-400/10"
                      : unlocked
                        ? "border-zinc-800 bg-black hover:border-yellow-400/40"
                        : "cursor-not-allowed border-zinc-900 bg-black/50 opacity-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-500">
                      Mission {String(index + 1).padStart(2, "0")}
                    </span>
                    {completed ? (
                      <Award className="h-4 w-4 text-green-400" />
                    ) : unlocked ? (
                      <CheckCircle2 className="h-4 w-4 text-yellow-400" />
                    ) : (
                      <LockKeyhole className="h-4 w-4 text-zinc-600" />
                    )}
                  </div>
                  <p className="mt-2 font-bold text-white">{item.title}</p>
                  <p className="mt-2 text-xs leading-5 text-zinc-500">
                    {completed
                      ? `Completed · ${progress.attemptCount} test${progress.attemptCount === 1 ? "" : "s"}`
                      : unlocked
                        ? item.briefing
                        : item.requiredLevel > roleLevel
                          ? `Requires ${item.requiredRole}`
                          : "Complete the previous city mission"}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="space-y-5">
          <section className="relative min-h-[640px] overflow-hidden rounded-[2rem] border border-yellow-500/20 bg-[#07110c] shadow-2xl shadow-black/60">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(250,204,21,.08) 1px, transparent 1px),linear-gradient(90deg,rgba(250,204,21,.08) 1px,transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />
            <div className="absolute left-[8%] right-[8%] top-[47%] h-16 rounded-xl border-y border-yellow-400/20 bg-zinc-800/80" />
            <div className="absolute bottom-[8%] left-[46%] top-[8%] w-16 rounded-xl border-x border-yellow-400/20 bg-zinc-800/80" />
            <div className="absolute left-5 top-5 z-20 max-w-md rounded-2xl border border-yellow-400/25 bg-black/90 p-4 backdrop-blur">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-yellow-400" />
                <p className="text-xs font-black uppercase tracking-widest text-yellow-400">
                  Active mission
                </p>
              </div>
              <h2 className="mt-2 text-xl font-black">{mission.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {mission.objective}
              </p>
            </div>

            <TownAsset id="employee" icon={Home} label="Employee House" subtitle="Workstation" className="left-[7%] top-[28%]" selected={selectedAsset === "employee"} onSelect={setSelectedAsset} />
            <TownAsset id="admin" icon={Home} label="Admin House" subtitle="Privileged endpoint" className="left-[11%] bottom-[9%]" selected={selectedAsset === "admin"} onSelect={setSelectedAsset} />
            <TownAsset id="server" icon={Server} label="Payroll App" subtitle="Linux server" className="left-[39%] top-[29%]" selected={selectedAsset === "server"} onSelect={setSelectedAsset} warning={mission.targetAsset === "Payroll App Server"} />
            <TownAsset id="bank" icon={Banknote} label="Payroll Bank" subtitle="Database" className="right-[7%] top-[24%]" selected={selectedAsset === "bank"} onSelect={setSelectedAsset} warning={mission.targetAsset === "Payroll Bank"} />
            <TownAsset id="soc" icon={ShieldCheck} label="SOC Police" subtitle="Monitoring" className="right-[10%] bottom-[8%]" selected={selectedAsset === "soc"} onSelect={setSelectedAsset} />
            <TownAsset id="vault" icon={KeyRound} label="Key Vault" subtitle="Secrets" className="left-[42%] bottom-[8%]" selected={selectedAsset === "vault"} onSelect={setSelectedAsset} warning={mission.targetAsset === "Key Vault"} />

            <div className="absolute right-5 top-5 z-20 flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs font-black uppercase tracking-wider text-red-400">
              <Flame className="h-4 w-4" /> Threat actor
            </div>
            <div
              className={`absolute inset-x-5 bottom-5 z-30 rounded-2xl border p-4 text-center font-black transition ${
                attackState === "blocked"
                  ? "border-green-400/40 bg-green-500/15 text-green-400"
                  : attackState === "breached"
                    ? "border-red-400/40 bg-red-500/15 text-red-400"
                    : "pointer-events-none translate-y-8 border-transparent bg-transparent text-transparent opacity-0"
              }`}
            >
              {attackState === "blocked"
                ? "ATTACK BLOCKED — AFTER-ACTION REVIEW UNLOCKED"
                : "BREACH DETECTED — REVIEW THE MISSING CONTROLS"}
            </div>
          </section>

          <section className="osiris-panel p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="osiris-eyebrow">Attack path</p>
                <p className="mt-1 text-sm text-zinc-300">
                  {mission.attackPath.join("  →  ")}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={launchAttack}
                  disabled={isTesting || isCompleting}
                  className="osiris-button gap-2 disabled:cursor-wait disabled:opacity-60"
                >
                  {isTesting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {isTesting ? "Testing" : "Launch attack"}
                </button>
                <button
                  type="button"
                  onClick={resetMission}
                  disabled={isTesting || isCompleting}
                  className="osiris-button-secondary gap-2 disabled:opacity-60"
                >
                  <RotateCcw className="h-4 w-4" /> Reset
                </button>
              </div>
            </div>
            {error && (
              <p className="mt-4 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </p>
            )}
          </section>

          {attackState === "blocked" && !completionResult && (
            <section className="rounded-3xl border border-green-400/25 bg-green-500/5 p-5 md:p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-400 text-black">
                  <ShieldCheck className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-green-400">
                    Attack test passed
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-white">
                    Complete the after-action review
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    Explain which controls stopped the attack and why they
                    worked together. Your response becomes part of your academy
                    record.
                  </p>
                </div>
              </div>
              <label
                htmlFor="after-action-review"
                className="mt-5 block text-xs font-black uppercase tracking-widest text-zinc-500"
              >
                Analyst explanation
              </label>
              <textarea
                id="after-action-review"
                value={reflection}
                onChange={(event) => setReflection(event.target.value)}
                className="osiris-input osiris-textarea mt-2"
                placeholder="The attacker was blocked because..."
                maxLength={1500}
              />
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-zinc-500">
                  {reflection.trim().length}/20 minimum characters
                </p>
                <button
                  type="button"
                  onClick={completeMission}
                  disabled={reflection.trim().length < 20 || isCompleting}
                  className="osiris-button gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCompleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Award className="h-4 w-4" />
                  )}
                  {isCompleting ? "Saving" : "Complete mission"}
                </button>
              </div>
            </section>
          )}

          {completionResult && (
            <section className="overflow-hidden rounded-3xl border border-yellow-400/30 bg-gradient-to-br from-yellow-400/10 via-zinc-950 to-black p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="osiris-eyebrow">Mission Debrief</p>
                  <h2 className="mt-2 text-3xl font-black text-white">
                    {completionResult.firstCompletion
                      ? "Mission accomplished"
                      : "Practice replay complete"}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                    {completionResult.debrief}
                  </p>
                </div>
                <div className="rounded-2xl border border-yellow-400/25 bg-black px-5 py-4 text-center">
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-500">
                    XP earned
                  </p>
                  <p className="mt-1 text-3xl font-black text-yellow-400">
                    +{completionResult.xpAwarded}
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <DebriefMetric label="Best score" value={`${completionResult.score}%`} />
                <DebriefMetric label="Attack tests" value={String(completionResult.attemptCount)} />
                <DebriefMetric label="Failed tests" value={String(completionResult.failedAttemptCount)} />
              </div>
              <div className="mt-5 rounded-2xl border border-yellow-500/15 bg-black/70 p-4">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-500">
                  Framework alignment
                </p>
                <p className="mt-2 text-sm font-bold text-yellow-400">
                  {completionResult.framework}
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                {nextMission && nextMissionIsUnlocked ? (
                  <button
                    type="button"
                    onClick={() => selectMission(nextMission)}
                    className="osiris-button gap-2"
                  >
                    Continue to {nextMission.title}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : nextMission ? (
                  <Link href="/learn" className="osiris-button gap-2">
                    Train toward {nextMission.requiredRole}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link href="/missions" className="osiris-button gap-2">
                    View academy missions
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
                <button
                  type="button"
                  onClick={resetMission}
                  className="osiris-button-secondary gap-2"
                >
                  <RotateCcw className="h-4 w-4" /> Replay mission
                </button>
              </div>
            </section>
          )}
        </main>

        <aside className="space-y-5">
          <section className="osiris-panel p-5">
            <p className="osiris-eyebrow">Selected Asset</p>
            <h2 className="mt-2 text-xl font-black">
              {assets[selectedAsset].name}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {assets[selectedAsset].meaning}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <Metaphor icon={DoorOpen} label="Doors" value="Ports" />
              <Metaphor icon={Shield} label="Guards" value="Firewall" />
              <Metaphor icon={Camera} label="Cameras" value="Logs" />
              <Metaphor icon={Database} label="Vaults" value="Data" />
            </div>
          </section>

          <section className="osiris-panel p-5">
            <div className="flex items-center justify-between">
              <p className="osiris-eyebrow">Available Controls</p>
              <span className="text-xs font-black text-yellow-400">
                {enabledControls.length}/{mission.controls.length}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {mission.controls.map((control) => {
                const enabled = enabledControls.includes(control.id);
                return (
                  <button
                    key={control.id}
                    type="button"
                    onClick={() => toggleControl(control)}
                    disabled={isTesting || isCompleting}
                    className={`w-full rounded-2xl border p-4 text-left transition disabled:opacity-60 ${
                      enabled
                        ? "border-green-400/35 bg-green-500/10"
                        : "border-zinc-800 bg-black hover:border-yellow-400/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-bold text-white">
                        {control.label}
                      </span>
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          enabled
                            ? "bg-green-400 text-black"
                            : "bg-zinc-800 text-zinc-500"
                        }`}
                      >
                        {enabled ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <CircleAlert className="h-4 w-4" />
                        )}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-zinc-500">
                      {control.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="osiris-panel p-5">
            <p className="osiris-eyebrow">Event Timeline</p>
            <ol className="mt-4 space-y-3">
              {events.map((event, index) => (
                <li
                  key={`${event}-${index}`}
                  className="flex gap-3 text-xs leading-5 text-zinc-400"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-yellow-400" />
                  <span>{event}</span>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Hud({
  label,
  value,
  gold = false,
  danger = false,
}: {
  label: string;
  value: string;
  gold?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="min-w-32 rounded-2xl border border-yellow-500/15 bg-black p-3">
      <p className="text-[.6rem] font-black uppercase tracking-widest text-zinc-600">
        {label}
      </p>
      <p
        className={`mt-1 truncate text-sm font-black ${
          danger ? "text-red-400" : gold ? "text-yellow-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function TownAsset({
  id,
  icon: Icon,
  label,
  subtitle,
  className,
  selected,
  warning = false,
  onSelect,
}: {
  id: AssetId;
  icon: typeof Building2;
  label: string;
  subtitle: string;
  className: string;
  selected: boolean;
  warning?: boolean;
  onSelect: (id: AssetId) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`absolute z-10 w-36 rounded-2xl border p-4 text-center shadow-2xl transition hover:-translate-y-1 ${className} ${
        selected
          ? "border-yellow-400 bg-yellow-400/15"
          : warning
            ? "border-red-400/50 bg-red-500/10"
            : "border-yellow-500/20 bg-black/90"
      }`}
    >
      <Icon
        className={`mx-auto h-9 w-9 ${warning ? "text-red-400" : "text-yellow-400"}`}
      />
      <p className="mt-2 text-sm font-black text-white">{label}</p>
      <p className="mt-1 text-[.65rem] uppercase tracking-wider text-zinc-500">
        {subtitle}
      </p>
      {warning && (
        <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white">
          <CircleAlert className="h-4 w-4" />
        </span>
      )}
    </button>
  );
}

function Metaphor({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-yellow-500/10 bg-black p-3">
      <Icon className="h-4 w-4 text-yellow-400" />
      <p className="mt-2 text-zinc-500">{label}</p>
      <p className="font-bold text-white">{value}</p>
    </div>
  );
}

function DebriefMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-yellow-500/15 bg-black/70 p-4">
      <p className="text-xs font-black uppercase tracking-widest text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}
