import "dotenv/config";
import { spawnSync } from "node:child_process";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const RESET_CONFIRMATION = "DELETE_LOCAL_LEARNER_DATA";
const LOCAL_DATABASE_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function assertDevelopmentResetIsSafe() {
  if (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production"
  ) {
    throw new Error(
      "Database reset refused: destructive resets are disabled in production.",
    );
  }

  if (process.env.OSIRIS_DEVELOPMENT_RESET !== RESET_CONFIRMATION) {
    throw new Error(
      `Database reset refused. To reset a local development database, set OSIRIS_DEVELOPMENT_RESET=${RESET_CONFIRMATION}.`,
    );
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Database reset refused: DATABASE_URL is not configured.");
  }

  let databaseHost: string;

  try {
    databaseHost = new URL(databaseUrl).hostname;
  } catch {
    throw new Error("Database reset refused: DATABASE_URL is invalid.");
  }

  if (!LOCAL_DATABASE_HOSTS.has(databaseHost)) {
    throw new Error(
      `Database reset refused: ${databaseHost} is not a local database host.`,
    );
  }
}

assertDevelopmentResetIsSafe();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.warn(
    "Resetting the local Osiris development database. Learner accounts and progress will be deleted.",
  );

  await prisma.$transaction([
    prisma.rolePromotion.deleteMany(),
    prisma.ticketProgress.deleteMany(),
    prisma.trainingCityProgress.deleteMany(),
    prisma.userProgress.deleteMany(),
    prisma.submission.deleteMany(),
    prisma.quizChoice.deleteMany(),
    prisma.quizQuestion.deleteMany(),
    prisma.ticket.deleteMany(),
    prisma.lab.deleteMany(),
    prisma.lesson.deleteMany(),
    prisma.module.deleteMany(),
    prisma.course.deleteMany(),
    prisma.mission.deleteMany(),
    prisma.user.deleteMany(),
    prisma.role.deleteMany(),
  ]);

  console.log("Local database reset completed. Restoring academy content...");
}

main()
  .then(async () => {
    await prisma.$disconnect();

    const sync = spawnSync("npm", ["run", "db:sync-content"], {
      cwd: process.cwd(),
      env: process.env,
      stdio: "inherit",
    });

    if (sync.error) {
      throw sync.error;
    }

    if (sync.status !== 0) {
      throw new Error("Content synchronization failed after the local reset.");
    }
  })
  .catch(async (error) => {
    await prisma.$disconnect();
    console.error(error);
    process.exit(1);
  });
