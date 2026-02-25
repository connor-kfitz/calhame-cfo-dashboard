import { LayoutDashboard, Link2, Settings } from "lucide-react";

export const dashboardSideNavItems: DashboardSideNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, disabled: false },
  { label: "Connect", href: "/dashboard/connect", icon: Link2, disabled: false },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, disabled: true }
];

export const intuitAuthScope = "com.intuit.quickbooks.accounting";
