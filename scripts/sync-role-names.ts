import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { roleDisplayNames } from "../lib/role-ladder";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.$transaction(
    Object.entries(roleDisplayNames).map(([slug, name]) =>
      prisma.role.update({
        where: { slug },
        data: { name },
      }),
    ),
  );

  console.log("Role display names synchronized successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
