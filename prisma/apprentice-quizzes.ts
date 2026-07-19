export type ApprenticeQuizChoice = {
  text: string;
  isCorrect: boolean;
};

export type ApprenticeQuizQuestion = {
  question: string;
  explanation: string;
  choices: readonly ApprenticeQuizChoice[];
};

export type ApprenticeLessonQuiz = {
  lessonSlug: string;
  questions: readonly ApprenticeQuizQuestion[];
};

export const apprenticeLessonQuizzes: readonly ApprenticeLessonQuiz[] = [
  {
    lessonSlug: "welcome-to-osiris-cyber-academy",
    questions: [
      {
        question:
          "A concept is new to you and your next city mission depends on it. What is the best Osiris workflow?",
        explanation:
          "Lessons build understanding, the Training City lets you test that understanding, and the capstone ticket verifies that you can apply and document it.",
        choices: [
          {
            text: "Read the lesson, practice in the city, then complete the capstone ticket",
            isCorrect: true,
          },
          {
            text: "Skip directly to the capstone and guess until it passes",
            isCorrect: false,
          },
          {
            text: "Only collect XP and ignore the mission evidence",
            isCorrect: false,
          },
          {
            text: "Wait for the next role to unlock automatically",
            isCorrect: false,
          },
        ],
      },
      {
        question:
          "During a simulation, you are unsure whether an action is allowed. What should you do?",
        explanation:
          "Cybersecurity work must stay within authorization. Pause, review the mission scope, and escalate uncertainty instead of acting outside the approved environment.",
        choices: [
          {
            text: "Try the same action against a public system to compare results",
            isCorrect: false,
          },
          {
            text: "Pause, confirm the authorized scope, and ask for guidance if needed",
            isCorrect: true,
          },
          {
            text: "Continue as long as the action is technically possible",
            isCorrect: false,
          },
          {
            text: "Hide the action from the event timeline",
            isCorrect: false,
          },
        ],
      },
      {
        question: "Which submission best demonstrates job-ready thinking?",
        explanation:
          "A useful professional record connects the symptom, evidence, action, validation, and outcome so another person can understand and continue the work.",
        choices: [
          {
            text: "Fixed it",
            isCorrect: false,
          },
          {
            text: "A screenshot with no explanation",
            isCorrect: false,
          },
          {
            text: "The observed evidence, action taken, test result, and final outcome",
            isCorrect: true,
          },
          {
            text: "A list of tools you might use someday",
            isCorrect: false,
          },
        ],
      },
      {
        question:
          "What must an Apprentice complete before the first promotion capstone becomes available?",
        explanation:
          "The first promotion path requires all six Apprentice lessons and the Open SSH Door Training City mission before the capstone ticket unlocks.",
        choices: [
          {
            text: "Only the first lesson",
            isCorrect: false,
          },
          {
            text: "All six Apprentice lessons and the required Training City mission",
            isCorrect: true,
          },
          {
            text: "Every mission in the entire city",
            isCorrect: false,
          },
          {
            text: "A leaderboard rank",
            isCorrect: false,
          },
        ],
      },
    ],
  },
  {
    lessonSlug: "what-is-a-computer",
    questions: [
      {
        question:
          "A workstation becomes slow only when several applications are open. Which resource should you inspect first?",
        explanation:
          "Running applications keep active instructions and data in RAM. Heavy memory use can force the system to use slower storage and make the workstation feel unresponsive.",
        choices: [
          { text: "RAM utilization", isCorrect: true },
          { text: "Monitor brightness", isCorrect: false },
          { text: "Keyboard layout", isCorrect: false },
          { text: "Printer paper level", isCorrect: false },
        ],
      },
      {
        question:
          "Which component performs the instructions that make applications run?",
        explanation:
          "The CPU executes instructions and coordinates processing. RAM holds active working data, while storage retains data when power is removed.",
        choices: [
          { text: "CPU", isCorrect: true },
          { text: "SSD", isCorrect: false },
          { text: "Network cable", isCorrect: false },
          { text: "Display", isCorrect: false },
        ],
      },
      {
        question:
          "A laptop loses a report after its battery dies before the report was saved. Which distinction best explains the loss?",
        explanation:
          "RAM is volatile and loses its contents without power. Saved files are written to nonvolatile storage such as an SSD.",
        choices: [
          {
            text: "The unsaved report was only in volatile memory, not persistent storage",
            isCorrect: true,
          },
          {
            text: "The CPU permanently deletes files whenever power is lost",
            isCorrect: false,
          },
          {
            text: "The network adapter stores every open document",
            isCorrect: false,
          },
          {
            text: "The monitor failed to encrypt the report",
            isCorrect: false,
          },
        ],
      },
      {
        question:
          "Why should a support technician record a device's hostname, owner, operating system, and network adapter?",
        explanation:
          "Accurate asset details identify the affected system, provide troubleshooting context, and create a reliable record for support and security teams.",
        choices: [
          {
            text: "To identify the asset and give the investigation reliable context",
            isCorrect: true,
          },
          {
            text: "To make the device use more storage",
            isCorrect: false,
          },
          {
            text: "To bypass the user's access controls",
            isCorrect: false,
          },
          {
            text: "To avoid reproducing the reported problem",
            isCorrect: false,
          },
        ],
      },
    ],
  },
  {
    lessonSlug: "operating-systems-explained",
    questions: [
      {
        question:
          "A user can open a folder but cannot edit a file inside it. What should you investigate first?",
        explanation:
          "The operating system enforces user and group permissions. The user may have read access without the write permission required to change the file.",
        choices: [
          { text: "File and folder permissions", isCorrect: true },
          { text: "Screen resolution", isCorrect: false },
          { text: "CPU clock speed", isCorrect: false },
          { text: "DNS cache", isCorrect: false },
        ],
      },
      {
        question:
          "An application window is closed, but its background process is still using CPU. Which operating-system function helps you investigate?",
        explanation:
          "Process-management tools show running processes and their resource use, even when no application window is visible.",
        choices: [
          { text: "Process management", isCorrect: true },
          { text: "Disk formatting", isCorrect: false },
          { text: "Name resolution", isCorrect: false },
          { text: "Display calibration", isCorrect: false },
        ],
      },
      {
        question:
          "Why is a standard user account safer for daily work than an administrator account?",
        explanation:
          "Least privilege limits what a user—or malicious software running as that user—can change without explicit administrative approval.",
        choices: [
          {
            text: "It limits the changes the user and malicious software can make",
            isCorrect: true,
          },
          {
            text: "It makes every application run faster",
            isCorrect: false,
          },
          {
            text: "It removes the need for software updates",
            isCorrect: false,
          },
          {
            text: "It guarantees that files cannot be deleted",
            isCorrect: false,
          },
        ],
      },
      {
        question:
          "A service repeatedly stops overnight. Which evidence is most useful before restarting it again?",
        explanation:
          "System and application logs preserve timestamps, error messages, and surrounding events that can reveal why a service stopped.",
        choices: [
          { text: "Relevant system and application logs", isCorrect: true },
          { text: "The wallpaper image", isCorrect: false },
          { text: "A list of nearby printers", isCorrect: false },
          { text: "The user's browser bookmarks", isCorrect: false },
        ],
      },
    ],
  },
  {
    lessonSlug: "networking-fundamentals",
    questions: [
      {
        question:
          "A workstation can reach 8.8.8.8 but cannot open portal.osiris.local. What should you investigate first?",
        explanation:
          "Successful communication with an IP address shows basic connectivity is working. Failure only by name points first to DNS resolution.",
        choices: [
          { text: "DNS resolution", isCorrect: true },
          { text: "The monitor cable", isCorrect: false },
          { text: "The keyboard driver", isCorrect: false },
          { text: "The workstation's RAM", isCorrect: false },
        ],
      },
      {
        question:
          "Which device normally forwards traffic from a local network to a different network?",
        explanation:
          "A router connects networks and uses routing information to forward packets toward remote destinations.",
        choices: [
          { text: "Router", isCorrect: true },
          { text: "Keyboard", isCorrect: false },
          { text: "Local SSD", isCorrect: false },
          { text: "Monitor", isCorrect: false },
        ],
      },
      {
        question:
          "A new laptop joins the office Wi-Fi and automatically receives an IP address, gateway, and DNS server. Which service provided those settings?",
        explanation:
          "DHCP automatically leases network configuration to clients so each device does not need to be configured manually.",
        choices: [
          { text: "DHCP", isCorrect: true },
          { text: "HTTPS", isCorrect: false },
          { text: "SSH", isCorrect: false },
          { text: "MFA", isCorrect: false },
        ],
      },
      {
        question:
          "Why are network ports compared with doors in Mission Training City?",
        explanation:
          "A port identifies a specific network service. Like a door, it creates a defined entry point that should be open only when the service is needed and properly protected.",
        choices: [
          {
            text: "They identify service entry points that must be intentionally controlled",
            isCorrect: true,
          },
          {
            text: "They physically store all network traffic",
            isCorrect: false,
          },
          {
            text: "They replace IP addresses on the internet",
            isCorrect: false,
          },
          {
            text: "They automatically authenticate every user",
            isCorrect: false,
          },
        ],
      },
    ],
  },
  {
    lessonSlug: "cybersecurity-fundamentals",
    questions: [
      {
        question:
          "Payroll records are visible to an employee who does not need them. Which security objective has failed?",
        explanation:
          "Confidentiality limits information to authorized people and systems. Unnecessary access exposes sensitive data even if the records were not changed.",
        choices: [
          { text: "Confidentiality", isCorrect: true },
          { text: "Availability", isCorrect: false },
          { text: "Performance", isCorrect: false },
          { text: "Portability", isCorrect: false },
        ],
      },
      {
        question:
          "A threat actor could exploit an internet-exposed server with a weak password. In this scenario, what is the vulnerability?",
        explanation:
          "The threat actor is the potential source of harm. The exposed service and weak authentication are weaknesses—the vulnerabilities—that make harm more likely.",
        choices: [
          { text: "The weak password and exposed service", isCorrect: true },
          { text: "The threat actor", isCorrect: false },
          { text: "The security analyst", isCorrect: false },
          { text: "The completed incident report", isCorrect: false },
        ],
      },
      {
        question:
          "Which control most directly reduces the damage caused by a stolen password?",
        explanation:
          "Multi-factor authentication requires another proof of identity, so possession of the password alone is less likely to be enough for access.",
        choices: [
          { text: "Multi-factor authentication", isCorrect: true },
          { text: "A brighter monitor", isCorrect: false },
          { text: "A larger hard drive", isCorrect: false },
          { text: "Disabling all logs", isCorrect: false },
        ],
      },
      {
        question:
          "A user reports a suspicious attachment but has not opened it. What is the best first response?",
        explanation:
          "Preserve the evidence, avoid interacting with the attachment, gather the relevant message details, and follow the approved reporting or escalation process.",
        choices: [
          {
            text: "Preserve the message, avoid opening the attachment, and report it through the approved process",
            isCorrect: true,
          },
          {
            text: "Open the attachment to see what it does",
            isCorrect: false,
          },
          {
            text: "Forward it to coworkers for a second opinion",
            isCorrect: false,
          },
          {
            text: "Delete all email from the user's mailbox",
            isCorrect: false,
          },
        ],
      },
    ],
  },
  {
    lessonSlug: "introduction-to-it-troubleshooting",
    questions: [
      {
        question:
          "A user says, ‘The internet is broken.’ What should you do before changing any settings?",
        explanation:
          "Clarify the symptom, scope, timing, impact, error messages, and recent changes. A precise problem statement prevents random changes and narrows the investigation.",
        choices: [
          {
            text: "Ask focused questions and reproduce or verify the symptom",
            isCorrect: true,
          },
          {
            text: "Replace the router immediately",
            isCorrect: false,
          },
          {
            text: "Reset every network device in the building",
            isCorrect: false,
          },
          {
            text: "Close the ticket because the report is vague",
            isCorrect: false,
          },
        ],
      },
      {
        question:
          "You have three possible causes for a slow workstation. What is the safest way to test them?",
        explanation:
          "Test the most likely cause with the least disruptive step, change one variable at a time, and record the result so you know what affected the symptom.",
        choices: [
          {
            text: "Test one likely cause at a time and record each result",
            isCorrect: true,
          },
          {
            text: "Apply every possible fix at once",
            isCorrect: false,
          },
          {
            text: "Delete user data to create more storage",
            isCorrect: false,
          },
          {
            text: "Ignore recent changes because they are already complete",
            isCorrect: false,
          },
        ],
      },
      {
        question:
          "A proposed fix could interrupt payroll for the whole company. What should an Apprentice do?",
        explanation:
          "High-impact changes require authorization, a rollback plan, and usually escalation to the appropriate owner. Technical ability does not replace change control.",
        choices: [
          {
            text: "Pause, document the risk, and escalate for authorization",
            isCorrect: true,
          },
          {
            text: "Apply it immediately before anyone notices",
            isCorrect: false,
          },
          {
            text: "Ask the affected user to approve the enterprise change",
            isCorrect: false,
          },
          {
            text: "Remove monitoring so the interruption creates fewer alerts",
            isCorrect: false,
          },
        ],
      },
      {
        question:
          "After applying a fix, which action is required before closing the ticket?",
        explanation:
          "A fix is not complete until the original symptom is retested, security and business functions are verified, and the evidence and outcome are documented.",
        choices: [
          {
            text: "Verify the original problem is resolved and document the outcome",
            isCorrect: true,
          },
          {
            text: "Close the ticket as soon as the change saves",
            isCorrect: false,
          },
          {
            text: "Erase the troubleshooting history",
            isCorrect: false,
          },
          {
            text: "Wait for another user to report the same issue",
            isCorrect: false,
          },
        ],
      },
    ],
  },
];
