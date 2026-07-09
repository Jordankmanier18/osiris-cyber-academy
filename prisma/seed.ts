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
  console.log("Seeding Osiris Cyber Academy data...");

  await prisma.userProgress.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.lab.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  const cyberCadet = await prisma.role.create({
    data: {
      name: "Cyber Cadet",
      slug: "cyber-cadet",
      level: 1,
      description:
        "The beginner role for new students learning computers, operating systems, networking basics, and cybersecurity fundamentals.",
      framework: "CompTIA Tech+",
      certification: "Tech+ / IT Fundamentals",
      xpRequired: 0,
      nextRoleSlug: "it-support-trainee",
    },
  });

  const itSupportTrainee = await prisma.role.create({
    data: {
      name: "IT Support Trainee",
      slug: "it-support-trainee",
      level: 2,
      description:
        "Introduces help desk workflows, endpoint troubleshooting, user support, accounts, passwords, and basic device security.",
      framework: "CompTIA A+",
      certification: "CompTIA A+",
      xpRequired: 150,
      nextRoleSlug: "network-support-trainee",
    },
  });

  const networkSupportTrainee = await prisma.role.create({
    data: {
      name: "Network Support Trainee",
      slug: "network-support-trainee",
      level: 3,
      description:
        "Focuses on networking fundamentals including IP addressing, DNS, DHCP, ports, firewalls, and basic connectivity troubleshooting.",
      framework: "CompTIA Network+",
      certification: "CompTIA Network+",
      xpRequired: 350,
      nextRoleSlug: "security-trainee",
    },
  });

  const securityTrainee = await prisma.role.create({
    data: {
      name: "Security Trainee",
      slug: "security-trainee",
      level: 4,
      description:
        "Introduces security concepts, threats, IAM, MFA, phishing, logs, risk, and foundational defensive thinking.",
      framework: "CompTIA Security+",
      certification: "CompTIA Security+",
      xpRequired: 600,
      nextRoleSlug: "junior-security-analyst",
    },
  });

  const juniorSecurityAnalyst = await prisma.role.create({
    data: {
      name: "Junior Security Analyst",
      slug: "junior-security-analyst",
      level: 5,
      description:
        "Prepares the student for SOC Tier 1 work through alert triage, log review, escalation, incident notes, and basic SIEM workflows.",
      framework: "Security+ / SOC Tier 1 / NICE Cyber Defense Analyst",
      certification: "Security+ / SOC Analyst Foundations",
      xpRequired: 900,
      nextRoleSlug: "soc-analyst-i",
    },
  });

  await prisma.user.create({
    data: {
      name: "Jordan Manier",
      email: "jordan@osiris.local",
      roleId: cyberCadet.id,
      totalXp: 0,
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        title: "Welcome to Osiris Cyber Academy",
        slug: "welcome-to-osiris-cyber-academy",
        description:
          "Learn how the platform works, how roles unlock, and how missions, labs, lessons, and tickets fit together.",
        content:
          "Welcome to Osiris Cyber Academy. You will progress through cybersecurity roles by completing lessons, labs, missions, and workplace tickets.",
        roleId: cyberCadet.id,
        difficulty: "Beginner",
        xpReward: 10,
        order: 1,
      },
      {
        title: "What Is a Computer?",
        slug: "what-is-a-computer",
        description:
          "Understand the basic parts of a computer, including CPU, RAM, storage, operating systems, applications, and users.",
        content:
          "A computer is a system that receives input, processes data, stores information, and produces output.",
        roleId: cyberCadet.id,
        difficulty: "Beginner",
        xpReward: 10,
        order: 2,
      },
      {
        title: "Operating Systems Explained",
        slug: "operating-systems-explained",
        description:
          "Learn what operating systems do and how Windows, Linux, and macOS help users interact with hardware and software.",
        content:
          "An operating system manages hardware, applications, files, users, permissions, and system resources.",
        roleId: cyberCadet.id,
        difficulty: "Beginner",
        xpReward: 10,
        order: 3,
      },
      {
        title: "What Is a Network?",
        slug: "what-is-a-network",
        description:
          "Learn the basics of networks, IP addresses, routers, switches, DNS, DHCP, and internet connectivity.",
        content:
          "A network connects devices so they can communicate, share resources, and access services.",
        roleId: networkSupportTrainee.id,
        difficulty: "Beginner",
        xpReward: 15,
        order: 1,
      },
      {
        title: "Introduction to Cybersecurity",
        slug: "introduction-to-cybersecurity",
        description:
          "Learn the purpose of cybersecurity and the concepts of confidentiality, integrity, and availability.",
        content:
          "Cybersecurity protects systems, networks, applications, users, and data from unauthorized access, misuse, disruption, and damage.",
        roleId: securityTrainee.id,
        difficulty: "Beginner",
        xpReward: 15,
        order: 1,
      },
      {
        title: "Introduction to SOC Operations",
        slug: "introduction-to-soc-operations",
        description:
          "Learn what a Security Operations Center does and how analysts monitor, triage, escalate, and document alerts.",
        content:
          "A SOC is responsible for monitoring security events, investigating alerts, escalating incidents, and helping defend the organization.",
        roleId: juniorSecurityAnalyst.id,
        difficulty: "Beginner",
        xpReward: 20,
        order: 1,
      },
    ],
  });

  await prisma.lab.createMany({
    data: [
      {
        title: "Identify Computer Components",
        slug: "identify-computer-components",
        description:
          "Match basic computer components to their purpose in a simulated workstation.",
        labType: "Visual Lab",
        roleId: cyberCadet.id,
        difficulty: "Beginner",
        xpReward: 20,
        instructions:
          "Review the simulated workstation inventory and identify the CPU, RAM, storage, network adapter, and operating system.",
      },
      {
        title: "Troubleshoot a Simulated Laptop",
        slug: "troubleshoot-a-simulated-laptop",
        description:
          "Review symptoms from a user laptop and choose the most likely troubleshooting steps.",
        labType: "Endpoint Lab",
        roleId: itSupportTrainee.id,
        difficulty: "Beginner",
        xpReward: 20,
        instructions:
          "Read the user complaint, review the device status, and select the best troubleshooting path.",
      },
      {
        title: "Review Simulated Network Output",
        slug: "review-simulated-network-output",
        description:
          "Analyze simple network command output to identify IP, gateway, DNS, and connectivity status.",
        labType: "Network Lab",
        roleId: networkSupportTrainee.id,
        difficulty: "Beginner",
        xpReward: 25,
        instructions:
          "Review the simulated ipconfig and ping output. Identify the IP address, gateway, DNS server, and connectivity issue.",
      },
      {
        title: "Review Authentication Logs",
        slug: "review-authentication-logs",
        description:
          "Inspect simulated login logs and identify failed logins, successful logins, and suspicious behavior.",
        labType: "Log Analysis Lab",
        roleId: securityTrainee.id,
        difficulty: "Beginner",
        xpReward: 25,
        instructions:
          "Review the authentication log entries and identify whether the activity appears normal or suspicious.",
      },
      {
        title: "Search Simulated SIEM Logs",
        slug: "search-simulated-siem-logs",
        description:
          "Use a simulated SIEM search interface to investigate a suspicious login alert.",
        labType: "SIEM Lab",
        roleId: juniorSecurityAnalyst.id,
        difficulty: "Beginner",
        xpReward: 30,
        instructions:
          "Search the provided log data for the user, source IP, event time, MFA status, and related activity.",
      },
    ],
  });

  await prisma.mission.createMany({
    data: [
      {
        title: "First Day at Osiris",
        slug: "first-day-at-osiris",
        description:
          "Complete your first onboarding mission and learn how role-based progression works.",
        scenario:
          "You have joined Osiris Cyber Academy as a Cyber Cadet. Your first task is to understand how your training dashboard works.",
        difficulty: "Beginner",
        roleId: cyberCadet.id,
        category: "Onboarding",
        xpReward: 25,
        expectedAnswer:
          "The student should explain that lessons teach concepts, labs provide practice, missions test scenarios, and tickets simulate workplace requests.",
      },
      {
        title: "Fix a Slow Workstation",
        slug: "fix-a-slow-workstation",
        description:
          "Review a user complaint about a slow workstation and recommend the first troubleshooting steps.",
        scenario:
          "A user reports that their computer has become very slow after installing several programs and opening many browser tabs.",
        difficulty: "Beginner",
        roleId: itSupportTrainee.id,
        category: "Endpoint Troubleshooting",
        xpReward: 30,
        expectedAnswer:
          "The student should recommend checking running applications, startup programs, storage usage, memory usage, and possible malware indicators.",
      },
      {
        title: "Diagnose a DNS Issue",
        slug: "diagnose-a-dns-issue",
        description:
          "Determine whether a simulated network problem is caused by DNS, connectivity, or the destination server.",
        scenario:
          "A user can ping 8.8.8.8 but cannot browse to internal.osiris.local.",
        difficulty: "Beginner",
        roleId: networkSupportTrainee.id,
        category: "Networking",
        xpReward: 35,
        expectedAnswer:
          "The student should recognize that successful IP connectivity with name resolution failure suggests a DNS issue.",
      },
      {
        title: "Identify a Phishing Email",
        slug: "identify-a-phishing-email",
        description:
          "Review a suspicious email and identify red flags that indicate phishing.",
        scenario:
          "A user received an urgent email claiming their account will be disabled unless they click a link and re-enter their password.",
        difficulty: "Beginner",
        roleId: securityTrainee.id,
        category: "Security Awareness",
        xpReward: 35,
        expectedAnswer:
          "The student should identify urgency, suspicious links, credential request, sender mismatch, and poor grammar as phishing indicators.",
      },
      {
        title: "Triage a Suspicious Login Alert",
        slug: "triage-a-suspicious-login-alert",
        description:
          "Investigate a suspicious login alert and determine whether it should be escalated.",
        scenario:
          "A successful login occurred from an unusual foreign IP address at 2:14 AM. MFA was passed, but the user has no travel history.",
        difficulty: "Beginner",
        roleId: juniorSecurityAnalyst.id,
        category: "SOC Alert Triage",
        xpReward: 50,
        expectedAnswer:
          "The student should identify the activity as suspicious, verify user context, review related logs, check MFA details, and escalate if compromise is suspected.",
      },
    ],
  });

  await prisma.ticket.createMany({
    data: [
      {
        title: "User Cannot Find a File",
        ticketCode: "OSR-CC-001",
        priority: "Low",
        scenario:
          "A user saved a document but cannot find it on their computer.",
        evidence:
          "User says the file was created yesterday and may have been saved to Downloads or Documents.",
        requiredAction:
          "Explain how you would help the user locate the file.",
        roleId: cyberCadet.id,
        difficulty: "Beginner",
        xpReward: 15,
      },
      {
        title: "User Cannot Access Email",
        ticketCode: "OSR-IT-001",
        priority: "Medium",
        scenario:
          "A user reports they cannot access their email after changing their password.",
        evidence:
          "The user can log into their workstation but email says authentication failed.",
        requiredAction:
          "Recommend troubleshooting steps for the email access issue.",
        roleId: itSupportTrainee.id,
        difficulty: "Beginner",
        xpReward: 20,
      },
      {
        title: "Application Cannot Reach Server",
        ticketCode: "OSR-NET-001",
        priority: "Medium",
        scenario:
          "A business application cannot connect to its backend server.",
        evidence:
          "Ping to the server fails by hostname but succeeds by IP address.",
        requiredAction:
          "Determine the likely issue and explain the next step.",
        roleId: networkSupportTrainee.id,
        difficulty: "Beginner",
        xpReward: 25,
      },
      {
        title: "User Reported a Suspicious Email",
        ticketCode: "OSR-SEC-001",
        priority: "High",
        scenario:
          "A user reports an email asking them to verify their password immediately.",
        evidence:
          "Sender: security-alert@osiris-support.co. Link text: Verify Account Now.",
        requiredAction:
          "Identify whether this appears suspicious and what action should be taken.",
        roleId: securityTrainee.id,
        difficulty: "Beginner",
        xpReward: 25,
      },
      {
        title: "Suspicious Login from Foreign IP",
        ticketCode: "OSR-SOC-001",
        priority: "High",
        scenario:
          "An employee account successfully logged in from a foreign IP address outside normal working hours.",
        evidence:
          "User: m.turner@osiris.local\nLocation: Unknown\nIP: 185.220.101.45\nTime: 02:14 AM\nMFA: Passed",
        requiredAction:
          "Determine whether this alert should be escalated and explain your reasoning.",
        roleId: juniorSecurityAnalyst.id,
        difficulty: "Beginner",
        xpReward: 30,
      },
    ],
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });