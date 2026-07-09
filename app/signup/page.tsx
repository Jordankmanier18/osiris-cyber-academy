import Link from "next/link";
import { signupAction } from "./actions";

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Create your Osiris account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign up to start missions, labs, and learning tracks.
        </p>

        <form action={signupAction} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              name="name"
              type="text"
              required
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
              placeholder="Jordan Manier"
            />
          </div>

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
              minLength={6}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
              placeholder="Create a password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground"
          >
            Sign up
          </button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}