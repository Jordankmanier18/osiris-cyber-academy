import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppShell } from "@/components/layout/app-shell";
import { prisma } from "@/lib/prisma";

export default async function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      points: true,
      role: {
        select: {
          name: true,
          level: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <AppShell
      user={{
        name: user.name ?? user.email,
        roleName: user.role?.name ?? "Academy Recruit",
        roleLevel: user.role?.level ?? 1,
        points: user.points,
      }}
    >
      {children}
    </AppShell>
  );
}
