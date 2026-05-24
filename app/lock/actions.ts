"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash } from "node:crypto";

function safeNext(next: string | null | undefined): string {
  if (!next || typeof next !== "string") return "/";
  if (!next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

export async function unlockAction(formData: FormData) {
  const password = process.env.APP_PASSWORD;
  const submitted = String(formData.get("password") ?? "");
  const next = safeNext(String(formData.get("next") ?? "/"));

  if (!password) {
    redirect(next);
  }

  if (submitted !== password) {
    redirect(`/lock?error=1&next=${encodeURIComponent(next)}`);
  }

  const hashed = createHash("sha256").update(password).digest("hex");
  const jar = await cookies();
  jar.set("cp-auth", hashed, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect(next);
}
