import type { Enums } from "@/lib/supabase/database.types";

export type AppNavIcon =
  | "dashboard"
  | "cases"
  | "tasks"
  | "clients"
  | "enquiries"
  | "account";

export type AppNavItem = {
  label: string;
  href: string;
  icon: AppNavIcon;
  badge?: number;
  /** Highlight only on this exact path, plus any path under `alsoUnder`. */
  exact?: boolean;
  alsoUnder?: string;
};

export function appNav(
  role: Enums<"app_role">,
  counts: { openTasks?: number; openEnquiries?: number } = {},
): AppNavItem[] {
  if (role === "client")
    return [
      { label: "Case Dashboard", href: "/portal", icon: "cases" },
      { label: "Account", href: "/account", icon: "account" },
    ];

  return [
    { label: "Dashboard", href: "/admin", icon: "dashboard", exact: true },
    { label: "Cases", href: "/admin/cases", icon: "cases" },
    {
      label: "Tasks",
      href: "/admin/tasks",
      icon: "tasks",
      badge: counts.openTasks,
    },
    { label: "Clients", href: "/admin/clients", icon: "clients" },
    {
      label: "Enquiries",
      href: "/admin/enquiries",
      icon: "enquiries",
      badge: counts.openEnquiries,
    },
    { label: "Account", href: "/account", icon: "account" },
  ];
}
