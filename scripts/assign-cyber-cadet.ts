import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const cyberCadetRole = await prisma.role.findUnique({
    where: {
      slug: "cyber-cadet",
    },
  });

  if (!cyberCadetRole) {
    throw new Error(
      "Cybersecurity Apprentice role was not found. Run: npx prisma db seed",
    );
  }

  const result = await prisma.user.updateMany({
    where: {
      roleId: null,
    },
    data: {
      roleId: cyberCadetRole.id,
    },
  });

  const users = await prisma.user.findMany({
    select: {
      name: true,
      email: true,
      role: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  console.log(`Updated ${result.count} user account(s).`);
  console.table(
    users.map((user) => ({
      name: user.name,
      email: user.email,
      role: user.role?.name ?? "No role",
      roleSlug: user.role?.slug ?? "None",
    })),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
