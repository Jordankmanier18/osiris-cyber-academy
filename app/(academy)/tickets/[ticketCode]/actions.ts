"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/auth";
import {
  getCapstoneByCode,
  scoreCapstoneResponse,
  type CapstoneResponse,
} from "@/lib/capstone-tickets";
import { prisma } from "@/lib/prisma";
import {
  applyPromotionIfEligible,
  getPromotionStatusForRole,
  lockUserForProgression,
} from "@/lib/progression";

export type CapstoneActionState = {
  status: "idle" | "error" | "failed" | "passed";
  message: string;
  score?: number;
  feedback?: string;
  criteria?: {
    risk: number;
    controls: number;
    validation: number;
    closureNote: number;
  };
  xpAwarded?: number;
  totalXp?: number;
  promotedTo?: {
    name: string;
    slug: string;
    level: number;
  } | null;
};

const capstoneSubmissionSchema = z.object({
  ticketCode: z.string().trim().min(1).max(50),
  riskLevel: z.string().trim().min(1).max(30),
  controls: z.array(z.string().trim().min(1).max(80)).max(20),
  validationSteps: z.array(z.string().trim().min(1).max(80)).max(20),
  closureNote: z.string().trim().min(80).max(1500),
});

export async function submitCapstoneTicket(
  _previousState: CapstoneActionState,
  formData: FormData,
): Promise<CapstoneActionState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      status: "error",
      message: "Your session has expired. Sign in again before submitting.",
    };
  }

  const parsed = capstoneSubmissionSchema.safeParse({
    ticketCode: formData.get("ticketCode"),
    riskLevel: formData.get("riskLevel"),
    controls: formData.getAll("controls"),
    validationSteps: formData.getAll("validationSteps"),
    closureNote: formData.get("closureNote"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message:
        "Complete every section and write a closure note of at least 80 characters.",
    };
  }

  const definition = getCapstoneByCode(parsed.data.ticketCode);

  if (!definition) {
    return {
      status: "error",
      message: "This ticket is not configured as an academy capstone.",
    };
  }

  const response: CapstoneResponse = {
    riskLevel: parsed.data.riskLevel,
    controls: parsed.data.controls,
    validationSteps: parsed.data.validationSteps,
    closureNote: parsed.data.closureNote,
  };
  const evaluation = scoreCapstoneResponse(definition, response);

  try {
    const result = await prisma.$transaction(
      async (transaction) => {
        await lockUserForProgression(transaction, session.user.id);

        const user = await transaction.user.findUnique({
          where: { id: session.user.id },
          select: {
            points: true,
            role: {
              select: {
                slug: true,
              },
            },
          },
        });

        if (!user?.role || user.role.slug !== definition.roleSlug) {
          return {
            error: "This capstone does not match your current academy role.",
          } as const;
        }

        const promotionStatus = await getPromotionStatusForRole(
          session.user.id,
          definition.roleSlug,
          transaction,
        );

        if (!promotionStatus?.lessons.complete) {
          return {
            error: "Complete every required role lesson before the capstone.",
          } as const;
        }

        if (!promotionStatus.city.complete) {
          return {
            error:
              "Complete the required Mission Training City defense before the capstone.",
          } as const;
        }

        const ticket = await transaction.ticket.findUnique({
          where: { ticketCode: definition.ticketCode },
          select: { id: true },
        });

        if (!ticket) {
          return {
            error: "The capstone ticket has not been synchronized yet.",
          } as const;
        }

        const existing = await transaction.ticketProgress.findUnique({
          where: {
            userId_ticketId: {
              userId: session.user.id,
              ticketId: ticket.id,
            },
          },
        });
        const firstPass = evaluation.passed && existing?.status !== "completed";
        const completedAt = firstPass
          ? new Date()
          : (existing?.completedAt ?? null);
        const status =
          existing?.status === "completed" || evaluation.passed
            ? "completed"
            : "in_progress";

        const ticketProgress = await transaction.ticketProgress.upsert({
          where: {
            userId_ticketId: {
              userId: session.user.id,
              ticketId: ticket.id,
            },
          },
          create: {
            userId: session.user.id,
            ticketId: ticket.id,
            status,
            attemptCount: 1,
            bestScore: evaluation.score,
            response: response as Prisma.InputJsonValue,
            feedback: evaluation.feedback,
            xpAwarded: firstPass ? definition.xpReward : 0,
            completedAt,
          },
          update: {
            status,
            attemptCount: { increment: 1 },
            bestScore: Math.max(existing?.bestScore ?? 0, evaluation.score),
            response: response as Prisma.InputJsonValue,
            feedback: evaluation.feedback,
            xpAwarded: firstPass
              ? definition.xpReward
              : (existing?.xpAwarded ?? 0),
            completedAt,
          },
        });

        if (firstPass) {
          await transaction.user.update({
            where: { id: session.user.id },
            data: {
              points: { increment: definition.xpReward },
            },
          });
        }

        const promotion = evaluation.passed
          ? await applyPromotionIfEligible(
              transaction,
              session.user.id,
              definition.roleSlug,
            )
          : { promoted: false as const, promotedTo: null };
        const updatedUser = await transaction.user.findUniqueOrThrow({
          where: { id: session.user.id },
          select: { points: true },
        });

        return {
          error: null,
          firstPass,
          ticketProgress,
          totalXp: updatedUser.points,
          promotion,
        } as const;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );

    if (result.error) {
      return {
        status: "error",
        message: result.error,
      };
    }

    revalidatePath("/", "layout");

    return {
      status: evaluation.passed ? "passed" : "failed",
      message: evaluation.passed
        ? result.promotion.promoted
          ? `Capstone passed. You have been promoted to ${result.promotion.promotedTo?.name}.`
          : "Capstone passed and saved to your academy record."
        : "The ticket needs another review before it can be closed.",
      score: evaluation.score,
      feedback: evaluation.feedback,
      criteria: evaluation.criteria,
      xpAwarded: result.firstPass ? definition.xpReward : 0,
      totalXp: result.totalXp,
      promotedTo: result.promotion.promotedTo,
    };
  } catch (error) {
    console.error("Capstone submission failed", error);

    return {
      status: "error",
      message:
        "The capstone could not be saved. Your existing progress was not changed; please try again.",
    };
  }
}
