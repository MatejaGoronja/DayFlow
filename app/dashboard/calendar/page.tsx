import type { Metadata } from "next";
import CalendarView from "@/components/dashboard/calendar/CalendarView";

export const metadata: Metadata = {
    title: "Calendar - DayFlow",
};

export default function CalendarPage() {
    return (
        <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Calendar</h1>
            <p className="mt-2 text-muted">Plan your events and see your month at a glance.</p>

            <CalendarView/>
        </div>
    );
}