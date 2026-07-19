import {
  Headphones,
  Landmark,
  RadioTower,
  ShieldCheck,
  Siren,
  type LucideIcon,
} from "lucide-react";
import { roleDisplayNames } from "@/lib/role-ladder";

export type TrainingCityDistrict = {
  slug: string;
  name: string;
  callSign: string;
  description: string;
  roleSlug: string;
  requiredRole: string;
  requiredLevel: number;
  learnHref: string;
  action: string;
  icon: LucideIcon;
  position: string;
};

export const trainingCityDistricts: readonly TrainingCityDistrict[] = [
  {
    slug: "orientation-center",
    name: "Orientation Center",
    callSign: "District 01",
    description:
      "Begin your academy briefing, learn the training system, and establish your cyber foundations.",
    roleSlug: "cyber-cadet",
    requiredRole: roleDisplayNames["cyber-cadet"],
    requiredLevel: 1,
    learnHref: "/learn?district=cyber-cadet",
    action: "Open orientation modules",
    icon: Landmark,
    position: "lg:col-span-2 lg:col-start-3 lg:row-start-1",
  },
  {
    slug: "help-desk-office",
    name: "Help Desk Office",
    callSign: "District 02",
    description:
      "Respond to user issues, document incidents, and practice structured technical support workflows.",
    roleSlug: "it-support-trainee",
    requiredRole: roleDisplayNames["it-support-trainee"],
    requiredLevel: 2,
    learnHref: "/learn?district=it-support-trainee",
    action: "Open help desk modules",
    icon: Headphones,
    position: "lg:col-span-2 lg:col-start-1 lg:row-start-2",
  },
  {
    slug: "dns-tower",
    name: "DNS Tower",
    callSign: "District 03",
    description:
      "Trace connectivity, inspect name resolution, and build practical network troubleshooting skills.",
    roleSlug: "network-support-trainee",
    requiredRole: roleDisplayNames["network-support-trainee"],
    requiredLevel: 3,
    learnHref: "/learn?district=network-support-trainee",
    action: "Open network modules",
    icon: RadioTower,
    position: "lg:col-span-2 lg:col-start-5 lg:row-start-2",
  },
  {
    slug: "security-awareness-office",
    name: "Security Awareness Office",
    callSign: "District 04",
    description:
      "Investigate threats, strengthen human defenses, and practice foundational security decisions.",
    roleSlug: "security-trainee",
    requiredRole: roleDisplayNames["security-trainee"],
    requiredLevel: 4,
    learnHref: "/learn?district=security-trainee",
    action: "Open security modules",
    icon: ShieldCheck,
    position: "lg:col-span-2 lg:col-start-2 lg:row-start-3",
  },
  {
    slug: "soc-police-station",
    name: "SOC Police Station",
    callSign: "District 05",
    description:
      "Triage alerts, examine evidence, and coordinate the city’s defensive response operations.",
    roleSlug: "junior-security-analyst",
    requiredRole: roleDisplayNames["junior-security-analyst"],
    requiredLevel: 5,
    learnHref: "/learn?district=junior-security-analyst",
    action: "Open SOC modules",
    icon: Siren,
    position: "lg:col-span-2 lg:col-start-4 lg:row-start-3",
  },
];

export function getDistrictByRoleSlug(roleSlug: string) {
  return trainingCityDistricts.find(
    (district) => district.roleSlug === roleSlug,
  );
}
