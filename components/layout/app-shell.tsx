import { Sidebar } from "./sidebar";

export type AcademyShellUser = {
  name: string;
  roleName: string;
  roleLevel: number;
  points: number;
};

export function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: AcademyShellUser;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar user={user} />

      <main className="xl:pl-72">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-5 md:px-8 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
