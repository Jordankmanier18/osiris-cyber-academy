import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const cyberCadet = await prisma.role.findUnique({
    where: { slug: "cyber-cadet" },
    select: { id: true },
  });

  if (!cyberCadet) {
    throw new Error(
      "Cybersecurity Apprentice role is missing. Run npm run db:sync-content.",
    );
  }

  await prisma.ticket.upsert({
    where: { ticketCode: "OSR-CC-CAP-001" },
    create: {
      title: "Orientation Center Security Review",
      ticketCode: "OSR-CC-CAP-001",
      priority: "High",
      scenario:
        "The Payroll App Server allows SSH from the entire internet, accepts password authentication, and does not send access events to the SOC. Administrators only require access from 10.20.30.0/24.",
      evidence:
        "NSG source: 0.0.0.0/0\nService: SSH / TCP 22\nAuthentication: Password enabled\nAuthorized administrator network: 10.20.30.0/24\nAccess logging: Disabled",
      requiredAction:
        "Assess the risk, choose the correct remediation controls, define how you will validate the fix, and write a concise ticket closure note.",
      roleId: cyberCadet.id,
      difficulty: "Capstone",
      xpReward: 40,
    },
    update: {
      title: "Orientation Center Security Review",
      priority: "High",
      scenario:
        "The Payroll App Server allows SSH from the entire internet, accepts password authentication, and does not send access events to the SOC. Administrators only require access from 10.20.30.0/24.",
      evidence:
        "NSG source: 0.0.0.0/0\nService: SSH / TCP 22\nAuthentication: Password enabled\nAuthorized administrator network: 10.20.30.0/24\nAccess logging: Disabled",
      requiredAction:
        "Assess the risk, choose the correct remediation controls, define how you will validate the fix, and write a concise ticket closure note.",
      roleId: cyberCadet.id,
      difficulty: "Capstone",
      xpReward: 40,
    },
  });

  console.log("Promotion content synchronized: OSR-CC-CAP-001 ready.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
