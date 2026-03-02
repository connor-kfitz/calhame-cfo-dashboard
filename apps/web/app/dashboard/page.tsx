import DashboardHeader from "@/components/shared/DashboardHeader";
import Connect from "@/components/dashboard/Connect";
import DashboardContainer from "@/components/dashboard/DashboardContainer";
import getDashboardData from "@/lib/queries/dashboard/index";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {

  const { userId: clerkId } = await auth();

  if (!clerkId) redirect("/sign-in");
  
  const dashboardData = await getDashboardData(clerkId, 2026);

  return (
    <main className="w-full overflow-y-auto p-4 lg:p-8">
      <DashboardHeader title="Executive P&L" description="Period: 2025"/>
      {dashboardData.companies.length === 0
        ? <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
            <Connect/>
          </div>
        : <DashboardContainer data={dashboardData}/>
      }
    </main>
  );
}
