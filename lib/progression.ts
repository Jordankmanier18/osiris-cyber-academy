import type { Prisma, PrismaClient } from "@prisma/client";
import {
  getCapstoneByRole,
  type CapstoneTicketDefinition,
} from "@/lib/capstone-tickets";
import { prisma } from "@/lib/prisma";

type ProgressionDatabase = PrismaClient | Prisma.TransactionClient;

export type PromotionStep = "lessons" | "city" | "capstone" | "complete";

export type PromotionStatus = {
  available: boolean;
  definition: CapstoneTicketDefinition | null;
  currentRole: {
    id: string;
    name: string;
    slug: string;
    level: number;
    framework: string | null;
  };
  nextRole: {
    id: string;
    name: string;
    slug: string;
    level: number;
    framework: string | null;
    xpRequired: number;
  } | null;
  lessons: {
    completed: number;
    total: number;
    complete: boolean;
    missingSlugs: string[];
  };
  city: {
    missionKey: string | null;
    complete: boolean;
  };
  capstone: {
    ticketCode: string | null;
    ticketId: string | null;
    ready: boolean;
    complete: boolean;
    bestScore: number;
    attemptCount: number;
  };
  completedRequirements: number;
  totalRequirements: number;
  firstIncompleteStep: PromotionStep;
};

export async function getPromotionStatus(
  userId: string,
  database: ProgressionDatabase = prisma,
) {
  const user = await database.user.findUnique({
    where: { id: userId },
    select: {
      role: {
        select: {
          slug: true,
        },
      },
    },
  });

  if (!user?.role) {
    return null;
  }

  return getPromotionStatusForRole(userId, user.role.slug, database);
}

export async function getPromotionStatusForRole(
  userId: string,
  roleSlug: string,
  database: ProgressionDatabase = prisma,
): Promise<PromotionStatus | null> {
  const definition = getCapstoneByRole(roleSlug);
  const role = await database.role.findUnique({
    where: { slug: roleSlug },
    select: {
      id: true,
      name: true,
      slug: true,
      level: true,
      framework: true,
      nextRoleSlug: true,
    },
  });

  if (!role) {
    return null;
  }

  if (!definition) {
    return {
      available: false,
      definition: null,
      currentRole: role,
      nextRole: null,
      lessons: {
        completed: 0,
        total: 0,
        complete: false,
        missingSlugs: [],
      },
      city: {
        missionKey: null,
        complete: false,
      },
      capstone: {
        ticketCode: null,
        ticketId: null,
        ready: false,
        complete: false,
        bestScore: 0,
        attemptCount: 0,
      },
      completedRequirements: 0,
      totalRequirements: 3,
      firstIncompleteStep: "lessons",
    };
  }

  const nextRole = await database.role.findUnique({
    where: { slug: definition.nextRoleSlug },
    select: {
      id: true,
      name: true,
      slug: true,
      level: true,
      framework: true,
      xpRequired: true,
    },
  });
  const lessons = await database.lesson.findMany({
    where: {
      slug: { in: [...definition.requiredLessonSlugs] },
      roleId: role.id,
    },
    select: { slug: true },
  });
  const completedLessons = await database.userProgress.findMany({
    where: {
      userId,
      status: "completed",
      lesson: {
        slug: { in: [...definition.requiredLessonSlugs] },
        roleId: role.id,
      },
    },
    select: {
      lesson: {
        select: { slug: true },
      },
    },
  });
  const cityProgress = await database.trainingCityProgress.findUnique({
    where: {
      userId_missionKey: {
        userId,
        missionKey: definition.cityMissionKey,
      },
    },
    select: { status: true },
  });
  const ticket = await database.ticket.findUnique({
    where: { ticketCode: definition.ticketCode },
    select: {
      id: true,
      work: {
        where: { userId },
        take: 1,
        select: {
          status: true,
          bestScore: true,
          attemptCount: true,
        },
      },
    },
  });

  const existingLessonSlugs = new Set(lessons.map((lesson) => lesson.slug));
  const completedLessonSlugs = new Set(
    completedLessons
      .map((progress) => progress.lesson?.slug)
      .filter((slug): slug is string => Boolean(slug)),
  );
  const missingSlugs = definition.requiredLessonSlugs.filter(
    (slug) => !completedLessonSlugs.has(slug),
  );
  const lessonsComplete =
    existingLessonSlugs.size === definition.requiredLessonSlugs.length &&
    missingSlugs.length === 0;
  const cityComplete = cityProgress?.status === "completed";
  const ticketProgress = ticket?.work[0];
  const capstoneComplete = ticketProgress?.status === "completed";
  const capstoneReady = lessonsComplete && cityComplete;
  const completedRequirements = [
    lessonsComplete,
    cityComplete,
    capstoneComplete,
  ].filter(Boolean).length;
  const firstIncompleteStep: PromotionStep = !lessonsComplete
    ? "lessons"
    : !cityComplete
      ? "city"
      : !capstoneComplete
        ? "capstone"
        : "complete";

  return {
    available: true,
    definition,
    currentRole: role,
    nextRole,
    lessons: {
      completed: definition.requiredLessonSlugs.length - missingSlugs.length,
      total: definition.requiredLessonSlugs.length,
      complete: lessonsComplete,
      missingSlugs: [...missingSlugs],
    },
    city: {
      missionKey: definition.cityMissionKey,
      complete: cityComplete,
    },
    capstone: {
      ticketCode: definition.ticketCode,
      ticketId: ticket?.id ?? null,
      ready: capstoneReady,
      complete: capstoneComplete,
      bestScore: ticketProgress?.bestScore ?? 0,
      attemptCount: ticketProgress?.attemptCount ?? 0,
    },
    completedRequirements,
    totalRequirements: 3,
    firstIncompleteStep,
  };
}

