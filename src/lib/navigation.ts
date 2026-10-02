import type { Enums } from "@/lib/supabase/database.types";

export type AppNavIcon =
  "cases" | "tasks" | "clients" | "enquiries" | "account";

export type AppNavItem = {
  label: string;
  href: string;
  icon: AppNavIcon;
  badge?: number;
  exact?: boolean;
};

export function appNav(
  role: Enums<"app_role">,
  counts: { openTasks?: number; newEnquiries?: number } = {},
): AppNavItem[] {
  if (role === "client")
    return [
      { label: "Case Dashboard", href: "/portal", icon: "cases" },
      { label: "Account", href: "/account", icon: "account" },
    ];

  return [
    { label: "Dashboard", href: "/admin", icon: "cases", exact: true },
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
      badge: counts.newEnquiries,
    },
    { label: "Account", href: "/account", icon: "account" },
  ];
}
