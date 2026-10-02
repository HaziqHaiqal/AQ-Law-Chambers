import type { ReactNode } from "react";
import { AppShell } from "@/components/Layout/AppShell";
import { requireRole } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole("admin");
  return <AppShell>{children}</AppShell>;
}
