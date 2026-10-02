import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/Layout/AppShell";
import { getCurrentProfile } from "@/lib/auth";

export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!(await getCurrentProfile())) redirect("/login?next=/account");
  return <AppShell>{children}</AppShell>;
}
