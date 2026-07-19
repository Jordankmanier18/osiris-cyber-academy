import { apprenticeLessonContent } from "./apprentice-lessons";

export type CurriculumLesson = {
  title: string;
  slug: string;
  description: string;
  content: string;
  difficulty: string;
  xpReward: number;
  order: number;
};

export type CurriculumModule = {
  title: string;
  slug: string;
  description: string;
  order: number;
  lessons: readonly CurriculumLesson[];
};

export type DistrictCurriculum = {
  roleSlug: string;
  course: {
    title: string;
    slug: string;
    description: string;
    certification: string;
    difficulty: string;
    estimatedHours: number;
    order: number;
  };
  modules: readonly CurriculumModule[];
};

export const trainingCityCurriculum: readonly DistrictCurriculum[] = [
  {
    roleSlug: "cyber-cadet",
    course: {
      title: "Orientation Center: CompTIA Tech+ Foundations",
      slug: "cyber-cadet-comptia-tech-plus",
      description:
        "Your Orientation Center curriculum introduces the academy, computer systems, operating systems, networking, cybersecurity, and structured troubleshooting.",
      certification: "CompTIA Tech+",
      difficulty: "Beginner",
      estimatedHours: 40,
      order: 1,
    },
    modules: [
      {
        title: "Academy Orientation",
        slug: "technology-foundations",
        description:
          "Learn how Osiris Cyber Academy works and how lessons, labs, missions, tickets, XP, and city clearance fit together.",
        order: 1,
        lessons: [
          {
            title: "Welcome to Osiris Cyber Academy",
            slug: "welcome-to-osiris-cyber-academy",
            description:
              "Learn how the platform works, how roles unlock, and how missions, labs, lessons, and tickets fit together.",
            content: apprenticeLessonContent["welcome-to-osiris-cyber-academy"],
            difficulty: "Beginner",
            xpReward: 10,
            order: 1,
          },
        ],
      },
      {
        title: "Workstation Anatomy",
        slug: "computer-hardware",
        description:
          "Learn about processors, memory, storage, motherboards, peripherals, ports, and common computing devices.",
        order: 2,
        lessons: [
          {
            title: "What Is a Computer?",
            slug: "what-is-a-computer",
            description:
              "Understand the basic parts of a computer, including CPU, RAM, storage, operating systems, applications, and users.",
            content: apprenticeLessonContent["what-is-a-computer"],
            difficulty: "Beginner",
            xpReward: 10,
            order: 1,
          },
        ],
      },
      {
        title: "Operating Systems and Software",
        slug: "operating-systems-and-software",
        description:
          "Understand operating systems, applications, file systems, software installation, and basic system configuration.",
        order: 3,
        lessons: [
          {
            title: "Operating Systems Explained",
            slug: "operating-systems-explained",
            description:
              "Learn what operating systems do and how Windows, Linux, and macOS help users interact with hardware and software.",
            content: apprenticeLessonContent["operating-systems-explained"],
            difficulty: "Beginner",
            xpReward: 10,
            order: 1,
          },
        ],
      },
      {
        title: "Network and Internet Basics",
        slug: "networking-and-internet-fundamentals",
        description:
          "Learn how devices communicate through networks using IP addresses, routers, switches, DNS, DHCP, and internet services.",
        order: 4,
        lessons: [
          {
            title: "Networking Fundamentals",
            slug: "networking-fundamentals",
            description:
              "Learn the basics of networks, IP addresses, routers, switches, DNS, DHCP, and internet connectivity.",
            content: apprenticeLessonContent["networking-fundamentals"],
            difficulty: "Beginner",
            xpReward: 10,
            order: 1,
          },
        ],
      },
      {
        title: "Cybersecurity Fundamentals",
        slug: "cybersecurity-fundamentals",
        description:
          "Learn foundational security concepts, common threats, account protection, safe computing, and data protection.",
        order: 5,
        lessons: [
          {
            title: "Cybersecurity Fundamentals",
            slug: "cybersecurity-fundamentals",
            description:
              "Learn the purpose of cybersecurity and the concepts of confidentiality, integrity, and availability.",
            content: apprenticeLessonContent["cybersecurity-fundamentals"],
            difficulty: "Beginner",
            xpReward: 10,
            order: 1,
          },
        ],
      },
      {
        title: "IT Troubleshooting and Support",
        slug: "it-troubleshooting-and-support",
        description:
          "Practice structured troubleshooting, user communication, documentation, and basic workplace support procedures.",
        order: 6,
        lessons: [
          {
            title: "Introduction to IT Troubleshooting",
            slug: "introduction-to-it-troubleshooting",
            description:
              "Learn a structured troubleshooting process for identifying, testing, resolving, and documenting technical problems.",
            content:
              apprenticeLessonContent["introduction-to-it-troubleshooting"],
            difficulty: "Beginner",
            xpReward: 10,
            order: 1,
          },
        ],
      },
    ],
  },
  {
    roleSlug: "it-support-trainee",
    course: {
      title: "Help Desk Office: IT Support Operations",
      slug: "help-desk-office-it-support-operations",
      description:
        "Train inside the Help Desk Office by handling user requests, troubleshooting endpoints, restoring account access, and documenting resolutions.",
      certification: "CompTIA A+",
      difficulty: "Beginner",
      estimatedHours: 45,
      order: 1,
    },
    modules: [
      {
        title: "Ticket Intake and User Communication",
        slug: "help-desk-ticket-intake",
        description:
          "Learn how to gather symptoms, set expectations, prioritize requests, and communicate clearly with users.",
        order: 1,
        lessons: [
          {
            title: "The Help Desk Ticket Lifecycle",
            slug: "help-desk-ticket-lifecycle",
            description:
              "Follow a support request from intake and triage through resolution, documentation, and closure.",
            content:
              "A strong help desk workflow begins with accurate intake. Confirm the user, capture the symptoms and business impact, assign a priority, document each troubleshooting step, verify the solution with the user, and record a clear resolution before closing the ticket.",
            difficulty: "Beginner",
            xpReward: 15,
            order: 1,
          },
        ],
      },
      {
        title: "Workstation Troubleshooting",
        slug: "help-desk-workstation-troubleshooting",
        description:
          "Use repeatable diagnostic steps to investigate performance, software, peripheral, and startup problems.",
        order: 2,
        lessons: [
          {
            title: "Diagnosing a Slow Workstation",
            slug: "diagnosing-a-slow-workstation",
            description:
              "Investigate common causes of poor endpoint performance without jumping to conclusions.",
            content:
              "Start by reproducing the symptom and checking CPU, memory, disk, startup applications, available storage, recent changes, and malware indicators. Change one variable at a time, measure the result, and document what you observed.",
            difficulty: "Beginner",
            xpReward: 15,
            order: 1,
          },
        ],
      },
      {
        title: "Accounts, Passwords, and Access",
        slug: "help-desk-account-access",
        description:
          "Support account recovery while protecting identity, permissions, and organizational security.",
        order: 3,
        lessons: [
          {
            title: "Safe Account Access Support",
            slug: "safe-account-access-support",
            description:
              "Verify identity and restore access without weakening security controls.",
            content:
              "Before resetting a password or changing access, verify the requester using the approved identity process. Check account status, lockout events, password synchronization, and MFA. Grant only the access required and never ask a user to reveal their password.",
            difficulty: "Beginner",
            xpReward: 15,
            order: 1,
          },
        ],
      },
      {
        title: "Resolution Notes and Escalation",
        slug: "help-desk-documentation-escalation",
        description:
          "Create useful case notes and recognize when an issue needs another team or a higher support tier.",
        order: 4,
        lessons: [
          {
            title: "Writing Useful Resolution Notes",
            slug: "writing-useful-resolution-notes",
            description:
              "Document symptoms, evidence, actions, outcomes, and follow-up in a way another technician can use.",
            content:
              "Good notes state what the user reported, what you observed, the troubleshooting steps taken, the result of each step, the final resolution, and any follow-up. Escalate with enough evidence that the next technician does not need to restart the investigation.",
            difficulty: "Beginner",
            xpReward: 15,
            order: 1,
          },
        ],
      },
    ],
  },
  {
    roleSlug: "network-support-trainee",
    course: {
      title: "DNS Tower: Network Support Operations",
      slug: "dns-tower-network-support-operations",
      description:
        "Operate from DNS Tower while learning addressing, core network services, name resolution, and structured connectivity diagnostics.",
      certification: "CompTIA Network+",
      difficulty: "Beginner",
      estimatedHours: 50,
      order: 1,
    },
    modules: [
      {
        title: "Network Operations Foundations",
        slug: "network-operations-foundations",
        description:
          "Understand the devices, services, and communication paths that make modern networks work.",
        order: 1,
        lessons: [
          {
            title: "What Is a Network?",
            slug: "what-is-a-network",
            description:
              "Learn the basics of networks, IP addresses, routers, switches, DNS, DHCP, and internet connectivity.",
            content:
              "A network connects devices so they can communicate, share resources, and access services.",
            difficulty: "Beginner",
            xpReward: 15,
            order: 1,
          },
        ],
      },
      {
        title: "IP Addressing and Routing",
        slug: "ip-addressing-and-routing",
        description:
          "Read IPv4 configuration and understand how hosts reach local and remote destinations.",
        order: 2,
        lessons: [
          {
            title: "IP Addressing Basics",
            slug: "ip-addressing-basics",
            description:
              "Identify host addresses, subnet masks, default gateways, and the role each value plays.",
            content:
              "An IPv4 configuration gives a host an address, defines its local network with a subnet mask, and identifies a default gateway for remote traffic. Compare the source and destination networks before deciding whether traffic should remain local or pass through a router.",
            difficulty: "Beginner",
            xpReward: 15,
            order: 1,
          },
        ],
      },
      {
        title: "DNS and DHCP Services",
        slug: "dns-and-dhcp-services",
        description:
          "Learn how clients receive network settings and translate service names into IP addresses.",
        order: 3,
        lessons: [
          {
            title: "How DNS and DHCP Work",
            slug: "how-dns-and-dhcp-work",
            description:
              "Distinguish dynamic address configuration from name resolution and identify common failure symptoms.",
            content:
              "DHCP supplies clients with settings such as an IP address, subnet mask, gateway, and DNS servers. DNS translates names into addresses. If a host can reach an IP address but not the matching hostname, investigate name resolution before assuming the entire network is down.",
            difficulty: "Beginner",
            xpReward: 15,
            order: 1,
          },
        ],
      },
      {
        title: "Connectivity Diagnostics",
        slug: "connectivity-diagnostics",
        description:
          "Use a layered troubleshooting path to isolate endpoint, local network, routing, DNS, and service problems.",
        order: 4,
        lessons: [
          {
            title: "A Structured Connectivity Check",
            slug: "structured-connectivity-check",
            description:
              "Test from the local host outward and use each result to narrow the fault domain.",
            content:
              "Confirm the physical or wireless connection, inspect the host configuration, test the local interface, test the gateway, test a remote IP, test DNS resolution, and finally test the target service. Record each result so the evidence points to the failing layer.",
            difficulty: "Beginner",
            xpReward: 15,
            order: 1,
          },
        ],
      },
    ],
  },
  {
    roleSlug: "security-trainee",
    course: {
      title: "Security Awareness Office: Defensive Foundations",
      slug: "security-awareness-office-defensive-foundations",
      description:
        "Build defensive judgment through security principles, phishing recognition, identity protection, and responsible incident reporting.",
      certification: "CompTIA Security+",
      difficulty: "Beginner",
      estimatedHours: 50,
      order: 1,
    },
    modules: [
      {
        title: "Security Foundations",
        slug: "security-operations-foundations",
        description:
          "Understand core defensive goals, common threats, risk, and the shared responsibility for protecting systems and data.",
        order: 1,
        lessons: [
          {
            title: "Introduction to Cybersecurity",
            slug: "introduction-to-cybersecurity",
            description:
              "Learn the purpose of cybersecurity and the concepts of confidentiality, integrity, and availability.",
            content:
              "Cybersecurity protects systems, networks, applications, users, and data from unauthorized access, misuse, disruption, and damage.",
            difficulty: "Beginner",
            xpReward: 15,
            order: 1,
          },
        ],
      },
      {
        title: "Phishing and Social Engineering",
        slug: "phishing-and-social-engineering",
        description:
          "Recognize manipulation tactics, suspicious messages, deceptive links, and unsafe requests.",
        order: 2,
        lessons: [
          {
            title: "Spotting Phishing Attempts",
            slug: "spotting-phishing-attempts",
            description:
              "Evaluate sender identity, urgency, links, attachments, and credential requests before taking action.",
            content:
              "Phishing often combines urgency, fear, or authority with a request to click, open, pay, or disclose information. Verify the sender through a trusted channel, inspect destinations carefully, avoid unknown attachments, and report suspicious messages using the approved process.",
            difficulty: "Beginner",
            xpReward: 15,
            order: 1,
          },
        ],
      },
      {
        title: "Identity and Access Protection",
        slug: "identity-and-access-protection",
        description:
          "Use strong authentication, least privilege, and safe account practices to reduce identity risk.",
        order: 3,
        lessons: [
          {
            title: "MFA and Least Privilege",
            slug: "mfa-and-least-privilege",
            description:
              "Understand why layered authentication and limited permissions reduce the impact of compromised credentials.",
            content:
              "Multi-factor authentication adds another proof of identity beyond a password. Least privilege limits users and systems to only the access required for their work. Together they reduce both the likelihood and potential impact of account misuse.",
            difficulty: "Beginner",
            xpReward: 15,
            order: 1,
          },
        ],
      },
      {
        title: "Security Incident Reporting",
        slug: "security-incident-reporting",
        description:
          "Preserve useful evidence, report quickly, and avoid actions that could make an incident harder to investigate.",
        order: 4,
        lessons: [
          {
            title: "Reporting a Security Incident",
            slug: "reporting-a-security-incident",
            description:
              "Capture who, what, when, where, and how without changing or destroying important evidence.",
            content:
              "Report suspected incidents promptly through the approved channel. Record timestamps, affected users and systems, observed behavior, and actions already taken. Do not delete messages, wipe systems, or investigate beyond your authority when those actions could alter evidence.",
            difficulty: "Beginner",
            xpReward: 15,
            order: 1,
          },
        ],
      },
    ],
  },
  {
    roleSlug: "junior-security-analyst",
    course: {
      title: "SOC Police Station: Tier 1 Operations",
      slug: "soc-police-station-tier-1-operations",
      description:
        "Prepare for Tier 1 SOC work through analyst workflow, alert triage, log investigation, escalation, and defensible case notes.",
      certification: "Security+ / SOC Analyst Foundations",
      difficulty: "Beginner",
      estimatedHours: 60,
      order: 1,
    },
    modules: [
      {
        title: "SOC Operations and Analyst Workflow",
        slug: "soc-analyst-workflow",
        description:
          "Understand SOC responsibilities, queues, evidence sources, escalation paths, and the Tier 1 analyst mindset.",
        order: 1,
        lessons: [
          {
            title: "Introduction to SOC Operations",
            slug: "introduction-to-soc-operations",
            description:
              "Learn what a Security Operations Center does and how analysts monitor, triage, escalate, and document alerts.",
            content:
              "A SOC is responsible for monitoring security events, investigating alerts, escalating incidents, and helping defend the organization.",
            difficulty: "Beginner",
            xpReward: 20,
            order: 1,
          },
        ],
      },
      {
        title: "Alert Triage",
        slug: "soc-alert-triage",
        description:
          "Validate alert context, assess severity, distinguish likely false positives, and choose the next action.",
        order: 2,
        lessons: [
          {
            title: "Alert Triage Fundamentals",
            slug: "alert-triage-fundamentals",
            description:
              "Use alert evidence, asset context, user context, and related activity to form an initial assessment.",
            content:
              "Begin by confirming what detection fired, when it occurred, and which users, hosts, or accounts are involved. Gather related events, compare the activity with expected behavior, assess potential impact, and document why you closed or escalated the alert.",
            difficulty: "Beginner",
            xpReward: 20,
            order: 1,
          },
        ],
      },
      {
        title: "Log and SIEM Investigation",
        slug: "soc-log-siem-investigation",
        description:
          "Search and correlate authentication, endpoint, network, and security telemetry around an alert.",
        order: 3,
        lessons: [
          {
            title: "Reading Authentication Logs",
            slug: "reading-authentication-logs",
            description:
              "Identify successful and failed logins, sources, timestamps, MFA results, and suspicious patterns.",
            content:
              "Authentication logs can show the account, result, source, destination, time, and authentication method. Look for unusual locations, impossible timing, repeated failures, unexpected MFA behavior, new devices, and activity that continues after a successful login.",
            difficulty: "Beginner",
            xpReward: 20,
            order: 1,
          },
        ],
      },
      {
        title: "Escalation and Case Documentation",
        slug: "soc-escalation-documentation",
        description:
          "Escalate with clear evidence, severity, scope, investigative steps, and recommended containment actions.",
        order: 4,
        lessons: [
          {
            title: "Writing an Analyst Case Note",
            slug: "writing-an-analyst-case-note",
            description:
              "Turn raw evidence into a concise timeline, assessment, and handoff another analyst can defend.",
            content:
              "A useful case note identifies the alert, affected entities, timestamps, evidence reviewed, investigative queries, key findings, scope, severity, and disposition. Separate observed facts from assumptions and explain the reason for every recommended next step.",
            difficulty: "Beginner",
            xpReward: 20,
            order: 1,
          },
        ],
      },
    ],
  },
];
