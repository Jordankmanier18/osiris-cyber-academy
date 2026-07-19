import "dotenv/config";
import { PrismaClient, type Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { roleDisplayNames } from "../lib/role-ladder";
import { apprenticeLessonQuizzes } from "./apprentice-quizzes";
import { trainingCityCurriculum } from "./training-city-curriculum";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Synchronizing Osiris Cyber Academy content safely...");

  const cyberCadet = await prisma.role.upsert({
    where: { slug: "cyber-cadet" },
    create: {
      name: roleDisplayNames["cyber-cadet"],
      slug: "cyber-cadet",
      level: 1,
      description:
        "The beginner role for new students learning computers, operating systems, networking basics, and cybersecurity fundamentals.",
      framework: "CompTIA Tech+",
      certification: "Tech+ / IT Fundamentals",
      xpRequired: 0,
      nextRoleSlug: "it-support-trainee",
    },
    update: {
      name: roleDisplayNames["cyber-cadet"],
      level: 1,
      description:
        "The beginner role for new students learning computers, operating systems, networking basics, and cybersecurity fundamentals.",
      framework: "CompTIA Tech+",
      certification: "Tech+ / IT Fundamentals",
      xpRequired: 0,
      nextRoleSlug: "it-support-trainee",
    },
  });

  const itSupportTrainee = await prisma.role.upsert({
    where: { slug: "it-support-trainee" },
    create: {
      name: roleDisplayNames["it-support-trainee"],
      slug: "it-support-trainee",
      level: 2,
      description:
        "Introduces help desk workflows, endpoint troubleshooting, user support, accounts, passwords, and basic device security.",
      framework: "CompTIA A+",
      certification: "CompTIA A+",
      xpRequired: 150,
      nextRoleSlug: "network-support-trainee",
    },
    update: {
      name: roleDisplayNames["it-support-trainee"],
      level: 2,
      description:
        "Introduces help desk workflows, endpoint troubleshooting, user support, accounts, passwords, and basic device security.",
      framework: "CompTIA A+",
      certification: "CompTIA A+",
      xpRequired: 150,
      nextRoleSlug: "network-support-trainee",
    },
  });

  const networkSupportTrainee = await prisma.role.upsert({
    where: { slug: "network-support-trainee" },
    create: {
      name: roleDisplayNames["network-support-trainee"],
      slug: "network-support-trainee",
      level: 3,
      description:
        "Focuses on networking fundamentals including IP addressing, DNS, DHCP, ports, firewalls, and basic connectivity troubleshooting.",
      framework: "CompTIA Network+",
      certification: "CompTIA Network+",
      xpRequired: 350,
      nextRoleSlug: "security-trainee",
    },
    update: {
      name: roleDisplayNames["network-support-trainee"],
      level: 3,
      description:
        "Focuses on networking fundamentals including IP addressing, DNS, DHCP, ports, firewalls, and basic connectivity troubleshooting.",
      framework: "CompTIA Network+",
      certification: "CompTIA Network+",
      xpRequired: 350,
      nextRoleSlug: "security-trainee",
    },
  });

  const securityTrainee = await prisma.role.upsert({
    where: { slug: "security-trainee" },
    create: {
      name: roleDisplayNames["security-trainee"],
      slug: "security-trainee",
      level: 4,
      description:
        "Introduces security concepts, threats, IAM, MFA, phishing, logs, risk, and foundational defensive thinking.",
      framework: "CompTIA Security+",
      certification: "CompTIA Security+",
      xpRequired: 600,
      nextRoleSlug: "junior-security-analyst",
    },
    update: {
      name: roleDisplayNames["security-trainee"],
      level: 4,
      description:
        "Introduces security concepts, threats, IAM, MFA, phishing, logs, risk, and foundational defensive thinking.",
      framework: "CompTIA Security+",
      certification: "CompTIA Security+",
      xpRequired: 600,
      nextRoleSlug: "junior-security-analyst",
    },
  });

  const juniorSecurityAnalyst = await prisma.role.upsert({
    where: { slug: "junior-security-analyst" },
    create: {
      name: roleDisplayNames["junior-security-analyst"],
      slug: "junior-security-analyst",
      level: 5,
      description:
        "Prepares the student for SOC Tier 1 work through alert triage, log review, escalation, incident notes, and basic SIEM workflows.",
      framework: "Security+ / SOC Tier 1 / NICE Cyber Defense Analyst",
      certification: "Security+ / SOC Analyst Foundations",
      xpRequired: 900,
      nextRoleSlug: "soc-analyst-i",
    },
    update: {
      name: roleDisplayNames["junior-security-analyst"],
      level: 5,
      description:
        "Prepares the student for SOC Tier 1 work through alert triage, log review, escalation, incident notes, and basic SIEM workflows.",
      framework: "Security+ / SOC Tier 1 / NICE Cyber Defense Analyst",
      certification: "Security+ / SOC Analyst Foundations",
      xpRequired: 900,
      nextRoleSlug: "soc-analyst-i",
    },
  });

  const roleIdBySlug = new Map([
    [cyberCadet.slug, cyberCadet.id],
    [itSupportTrainee.slug, itSupportTrainee.id],
    [networkSupportTrainee.slug, networkSupportTrainee.id],
    [securityTrainee.slug, securityTrainee.id],
    [juniorSecurityAnalyst.slug, juniorSecurityAnalyst.id],
  ]);

  const lessonSeedData: Prisma.LessonCreateManyInput[] = [];

  for (const district of trainingCityCurriculum) {
    const roleId = roleIdBySlug.get(district.roleSlug);

    if (!roleId) {
      throw new Error(`Role not found for curriculum: ${district.roleSlug}`);
    }

    const course = await prisma.course.upsert({
      where: { slug: district.course.slug },
      create: {
        ...district.course,
        roleId,
        isPublished: true,
      },
      update: {
        ...district.course,
        roleId,
        isPublished: true,
      },
    });

    for (const curriculumModule of district.modules) {
      const moduleRecord = await prisma.module.upsert({
        where: { slug: curriculumModule.slug },
        create: {
          title: curriculumModule.title,
          slug: curriculumModule.slug,
          description: curriculumModule.description,
          order: curriculumModule.order,
          courseId: course.id,
          isPublished: true,
        },
        update: {
          title: curriculumModule.title,
          description: curriculumModule.description,
          order: curriculumModule.order,
          courseId: course.id,
          isPublished: true,
        },
      });

      for (const lesson of curriculumModule.lessons) {
        lessonSeedData.push({
          ...lesson,
          roleId,
          moduleId: moduleRecord.id,
        });
      }
    }
  }

  for (const lesson of lessonSeedData) {
    await prisma.lesson.upsert({
      where: { slug: lesson.slug },
      create: lesson,
      update: lesson,
    });
  }

  const quizLessons = await prisma.lesson.findMany({
    where: {
      slug: {
        in: [
          "welcome-to-osiris-cyber-academy",
          "what-is-a-computer",
          "operating-systems-explained",
          "networking-fundamentals",
          "cybersecurity-fundamentals",
          "introduction-to-it-troubleshooting",
        ],
      },
    },
    select: {
      id: true,
      slug: true,
    },
  });

  const lessonIdBySlug = new Map(
    quizLessons.map((lesson) => [lesson.slug, lesson.id]),
  );

  for (const quiz of apprenticeLessonQuizzes) {
    const lessonId = lessonIdBySlug.get(quiz.lessonSlug);

    if (!lessonId) {
      throw new Error(`Lesson not found for quiz: ${quiz.lessonSlug}`);
    }

    if (quiz.questions.length !== 4) {
      throw new Error(
        `Expected four questions for Apprentice lesson: ${quiz.lessonSlug}`,
      );
    }

    const existingQuestions = await prisma.quizQuestion.findMany({
      where: { lessonId },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: { id: true, order: true },
    });
    const retainedQuestionIds: string[] = [];

    for (const [questionIndex, question] of quiz.questions.entries()) {
      const order = questionIndex + 1;
      const correctChoiceCount = question.choices.filter(
        (choice) => choice.isCorrect,
      ).length;

      if (question.choices.length !== 4 || correctChoiceCount !== 1) {
        throw new Error(
          `Question ${order} for ${quiz.lessonSlug} must have four choices and exactly one correct answer.`,
        );
      }

      const existingQuestion = existingQuestions.find(
        (candidate) => candidate.order === order,
      );
      const questionRecord = existingQuestion
        ? await prisma.quizQuestion.update({
            where: { id: existingQuestion.id },
            data: {
              question: question.question,
              explanation: question.explanation,
              order,
            },
          })
        : await prisma.quizQuestion.create({
            data: {
              lessonId,
              question: question.question,
              explanation: question.explanation,
              order,
            },
          });

      retainedQuestionIds.push(questionRecord.id);

      const existingChoices = await prisma.quizChoice.findMany({
        where: { questionId: questionRecord.id },
        orderBy: [{ order: "asc" }, { id: "asc" }],
        select: { id: true, order: true },
      });
      const retainedChoiceIds: string[] = [];

      for (const [choiceIndex, choice] of question.choices.entries()) {
        const choiceOrder = choiceIndex + 1;
        const existingChoice = existingChoices.find(
          (candidate) => candidate.order === choiceOrder,
        );
        const choiceRecord = existingChoice
          ? await prisma.quizChoice.update({
              where: { id: existingChoice.id },
              data: { ...choice, order: choiceOrder },
            })
          : await prisma.quizChoice.create({
              data: {
                ...choice,
                questionId: questionRecord.id,
                order: choiceOrder,
              },
            });

        retainedChoiceIds.push(choiceRecord.id);
      }

      await prisma.quizChoice.deleteMany({
        where: {
          questionId: questionRecord.id,
          id: { notIn: retainedChoiceIds },
        },
      });
    }

    await prisma.quizQuestion.deleteMany({
      where: {
        lessonId,
        id: { notIn: retainedQuestionIds },
      },
    });
  }

  const labSeedData: Prisma.LabCreateManyInput[] = [
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
  ];

  for (const lab of labSeedData) {
    await prisma.lab.upsert({
      where: { slug: lab.slug },
      create: lab,
      update: lab,
    });
  }

  const missionSeedData: Prisma.MissionCreateManyInput[] = [
    {
      title: "First Day at Osiris",
      slug: "first-day-at-osiris",
      description:
        "Complete your first onboarding mission and learn how role-based progression works.",
      scenario: `You have joined Osiris Cyber Academy as a ${roleDisplayNames["cyber-cadet"]}. Your first task is to understand how your training dashboard works.`,
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
  ];

  for (const mission of missionSeedData) {
    await prisma.mission.upsert({
      where: { slug: mission.slug },
      create: mission,
      update: mission,
    });
  }

  const ticketSeedData: Prisma.TicketCreateManyInput[] = [
    {
      title: "User Cannot Find a File",
      ticketCode: "OSR-CC-001",
      priority: "Low",
      scenario: "A user saved a document but cannot find it on their computer.",
      evidence:
        "User says the file was created yesterday and may have been saved to Downloads or Documents.",
      requiredAction: "Explain how you would help the user locate the file.",
      roleId: cyberCadet.id,
      difficulty: "Beginner",
      xpReward: 15,
    },
    {
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
      scenario: "A business application cannot connect to its backend server.",
      evidence:
        "Ping to the server fails by hostname but succeeds by IP address.",
      requiredAction: "Determine the likely issue and explain the next step.",
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
  ];

  for (const ticket of ticketSeedData) {
    await prisma.ticket.upsert({
      where: { ticketCode: ticket.ticketCode },
      create: ticket,
      update: ticket,
    });
  }

  console.log(
    "Content synchronization completed successfully. Learner data was preserved.",
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
