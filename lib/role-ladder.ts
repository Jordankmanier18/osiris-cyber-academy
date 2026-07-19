export const roleDisplayNames = {
  "cyber-cadet": "Cybersecurity Apprentice",
  "it-support-trainee": "IT Support Technician",
  "network-support-trainee": "Network Operations Technician",
  "security-trainee": "Cyber Defense Analyst",
  "junior-security-analyst": "SOC Analyst I",
} as const;

export type RoleSlug = keyof typeof roleDisplayNames;
