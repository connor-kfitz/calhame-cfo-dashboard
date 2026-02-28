import DashboardHeader from "@/components/shared/DashboardHeader";

export default async function DashboardSettingsPage() {

  return (
    <main className="w-full overflow-y-auto p-4 lg:p-8">
      <DashboardHeader title="Settings" description="Manage your account settings"/>
    </main>
  );
}
