import Link from "next/link";
import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl = "/dashboard" } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Log in to Osiris</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Continue your cyber training, missions, and labs.
        </p>

        <form action={loginAction} className="mt-6 space-y-4">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground"
          >
            Log in
          </button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          New to Osiris?{" "}
          <Link href="/signup" className="font-medium underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
