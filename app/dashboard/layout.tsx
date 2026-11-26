import type { Metadata } from "next";
import Sidebar from "@/components/dashboard/Sidebar";
import DueToast from "@/components/dashboard/reminders/DueToast";
import RemindersBell from "@/components/dashboard/reminders/RemindersBell";
import { DashboardProvider } from "@/components/dashboard/store/DashboardProvider";

export const metadata: Metadata = {
  title: "Dashboard - DayFlow",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-surface lg:flex">
        <Sidebar/>
        <main className="relative min-w-0 flex-1 p-6 lg:py-10 lg:pl-4 lg:pr-10">
          <div className="absolute right-6 top-6 z-30 lg:right-10 lg:top-10">
            <RemindersBell/>
          </div>
          {children}
        </main>
      </div>
      <DueToast/>
    </DashboardProvider>
  );
}