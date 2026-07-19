import Link from "next/link";
import {
  Check,
  ChevronRight,
  CloudCog,
  Headset,
  LockKeyhole,
  Network,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export type JourneyRole = {
  id: string;
  name: string;
  slug: string;
  level: number;
  framework: string | null;
};

const roleIcons: LucideIcon[] = [
  UserRound,
  Headset,
  Network,
  ShieldCheck,
  CloudCog,
];

export function JourneyRail({
  roles,
  currentLevel,
}: {
  roles: JourneyRole[];
  currentLevel: number;
}) {
  return (
    <section className="osiris-panel overflow-hidden p-4 md:p-5">
      <div className="flex items-center justify-between gap-4 border-b border-yellow-500/15 pb-3">
        <div>
          <p className="osiris-section-heading">The Journey</p>
          <p className="mt-1 text-xs text-zinc-600">
            Earn XP · Complete missions · Get promoted
          </p>
        </div>
        <span className="osiris-badge-dark">Role clearance path</span>
      </div>

      <div className="overflow-x-auto pb-2 pt-5">
        <div className="flex min-w-[760px] items-start">
          {roles.map((role, index) => {
            const Icon = roleIcons[Math.min(index, roleIcons.length - 1)];
            const complete = role.level < currentLevel;
            const active = role.level === currentLevel;
            const unlocked = role.level <= currentLevel;
            const roleNode = (
              <div className="group flex min-w-28 flex-1 flex-col items-center text-center">
                <div
                  className={`relative flex items-center justify-center border [clip-path:polygon(50%_0%,91%_22%,91%_75%,50%_100%,9%_75%,9%_22%)] ${
                    active
                      ? "h-20 w-20 border-yellow-300 bg-[radial-gradient(circle,rgba(255,200,61,0.32),rgba(227,170,34,0.08)_58%,transparent_60%)] text-yellow-300 shadow-[0_0_32px_rgba(227,170,34,0.3)]"
                      : complete
                        ? "h-14 w-14 border-yellow-500/45 bg-yellow-400/10 text-yellow-400"
                        : "h-14 w-14 border-zinc-800 bg-zinc-950 text-zinc-700"
                  }`}
                >
                  <Icon
                    className={active ? "h-8 w-8" : "h-5 w-5"}
                    aria-hidden="true"
                  />
                  {complete ? (
                    <span className="absolute bottom-0.5 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-black">
                      <Check className="h-2.5 w-2.5" aria-hidden="true" />
                    </span>
                  ) : null}
                  {!unlocked ? (
                    <LockKeyhole
                      className="absolute bottom-1 right-1 h-3 w-3 text-zinc-700"
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
                <p
                  className={`mt-3 max-w-28 text-[0.68rem] font-black uppercase leading-4 ${
                    active
                      ? "text-yellow-400"
                      : unlocked
                        ? "text-zinc-200"
                        : "text-zinc-700"
                  }`}
                >
                  {role.name}
                </p>
                <p className="mt-1 font-mono text-[0.58rem] font-bold uppercase tracking-[0.1em] text-zinc-600">
                  Level {role.level}
                </p>
              </div>
            );

            return (
              <div key={role.id} className="flex flex-1 items-start">
                {unlocked ? (
                  <Link
                    href={`/learn?district=${role.slug}`}
                    className="flex flex-1 justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                  >
                    {roleNode}
                  </Link>
                ) : (
                  roleNode
                )}
                {index < roles.length - 1 ? (
                  <div className="mt-6 flex min-w-8 flex-1 items-center px-1">
                    <span
                      className={`h-px flex-1 ${
                        role.level < currentLevel
                          ? "bg-yellow-500/55"
                          : "bg-zinc-800"
                      }`}
                    />
                    <ChevronRight
                      className={`h-4 w-4 ${
                        role.level < currentLevel
                          ? "text-yellow-400"
                          : "text-zinc-800"
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
