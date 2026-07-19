"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Loader2,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import type { CapstoneTicketDefinition } from "@/lib/capstone-tickets";
import {
  submitCapstoneTicket,
  type CapstoneActionState,
} from "@/app/(academy)/tickets/[ticketCode]/actions";

const initialCapstoneActionState: CapstoneActionState = {
  status: "idle",
  message: "",
};

export function CapstoneTicketForm({
  definition,
  canSubmit,
  lockedReason,
  initialCompleted,
  previousScore,
  promotedToName,
}: {
  definition: CapstoneTicketDefinition;
  canSubmit: boolean;
  lockedReason: string | null;
  initialCompleted: boolean;
  previousScore: number;
  promotedToName: string | null;
}) {
  const [state, formAction, pending] = useActionState(
    submitCapstoneTicket,
    initialCapstoneActionState,
  );
  const completed = initialCompleted || state.status === "passed";
  const promotionName = state.promotedTo?.name ?? promotedToName;

  if (completed) {
    return (
      <section className="relative overflow-hidden rounded-3xl border border-yellow-400/35 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.2),transparent_36%),linear-gradient(135deg,#18181b,#050505_58%)] p-6 shadow-2xl md:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-yellow-400/15" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-black">
              <Award className="h-7 w-7" aria-hidden="true" />
            </span>
            <div>
              <p className="osiris-eyebrow">Capstone cleared</p>
              <h2 className="mt-2 text-3xl font-black text-white">
                {promotionName
                  ? `Promoted to ${promotionName}`
                  : "Ticket passed and recorded"}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                Your evidence review, remediation plan, validation steps, and
                closure note met the Orientation Center standard.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="osiris-badge">
                  {state.score ?? previousScore}% best score
                </span>
                {state.xpAwarded ? (
                  <span className="osiris-badge">+{state.xpAwarded} XP</span>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard" className="osiris-button gap-2">
              Open command center
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/city" className="osiris-button-secondary gap-2">
              Enter next district
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!canSubmit) {
    return (
      <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-600">
            <LockKeyhole className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-600">
              Capstone locked
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">
              Finish the required training first
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              {lockedReason ??
                "Complete the role requirements before working this ticket."}
            </p>
            <Link
              href="/dashboard"
              className="osiris-button-secondary mt-5 gap-2"
            >
              Review requirements
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="ticketCode" value={definition.ticketCode} />

      <section className="osiris-card">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-yellow-400/25 bg-yellow-400/10 text-yellow-400">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="osiris-eyebrow">Step 1 · Assess</p>
            <h2 className="mt-2 text-xl font-black text-white">
              Classify the current risk
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Choose the level supported by the evidence. Do not assume a
              confirmed breach unless the ticket shows one.
            </p>
          </div>
        </div>
        <fieldset className="mt-6 grid gap-3 sm:grid-cols-2">
          <legend className="sr-only">Risk level</legend>
          {definition.riskOptions.map((option) => (
            <label
              key={option.id}
              className="cursor-pointer rounded-2xl border border-zinc-800 bg-black p-4 transition has-[:checked]:border-yellow-400 has-[:checked]:bg-yellow-400/10"
            >
              <span className="flex items-start gap-3">
                <input
                  type="radio"
                  name="riskLevel"
                  value={option.id}
                  required
                  className="mt-1 accent-yellow-400"
                />
                <span>
                  <span className="block font-black text-white">
                    {option.label}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-zinc-500">
                    {option.description}
                  </span>
                </span>
              </span>
            </label>
          ))}
        </fieldset>
      </section>

      <section className="osiris-card">
        <p className="osiris-eyebrow">Step 2 · Remediate</p>
        <h2 className="mt-2 text-xl font-black text-white">
          Select the controls you would apply
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Select only the controls that directly reduce the exposure without
          breaking authorized administration.
        </p>
        <fieldset className="mt-5 grid gap-3 lg:grid-cols-2">
          <legend className="sr-only">Remediation controls</legend>
          {definition.controlOptions.map((option) => (
            <label
              key={option.id}
              className="cursor-pointer rounded-2xl border border-zinc-800 bg-black p-4 transition has-[:checked]:border-yellow-400 has-[:checked]:bg-yellow-400/10"
            >
              <span className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="controls"
                  value={option.id}
                  className="mt-1 accent-yellow-400"
                />
                <span>
                  <span className="block font-black text-white">
                    {option.label}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-zinc-500">
                    {option.description}
                  </span>
                </span>
              </span>
            </label>
          ))}
        </fieldset>
      </section>

      <section className="osiris-card">
        <p className="osiris-eyebrow">Step 3 · Validate</p>
        <h2 className="mt-2 text-xl font-black text-white">
          Prove the remediation worked
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          A ticket is not complete until both security and business access are
          verified.
        </p>
        <fieldset className="mt-5 grid gap-3 lg:grid-cols-2">
          <legend className="sr-only">Validation steps</legend>
          {definition.validationOptions.map((option) => (
            <label
              key={option.id}
              className="cursor-pointer rounded-2xl border border-zinc-800 bg-black p-4 transition has-[:checked]:border-yellow-400 has-[:checked]:bg-yellow-400/10"
            >
              <span className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="validationSteps"
                  value={option.id}
                  className="mt-1 accent-yellow-400"
                />
                <span>
                  <span className="block font-black text-white">
                    {option.label}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-zinc-500">
                    {option.description}
                  </span>
                </span>
              </span>
            </label>
          ))}
        </fieldset>
      </section>

      <section className="osiris-card">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-yellow-400/25 bg-yellow-400/10 text-yellow-400">
            <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="osiris-eyebrow">Step 4 · Document</p>
            <h2 className="mt-2 text-xl font-black text-white">
              Write the ticket closure note
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Name the affected service, the remediation outcome, and how
              monitoring was verified. Minimum 80 characters.
            </p>
          </div>
        </div>
        <label htmlFor="closureNote" className="sr-only">
          Ticket closure note
        </label>
        <textarea
          id="closureNote"
          name="closureNote"
          required
          minLength={80}
          maxLength={1500}
          className="osiris-input osiris-textarea mt-5"
          placeholder="Reviewed the Payroll App Server SSH exposure..."
        />
      </section>

      {state.status !== "idle" ? (
        <section
          aria-live="polite"
          className={`rounded-3xl border p-5 ${
            state.status === "error"
              ? "border-red-400/30 bg-red-500/10"
              : "border-yellow-400/30 bg-yellow-400/10"
          }`}
        >
          <div className="flex items-start gap-3">
            {state.status === "error" ? (
              <RotateCcw
                className="mt-0.5 h-5 w-5 text-red-300"
                aria-hidden="true"
              />
            ) : (
              <ClipboardCheck
                className="mt-0.5 h-5 w-5 text-yellow-400"
                aria-hidden="true"
              />
            )}
            <div>
              <p className="font-black text-white">{state.message}</p>
              {typeof state.score === "number" ? (
                <p className="mt-2 text-sm font-bold text-yellow-400">
                  Score: {state.score}% · {definition.passingScore}% required
                </p>
              ) : null}
              {state.feedback ? (
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {state.feedback}
                </p>
              ) : null}
              {state.criteria ? (
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    ["Risk", state.criteria.risk, 20],
                    ["Controls", state.criteria.controls, 40],
                    ["Validation", state.criteria.validation, 20],
                    ["Closure", state.criteria.closureNote, 20],
                  ].map(([label, value, maximum]) => (
                    <div
                      key={String(label)}
                      className="rounded-xl bg-black/40 p-3"
                    >
                      <p className="text-[0.65rem] font-black uppercase tracking-wider text-zinc-600">
                        {label}
                      </p>
                      <p className="mt-1 font-black text-white">
                        {value}/{maximum}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <div className="flex flex-col gap-3 rounded-3xl border border-yellow-500/20 bg-zinc-950 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-600">
            Passing standard
          </p>
          <p className="mt-1 text-sm font-bold text-white">
            {definition.passingScore}% with every required section complete
          </p>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="osiris-button gap-2 disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          )}
          {pending ? "Evaluating ticket" : "Submit for evaluation"}
        </button>
      </div>
    </form>
  );
}
