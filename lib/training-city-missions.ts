export type TrainingCityControl = {
  id: string;
  label: string;
  description: string;
  score: number;
};

export type TrainingCityMission = {
  id: string;
  title: string;
  briefing: string;
  objective: string;
  requiredLevel: number;
  requiredRole: string;
  prerequisiteMissionId?: string;
  targetAsset: string;
  attackPath: string[];
  controls: TrainingCityControl[];
  xpReward: number;
  framework: string;
  debrief: string;
};

export const trainingCityMissions: readonly TrainingCityMission[] = [
  {
    id: "open-ssh-door",
    title: "Open SSH Door",
    briefing: "The Payroll App Server is exposing SSH to the entire internet.",
    objective:
      "Restrict the door and replace password access before the attacker arrives.",
    requiredLevel: 1,
    requiredRole: "Cyber Cadet",
    targetAsset: "Payroll App Server",
    attackPath: ["Internet Gate", "Payroll App Server", "Payroll Bank"],
    controls: [
      {
        id: "nsg",
        label: "Restrict NSG rule",
        description: "Allow SSH only from the administrator network.",
        score: 25,
      },
      {
        id: "ssh-key",
        label: "Require SSH key",
        description: "Disable password-based server access.",
        score: 20,
      },
      {
        id: "logging",
        label: "Enable sign-in logging",
        description: "Send access events to the SOC Police Station.",
        score: 15,
      },
    ],
    xpReward: 50,
    framework: "CIS Controls 4 and 12 · NIST AC-3 and SC-7",
    debrief:
      "Restricting the network path reduced exposure, key authentication strengthened access, and logging gave the SOC evidence for investigation.",
  },
  {
    id: "unpatched-workstation",
    title: "Unpatched Workstation",
    briefing:
      "An employee house is missing critical updates and endpoint protection.",
    objective: "Patch the workstation and activate its local defenses.",
    requiredLevel: 2,
    requiredRole: "IT Support Trainee",
    prerequisiteMissionId: "open-ssh-door",
    targetAsset: "Employee House",
    attackPath: ["Phishing Mailbox", "Employee House", "Payroll App Server"],
    controls: [
      {
        id: "patch",
        label: "Install security updates",
        description: "Close known workstation vulnerabilities.",
        score: 25,
      },
      {
        id: "defender",
        label: "Enable Defender",
        description: "Turn on endpoint detection and protection.",
        score: 25,
      },
      {
        id: "mfa",
        label: "Require MFA",
        description: "Protect the employee identity from password theft.",
        score: 15,
      },
    ],
    xpReward: 60,
    framework: "CIS Controls 7 and 10 · NIST SI-2 and IA-2",
    debrief:
      "Patching removed known weaknesses, endpoint protection detected malicious behavior, and MFA reduced the value of a stolen password.",
  },
  {
    id: "public-database",
    title: "Public Database",
    briefing: "The Payroll Bank accepts traffic from outside the city network.",
    objective:
      "Remove public access and monitor every attempt to reach payroll data.",
    requiredLevel: 3,
    requiredRole: "Network Support Trainee",
    prerequisiteMissionId: "unpatched-workstation",
    targetAsset: "Payroll Bank",
    attackPath: ["Internet Gate", "Public Endpoint", "Payroll Bank"],
    controls: [
      {
        id: "private-endpoint",
        label: "Create private endpoint",
        description: "Move database access onto a private city road.",
        score: 30,
      },
      {
        id: "firewall",
        label: "Close public firewall",
        description: "Deny database traffic from the internet.",
        score: 25,
      },
      {
        id: "audit",
        label: "Enable database auditing",
        description: "Record queries and failed connections.",
        score: 15,
      },
    ],
    xpReward: 75,
    framework: "CIS Controls 3 and 13 · NIST SC-7 and AU-2",
    debrief:
      "Private connectivity removed the public route, the firewall enforced the boundary, and auditing preserved evidence of access attempts.",
  },
  {
    id: "stolen-secret",
    title: "Stolen Secret",
    briefing:
      "A deployment secret was copied from the Key Vault into application code.",
    objective:
      "Rotate the secret, remove the exposed copy, and enforce least privilege.",
    requiredLevel: 4,
    requiredRole: "Security Trainee",
    prerequisiteMissionId: "public-database",
    targetAsset: "Key Vault",
    attackPath: ["Payroll App Server", "Exposed Secret", "Key Vault"],
    controls: [
      {
        id: "rotate",
        label: "Rotate secret",
        description: "Invalidate the exposed credential immediately.",
        score: 25,
      },
      {
        id: "managed-identity",
        label: "Use managed identity",
        description: "Remove the secret from application code.",
        score: 30,
      },
      {
        id: "rbac",
        label: "Enforce vault RBAC",
        description: "Grant only the permissions the application needs.",
        score: 20,
      },
    ],
    xpReward: 90,
    framework: "CIS Control 6 · NIST AC-6 and IA-5",
    debrief:
      "Rotation invalidated the stolen value, managed identity removed the stored credential, and RBAC limited what the application could reach.",
  },
];

export function getTrainingCityMission(missionKey: string) {
  return trainingCityMissions.find((mission) => mission.id === missionKey);
}

export function calculateTrainingCityResult(
  mission: TrainingCityMission,
  controlsApplied: readonly string[],
) {
  const requiredControlIds = new Set(
    mission.controls.map((control) => control.id),
  );
  const selectedControlIds = [...new Set(controlsApplied)];
  const validControls = selectedControlIds.filter((controlId) =>
    requiredControlIds.has(controlId),
  );
  const secureScore = Math.min(
    100,
    25 +
      mission.controls
        .filter((control) => validControls.includes(control.id))
        .reduce((total, control) => total + control.score, 0),
  );
  const score = Math.round(
    (validControls.length / mission.controls.length) * 100,
  );

  return {
    blocked: validControls.length === mission.controls.length,
    validControls,
    secureScore,
    score,
  };
}
