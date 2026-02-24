import { LayoutDashboard, Link2, Settings } from "lucide-react";

export const dashboardSideNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Connect", href: "/dashboard/connect", icon: Link2 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings }
];

export const intuitAuthScope = "com.intuit.quickbooks.accounting";
