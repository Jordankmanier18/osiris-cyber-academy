"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CompleteMissionFormProps = {
  missionId: string;
};

export default function CompleteMissionForm({
  missionId,
}: CompleteMissionFormProps) {
  const router = useRouter();
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setMessage("");

    const response = await fetch("/api/missions/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        missionId,
        answer,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "Something went wrong.");
      setIsSubmitting(false);
      return;
    }

    setMessage("Mission completed. XP awarded.");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Submit your answer</label>

        <input
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Enter the flag or answer"
          className="mt-2 w-full rounded-lg border bg-background px-4 py-3"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-white px-5 py-3 font-semibold text-black disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Complete Mission"}
      </button>

      {message ? <p className="text-sm">{message}</p> : null}
    </form>
  );
}
