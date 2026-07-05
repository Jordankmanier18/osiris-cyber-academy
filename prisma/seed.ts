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
  console.log("Seeding Osiris Cyber Academy...");

  // Clean existing data in the correct order
  await prisma.submission.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.lab.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.profile.deleteMany();

  // Profiles
  const admin = await prisma.profile.create({
    data: {
      email: "admin@osiriscyberacademy.com",
      fullName: "Osiris Admin",
      role: "ADMIN",
      xp: 2500,
    },
  });

  const student = await prisma.profile.create({
    data: {
      email: "student@osiriscyberacademy.com",
      fullName: "David Gibson",
      role: "STUDENT",
      xp: 350,
    },
  });

  // Course with modules and lessons
  const course = await prisma.course.create({
    data: {
      title: "Cybersecurity Foundations",
      description:
        "A beginner-friendly course that teaches students how computers, networks, threats, and security tools work in the real world.",
      level: "Beginner",
      modules: {
        create: [
          {
            title: "Module 1: Computing Basics",
            description:
              "Understand hardware, software, operating systems, files, applications, and how computers process information.",
            order: 1,
            lessons: {
              create: [
                {
                  title: "What Is a Computer?",
                  content:
                    "A computer is a system that receives input, processes data, stores information, and produces output. Cybersecurity starts with understanding how these systems work.",
                  order: 1,
                },
                {
                  title: "Operating Systems",
                  content:
                    "An operating system manages hardware, software, files, users, permissions, memory, and processes. Windows, macOS, and Linux are common examples.",
                  order: 2,
                },
              ],
            },
          },
          {
            title: "Module 2: Networking Basics",
            description:
              "Learn IP addresses, ports, DNS, routers, switches, firewalls, and how devices communicate.",
            order: 2,
            lessons: {
              create: [
                {
                  title: "What Is a Network?",
                  content:
                    "A network is a group of connected devices that can communicate and share resources. The internet is the largest example of a network.",
                  order: 1,
                },
                {
                  title: "Ports and Protocols",
                  content:
                    "Ports help computers organize network communication. Protocols like HTTP, HTTPS, DNS, SSH, and RDP define how communication happens.",
                  order: 2,
                },
              ],
            },
          },
          {
            title: "Module 3: Security Fundamentals",
            description:
              "Learn core security concepts including CIA triad, authentication, authorization, patching, backups, and defense in depth.",
            order: 3,
            lessons: {
              create: [
                {
                  title: "The CIA Triad",
                  content:
                    "Confidentiality protects data from unauthorized access. Integrity protects data from unauthorized changes. Availability makes sure systems are accessible when needed.",
                  order: 1,
                },
                {
                  title: "Defense in Depth",
                  content:
                    "Defense in depth means using multiple layers of protection so one failed control does not expose the entire system.",
                  order: 2,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Missions
  const mission1 = await prisma.mission.create({
    data: {
      title: "Find the Open Port",
      description:
        "A simulated workstation is running several services. Identify the exposed management port and submit the correct answer.",
      difficulty: "Beginner",
      points: 100,
      flag: "OSIRIS{OPEN_PORT_FOUND}",
    },
  });

  await prisma.mission.createMany({
    data: [
      {
        title: "Phishing Email Investigation",
        description:
          "Review a suspicious email and identify the red flags that suggest it may be a phishing attempt.",
        difficulty: "Beginner",
        points: 150,
        flag: "OSIRIS{PHISHING_DETECTED}",
      },
      {
        title: "Weak Password Audit",
        description:
          "Analyze a list of sample accounts and identify which password pattern creates the biggest security risk.",
        difficulty: "Beginner",
        points: 125,
        flag: "OSIRIS{PASSWORD_RISK_FOUND}",
      },
      {
        title: "Log Review Challenge",
        description:
          "Review simulated authentication logs and identify the suspicious login behavior.",
        difficulty: "Intermediate",
        points: 250,
        flag: "OSIRIS{SUSPICIOUS_LOGIN}",
      },
    ],
  });

  // Labs
  await prisma.lab.createMany({
    data: [
      {
        title: "Windows Workstation Security Lab",
        description:
          "Practice basic Windows hardening, user account review, firewall checks, and update validation.",
        imageName: "windows-workstation-lab",
        status: "READY",
      },
      {
        title: "Linux Command Line Lab",
        description:
          "Learn basic Linux navigation, file permissions, process review, and system information commands.",
        imageName: "linux-cli-lab",
        status: "READY",
      },
      {
        title: "Network Scanning Lab",
        description:
          "Practice safe scanning concepts in a controlled environment using simulated hosts.",
        imageName: "network-scanning-lab",
        status: "DRAFT",
      },
    ],
  });

  // Tickets
  await prisma.ticket.createMany({
    data: [
      {
        ticketCode: "OSA-1001",
        title: "User Cannot Access Training Portal",
        description:
          "A student reports that they cannot access the training portal. Review the issue and determine the likely cause.",
        priority: "MEDIUM",
        status: "OPEN",
        points: 100,
      },
      {
        ticketCode: "OSA-1002",
        title: "Suspicious Login Alert",
        description:
          "A login alert was generated after multiple failed attempts from an unfamiliar location.",
        priority: "HIGH",
        status: "IN_PROGRESS",
        points: 200,
      },
      {
        ticketCode: "OSA-1003",
        title: "Lab VM Not Starting",
        description:
          "A student reports that their assigned lab machine is not starting. Investigate the ticket and document next steps.",
        priority: "LOW",
        status: "OPEN",
        points: 75,
      },
      {
        ticketCode: "OSA-1004",
        title: "Critical Server Patch Required",
        description:
          "A simulated server is missing an important security patch. Review the finding and prioritize remediation.",
        priority: "CRITICAL",
        status: "OPEN",
        points: 300,
      },
    ],
  });

  // Progress and submission examples
  const firstLesson = await prisma.lesson.findFirst({
    where: {
      title: "What Is a Computer?",
    },
  });

  if (firstLesson) {
    await prisma.userProgress.create({
      data: {
        profileId: student.id,
        lessonId: firstLesson.id,
        completed: true,
        completedAt: new Date(),
      },
    });
  }

  await prisma.submission.create({
    data: {
      profileId: student.id,
      missionId: mission1.id,
      answer: "OSIRIS{OPEN_PORT_FOUND}",
      isCorrect: true,
    },
  });

  console.log("Seed completed successfully.");
  console.log({ admin: admin.email, student: student.email, course: course.title });
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
