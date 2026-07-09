import { signOut } from "@/auth";

export function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";

        await signOut({
          redirectTo: "/login",
        });
      }}
    >
      <button
        type="submit"
        className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
      >
        Log out
      </button>
    </form>
  );
}