import type { ReactNode } from "react";
import { AppShell } from "@/components/Layout/AppShell";
import { requireRole } from "@/lib/auth";

export default async function PortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole("client");
  return <AppShell>{children}</AppShell>;
}
