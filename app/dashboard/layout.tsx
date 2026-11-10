import type { Metadata } from "next";
import Sidebar from "@/components/dashboard/Sidebar";

export const metadata: Metadata = {
  title: "Dashboard - DayFlow",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface lg:flex">
      <Sidebar/>
      <main className="min-w-0 flex-1 p-6 lg:py-10 lg:pl-4 lg:pr-10">
        {children}
      </main>
    </div>
  );
}