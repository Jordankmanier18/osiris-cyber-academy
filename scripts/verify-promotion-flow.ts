import "dotenv/config";
import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  getCapstoneByCode,
  scoreCapstoneResponse,
} from "../lib/capstone-tickets";
import {
  applyPromotionIfEligible,
  lockUserForProgression,
} from "../lib/progression";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function removeVerificationUser(userId: string) {
  await prisma.userProgress.deleteMany({ where: { userId } });
  await prisma.submission.deleteMany({ where: { userId } });
  await prisma.user.delete({ where: { id: userId } });
}

async function main() {
  const staleVerificationUsers = await prisma.user.findMany({
    where: { email: { startsWith: "promotion-verification-" } },
    select: { id: true },
  });

  for (const user of staleVerificationUsers) {
    await removeVerificationUser(user.id);
  }

  const definition = getCapstoneByCode("OSR-CC-CAP-001");
  assert(definition, "Capstone definition is missing.");

  const passingEvaluation = scoreCapstoneResponse(definition, {
    riskLevel: "high",
    controls: ["restrict-nsg", "require-ssh-key", "enable-logging"],
    validationSteps: [
      "test-admin-network",
      "test-public-block",
      "verify-soc-logs",
    ],
    closureNote:
      "Reviewed the Payroll App Server SSH exposure, restricted access to the administrator network, blocked public connections, and verified the access logs reached the SOC monitoring queue.",
  });
  assert.equal(passingEvaluation.score, 100);
  assert.equal(passingEvaluation.passed, true);

  const unsafeEvaluation = scoreCapstoneResponse(definition, {
    riskLevel: "low",
    controls: ["leave-public-access"],
    validationSteps: ["skip-testing"],
    closureNote:
      "Left the server open and skipped validation because administrators still need access from the internet.",
  });
  assert.equal(unsafeEvaluation.passed, false);

  const [cyberCadet, capstoneTicket, lessons] = await Promise.all([
    prisma.role.findUniqueOrThrow({ where: { slug: "cyber-cadet" } }),
    prisma.ticket.findUniqueOrThrow({
      where: { ticketCode: definition.ticketCode },
    }),
    prisma.lesson.findMany({
      where: { slug: { in: [...definition.requiredLessonSlugs] } },
      select: { id: true },
    }),
  ]);
  assert.equal(lessons.length, definition.requiredLessonSlugs.length);

  const verificationUser = await prisma.user.create({
    data: {
      name: "Promotion Verification",
      email: `promotion-verification-${Date.now()}@osiris.test`,
      roleId: cyberCadet.id,
      points: 150,
    },
  });

  try {
    await prisma.userProgress.createMany({
      data: lessons.map((lesson) => ({
        userId: verificationUser.id,
        lessonId: lesson.id,
        status: "completed",
        completedAt: new Date(),
      })),
    });
    await prisma.trainingCityProgress.create({
      data: {
        userId: verificationUser.id,
        missionKey: definition.cityMissionKey,
        status: "completed",
        attemptCount: 1,
        bestScore: 100,
        secureScore: 85,
        controlsApplied: ["nsg", "ssh-key", "logging"],
        lastAttackResult: "blocked",
        reflection: "Verification mission reflection.",
        xpAwarded: 50,
        completedAt: new Date(),
      },
    });
    await prisma.ticketProgress.create({
      data: {
        userId: verificationUser.id,
        ticketId: capstoneTicket.id,
        status: "completed",
        attemptCount: 1,
        bestScore: passingEvaluation.score,
        response: {
          riskLevel: "high",
          controls: ["restrict-nsg", "require-ssh-key", "enable-logging"],
        },
        feedback: passingEvaluation.feedback,
        xpAwarded: definition.xpReward,
        completedAt: new Date(),
      },
    });

    const firstPromotion = await prisma.$transaction(async (transaction) => {
      await lockUserForProgression(transaction, verificationUser.id);
      return applyPromotionIfEligible(
        transaction,
        verificationUser.id,
        definition.roleSlug,
      );
    });
    assert.equal(firstPromotion.promoted, true);
    assert.equal(firstPromotion.promotedTo?.slug, definition.nextRoleSlug);

    const secondPromotion = await prisma.$transaction(async (transaction) => {
      await lockUserForProgression(transaction, verificationUser.id);
      return applyPromotionIfEligible(
        transaction,
        verificationUser.id,
        definition.roleSlug,
      );
    });
    assert.equal(secondPromotion.promoted, false);

    const savedUser = await prisma.user.findUniqueOrThrow({
      where: { id: verificationUser.id },
      include: { role: true, promotions: true },
    });
    assert.equal(savedUser.role?.slug, definition.nextRoleSlug);
    assert.equal(savedUser.promotions.length, 1);

    console.log(
      "Promotion verification passed: scoring, role update, and replay idempotency are correct.",
    );
  } finally {
    await removeVerificationUser(verificationUser.id);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
