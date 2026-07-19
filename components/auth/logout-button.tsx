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
        className="rounded-xl border border-yellow-500/20 bg-black px-4 py-2.5 text-sm font-black text-zinc-300 transition hover:border-yellow-400/50 hover:text-yellow-400"
      >
        Log out
      </button>
    </form>
  );
}
