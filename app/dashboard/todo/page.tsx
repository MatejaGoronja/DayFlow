import type { Metadata } from "next";
import KanbanBoard from "@/components/dashboard/todo/KanbanBoard";

export const metadata: Metadata = {
  title: "To-do - DayFlow",
};

export default function TodoPage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">To-do</h1>
      <p className="mt-2 text-muted">
        Drag tasks between columns to track their progress.
      </p>

      <KanbanBoard/>
    </div>
  );
}