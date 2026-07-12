"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function signupAction(formData: FormData): Promise<void> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("An account already exists with this email.");
  }

  const cyberCadetRole = await prisma.role.findUnique({
    where: {
      slug: "cyber-cadet",
    },
  });

  if (!cyberCadetRole) {
    throw new Error(
      "The Cyber Cadet role is not available. Run the database seed first.",
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      points: 0,
      roleId: cyberCadetRole.id,
    },
  });

  redirect("/login");
}