import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Building2,
  Cloud,
  Database,
  Home,
  KeyRound,
  Server,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

type EnterpriseAsset = {
  label: string;
  meaning: string;
  icon: LucideIcon;
  left: string;
  top: string;
};

const enterpriseAssets: EnterpriseAsset[] = [
  {
    label: "Employee House",
    meaning: "Endpoint",
    icon: Home,
    left: "10%",
    top: "60%",
  },
  {
    label: "Admin House",
    meaning: "Privileged endpoint",
    icon: Building2,
    left: "24%",
    top: "24%",
  },
  {
    label: "Payroll App",
    meaning: "Linux server",
    icon: Server,
    left: "47%",
    top: "48%",
  },
  {
    label: "Payroll Bank",
    meaning: "Database",
    icon: Banknote,
    left: "72%",
    top: "66%",
  },
  {
    label: "SOC Police",
    meaning: "Monitoring",
    icon: ShieldCheck,
    left: "72%",
    top: "19%",
  },
  {
    label: "Key Vault",
    meaning: "Secrets",
    icon: KeyRound,
    left: "88%",
    top: "43%",
  },
];

const networkLines = [
  { left: "15%", top: "63%", width: "37%", rotate: "-13deg" },
  { left: "29%", top: "30%", width: "25%", rotate: "26deg" },
  { left: "52%", top: "54%", width: "24%", rotate: "21deg" },
  { left: "52%", top: "50%", width: "25%", rotate: "-28deg" },
  { left: "76%", top: "26%", width: "17%", rotate: "34deg" },
  { left: "76%", top: "69%", width: "16%", rotate: "-31deg" },
];

export function EnterpriseMap({
  missionTitle,
  missionObjective,
  targetAsset,
  attackPath,
  completed,
}: {
  missionTitle: string;
  missionObjective: string;
  targetAsset: string;
  attackPath: string[];
  completed: boolean;
}) {
  return (
    <section className="osiris-panel overflow-hidden">
      <div className="flex items-start justify-between gap-4 border-b border-yellow-500/15 p-4">
        <div>
          <p className="osiris-section-heading">
            Simulated Enterprise: Osiris Manufacturing
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-600">
            A persistent environment to learn, practice, and defend.
          </p>
        </div>
        <span
          className={`osiris-badge ${
            completed ? "!border-green-500/20 !text-green-400" : ""
          }`}
        >
          {completed ? "Secured" : "Active"}
        </span>
      </div>

      <div className="flex items-center justify-around gap-2 border-b border-yellow-500/10 bg-black/60 px-3 py-3">
        {[
          [Cloud, "Cloud"],
          [Server, "Servers"],
          [Database, "Data"],
          [ShieldCheck, "SOC"],
        ].map(([Icon, label]) => {
          const AssetIcon = Icon as LucideIcon;
          return (
            <div key={label as string} className="text-center">
              <AssetIcon className="mx-auto h-4 w-4 text-yellow-400" aria-hidden="true" />
              <p className="mt-1 font-mono text-[0.54rem] font-bold uppercase text-zinc-600">
                {label as string}
              </p>
            </div>
          );
        })}
      </div>

      <div className="osiris-grid-surface relative h-[310px] overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
        {networkLines.map((line, index) => (
          <span
            key={`${line.left}-${line.top}`}
            className="absolute h-px origin-left bg-gradient-to-r from-yellow-500/10 via-yellow-400/55 to-yellow-500/10 shadow-[0_0_6px_rgba(227,170,34,0.2)]"
            style={{
              left: line.left,
              top: line.top,
              width: line.width,
              transform: `rotate(${line.rotate})`,
            }}
            aria-hidden="true"
          >
            {index % 2 === 0 ? (
              <span className="absolute right-1 top-[-2px] h-1 w-1 rounded-full bg-yellow-300 shadow-[0_0_8px_rgba(255,200,61,0.9)]" />
            ) : null}
          </span>
        ))}

        {enterpriseAssets.map((asset) => {
          const Icon = asset.icon;
          const isTarget = asset.label === targetAsset;
          return (
            <div
              key={asset.label}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
              style={{ left: asset.left, top: asset.top }}
            >
              <span
                className={`mx-auto flex items-center justify-center border bg-black/90 text-yellow-400 [clip-path:polygon(50%_0%,92%_22%,92%_75%,50%_100%,8%_75%,8%_22%)] ${
                  isTarget
                    ? "h-16 w-16 border-yellow-200 shadow-[0_0_32px_rgba(227,170,34,0.38)]"
                    : "h-11 w-11 border-yellow-500/35 shadow-[0_0_14px_rgba(227,170,34,0.12)]"
                }`}
              >
                <Icon className={isTarget ? "h-7 w-7" : "h-4 w-4"} aria-hidden="true" />
              </span>
              <p className="mt-2 whitespace-nowrap text-[0.62rem] font-black text-zinc-200">
                {asset.label}
              </p>
              <p className="whitespace-nowrap font-mono text-[0.5rem] uppercase text-zinc-700">
                {asset.meaning}
              </p>
            </div>
          );
        })}
      </div>

      <div className="border-t border-yellow-500/15 bg-black/80 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-[0.56rem] font-black uppercase tracking-[0.14em] text-zinc-600">
              Current city operation
            </p>
            <p className="mt-1 truncate text-sm font-black text-white">
              {missionTitle}
            </p>
          </div>
          <span className="shrink-0 font-mono text-[0.6rem] font-black text-yellow-400">
            {attackPath.length} NODES
          </span>
        </div>
        <p className="mt-2 text-xs leading-5 text-zinc-600">
          {missionObjective}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-yellow-500/10 pt-3">
          <p className="min-w-0 truncate font-mono text-[0.56rem] uppercase text-zinc-700">
            {attackPath.join(" → ")}
          </p>
          <Link href="/city" className="flex shrink-0 items-center gap-1 text-xs font-black text-yellow-400">
            Enter city
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
