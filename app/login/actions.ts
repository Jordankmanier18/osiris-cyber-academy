"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const requestedCallbackUrl = String(
    formData.get("callbackUrl") || "/dashboard",
  );
  const callbackUrl =
    requestedCallbackUrl.startsWith("/") &&
    !requestedCallbackUrl.startsWith("//")
      ? requestedCallbackUrl
      : "/dashboard";
  const loginErrorUrl = (errorCode: string) =>
    `/login?error=${errorCode}&callbackUrl=${encodeURIComponent(callbackUrl)}`;

  if (!email || !password) {
    redirect(loginErrorUrl("missing-fields"));
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(loginErrorUrl("invalid-credentials"));
    }

    throw error;
  }
}
