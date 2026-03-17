"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";
import { LogOut, BookOpen, ChevronRight } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter,SidebarHeader, SidebarMenu,SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarSeparator} from "@/components/ui/sidebar";
import { dashboardSideNavItems } from "@/lib/constants";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { CompanyListItem } from "@repo/shared";
import { useState } from "react";

interface DashboardSideNavProps {
  companies: CompanyListItem[];
}

export default function DashboardSideNav({ companies }: DashboardSideNavProps) {

  const pathname = usePathname();

  const [isDashboardOpen, setIsDashboardOpen] = useState(true);

  return (
    <Sidebar className="flex h-full w-70 flex-col bg-sidebar text-sidebar-foreground">

      <SidebarHeader className="px-6 py-5">
        <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <BookOpen className="h-4 w-4 text-sidebar-primary-foreground"/>
            </div>
          <span className="text-lg font-semibold tracking-tight">Calhame CFO</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-1 flex-col gap-1 px-3 pt-2">
        <SidebarMenu>
          {dashboardSideNavItems.filter((item) => !item.disabled).map((item) => {
            const Icon = item.icon;
            const isDashboard = item.href === "/dashboard";
            
            const isChildActive = companies.some((company) => 
              pathname === `/dashboard/${company.companyId}`
            );
            const isActive = pathname === item.href || (isDashboard && isChildActive);

            return (
              <SidebarMenuItem key={item.href}>
                {isDashboard && companies.length > 0 ? (
                  <>
                    <div className="relative flex items-center">
                      <SidebarMenuButton
                        asChild
                        className="flex-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors pr-8 focus-visible:ring-0 focus-visible:ring-offset-0"
                      >
                        <Link href={item.href}>
                          <Icon className="h-4 w-4"/>
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDashboardOpen(!isDashboardOpen);
                        }}
                        className="absolute right-2 flex h-6 w-6 items-center justify-center rounded-sm transition-colors focus:outline-none"
                        aria-label={isDashboardOpen ? "Collapse companies" : "Expand companies"}
                      >
                        <ChevronRight 
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isDashboardOpen ? "rotate-90" : ""
                          }`}
                        />
                      </button>
                    </div>
                    {isDashboardOpen && (
                      <SidebarMenuSub>
                        {companies.map((company) => {
                          const companyHref = `/dashboard/${company.companyId}`;
                          
                          return (
                            <SidebarMenuSubItem key={company.companyMembershipId}>
                              <SidebarMenuSubButton
                                asChild
                              >
                                <Link href={companyHref}>
                                  {company.companyName}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    )}
                  </>
                ) : (
                  <SidebarMenuButton
                    asChild
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-0 focus-visible:ring-offset-0"
                  >
                    <Link
                      href={item.href}
                      className={
                        isActive
                          ? "text-sidebar-accent-foreground flex items-center gap-3"
                          : "text-sidebar-foreground/60 flex items-center gap-3"
                      }
                    >
                      <Icon className="h-4 w-4"/>
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator className="mx-0"/>

      <SidebarFooter className="border-t border-sidebar-border px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/60 transition-colors focus-visible:ring-0 focus-visible:ring-offset-0">
              <SignOutButton redirectUrl="/sign-in">
                <Button variant="link">
                  <LogOut className="h-4 w-4"/>
                  Sign out
                </Button>
              </SignOutButton>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      
    </Sidebar>
  );
}