export async function lockUserForProgression(
  transaction: Prisma.TransactionClient,
  userId: string,
) {
  await transaction.$queryRaw`
    SELECT "id"
    FROM "User"
    WHERE "id" = ${userId}
    FOR UPDATE
  `;
}

export async function applyPromotionIfEligible(
  transaction: Prisma.TransactionClient,
  userId: string,
  fromRoleSlug: string,
) {
  const status = await getPromotionStatusForRole(
    userId,
    fromRoleSlug,
    transaction,
  );

  if (
    !status?.available ||
    !status.nextRole ||
    status.firstIncompleteStep !== "complete"
  ) {
    return { promoted: false as const, promotedTo: null };
  }

  const user = await transaction.user.findUnique({
    where: { id: userId },
    select: {
      roleId: true,
      role: {
        select: { slug: true },
      },
    },
  });

  if (!user?.roleId || user.role?.slug !== fromRoleSlug) {
    return { promoted: false as const, promotedTo: null };
  }

  const existingPromotion = await transaction.rolePromotion.findUnique({
    where: {
      userId_fromRoleSlug: {
        userId,
        fromRoleSlug,
      },
    },
    select: { id: true },
  });

  if (existingPromotion) {
    return { promoted: false as const, promotedTo: null };
  }

  const claimed = await transaction.user.updateMany({
    where: {
      id: userId,
      roleId: user.roleId,
    },
    data: {
      roleId: status.nextRole.id,
    },
  });

  if (claimed.count !== 1) {
    return { promoted: false as const, promotedTo: null };
  }

  await transaction.rolePromotion.create({
    data: {
      userId,
      fromRoleSlug,
      toRoleSlug: status.nextRole.slug,
      requirementsSnapshot: {
        lessonSlugs: status.definition?.requiredLessonSlugs ?? [],
        cityMissionKey: status.city.missionKey,
        capstoneTicketCode: status.capstone.ticketCode,
        capstoneBestScore: status.capstone.bestScore,
      },
    },
  });

  return {
    promoted: true as const,
    promotedTo: {
      name: status.nextRole.name,
      slug: status.nextRole.slug,
      level: status.nextRole.level,
    },
  };
}
