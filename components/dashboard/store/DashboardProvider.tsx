"use client";

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
} from "react";
import {
  addDays,
  computeReminders,
  dateOf,
  hhmm,
  noRepeat,
  type CalEvent,
  type EventInput,
  type ReminderItem,
  type Status,
  type Task,
  type TaskInput,
} from "./dashboard";

let cachedNow = 0;

function subscribe(callback: () => void) {
  cachedNow = Date.now();
  const id = setInterval(() => {
    cachedNow = Date.now();
    callback();
  }, 10_000);
  return () => clearInterval(id);
}
function getNow() {
  if (!cachedNow) cachedNow = Date.now();
  return cachedNow;
}
function getServerNow() {
  return 0;
}

type Data = { events: CalEvent[]; tasks: Task[] };

function seed(now: number): Data {
  const current = new Date(now);
  const today = dateOf(current);
  const soon = new Date(now + 3 * 60_000);
  const soonEnd = new Date(now + 33 * 60_000);

  return {
    events: [
      { id: "e0", title: "Reminder test (in 3 min)", date: dateOf(soon), start: hhmm(soon), end: hhmm(soonEnd), category: "personal", repeat: noRepeat, remind: "at" },
      { id: "e1", title: "Team meeting", date: "2026-11-12", start: "14:00", end: "15:00", category: "work", repeat: { ...noRepeat, freq: "weekly" }, remind: "10m" },
      { id: "e2", title: "Internet technologies lecture", date: "2026-11-13", start: "10:00", end: "12:00", category: "study", repeat: noRepeat, remind: "none" },
      { id: "e3", title: "Dentist", date: "2026-11-16", start: "17:30", end: "18:00", category: "personal", repeat: noRepeat, remind: "none" },
      { id: "e4", title: "Project deadline", date: "2026-11-20", start: "09:00", end: "10:00", category: "work", repeat: noRepeat, remind: "none" },
      { id: "e5", title: "Study session", date: "2026-11-20", start: "18:00", end: "20:00", category: "study", repeat: noRepeat, remind: "none" },
      { id: "e6", title: "Mom's birthday", date: "2026-11-25", start: "09:00", end: "10:00", category: "personal", repeat: { ...noRepeat, freq: "yearly" }, remind: "1d" },
    ],
    tasks: [
      { id: "t1", title: "Send the assignment", priority: "high", due: today, status: "todo", remind: "at" },
      { id: "t2", title: "Finish project report", priority: "high", due: addDays(today, 5), status: "todo", remind: "1d" },
      { id: "t3", title: "Design the calendar page", priority: "medium", due: addDays(today, -2), status: "progress", remind: "none" },
      { id: "t4", title: "Buy groceries", priority: "low", due: "", status: "todo", remind: "none" },
      { id: "t5", title: "Plan the week", priority: "medium", due: "", status: "done", remind: "none" },
    ],
  };
}

type DashboardContextValue = {
  ready: boolean; 
  today: string;
  events: CalEvent[];
  tasks: Task[];

  addEvent: (date: string, input: EventInput) => void;
  updateEvent: (id: string, input: EventInput) => void;
  deleteEvent: (id: string) => void;

  addTask: (status: Status, input: TaskInput) => void;
  updateTask: (id: string, input: TaskInput) => void;
  moveTask: (id: string, status: Status) => void;
  deleteTask: (id: string) => void;

  reminders: ReminderItem[]; 
  fresh: ReminderItem[]; 
  snooze: (key: string, minutes: number) => void;
  dismiss: (key: string) => void;

  panelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used inside DashboardProvider");
  }
  return context;
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const now = useSyncExternalStore(subscribe, getNow, getServerNow);
  const [data, setData] = useState<Data | null>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [snoozed, setSnoozed] = useState<Record<string, number>>({});
  const [seen, setSeen] = useState<string[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);

  const ready = now !== 0;
  const today = ready ? dateOf(new Date(now)) : "";

  if (ready && data === null) setData(seed(now));

  const events = data?.events ?? [];
  const tasks = data?.tasks ?? [];

  const reminders = ready
    ? computeReminders({ events, tasks, now, today, dismissed, snoozed })
    : [];
  const fresh = reminders.filter((r) => !seen.includes(r.key));

  function addEvent(date: string, input: EventInput) {
    setData((c) =>
      c && { ...c, events: [...c.events, { id: crypto.randomUUID(), date, ...input }] }
    );
  }
  function updateEvent(id: string, input: EventInput) {
    setData((c) =>
      c && { ...c, events: c.events.map((e) => (e.id === id ? { ...e, ...input } : e)) }
    );
  }
  function deleteEvent(id: string) {
    setData((c) => c && { ...c, events: c.events.filter((e) => e.id !== id) });
  }

  function addTask(status: Status, input: TaskInput) {
    setData((c) =>
      c && { ...c, tasks: [...c.tasks, { id: crypto.randomUUID(), status, ...input }] }
    );
  }
  function updateTask(id: string, input: TaskInput) {
    setData((c) =>
      c && { ...c, tasks: c.tasks.map((t) => (t.id === id ? { ...t, ...input } : t)) }
    );
  }
  function moveTask(id: string, status: Status) {
    setData((c) =>
      c && { ...c, tasks: c.tasks.map((t) => (t.id === id ? { ...t, status } : t)) }
    );
  }
  function deleteTask(id: string) {
    setData((c) => c && { ...c, tasks: c.tasks.filter((t) => t.id !== id) });
  }

  function snooze(key: string, minutes: number) {
    setSnoozed((c) => ({ ...c, [key]: now + minutes * 60_000 }));
  }
  function dismiss(key: string) {
    setDismissed((c) => [...c, key]);
  }
  function openPanel() {
    setPanelOpen(true);
    setSeen((c) => [...c, ...reminders.map((r) => r.key)]);
  }
  function closePanel() {
    setPanelOpen(false);
  }

  return (
    <DashboardContext.Provider
      value={{
        ready,
        today,
        events,
        tasks,
        addEvent,
        updateEvent,
        deleteEvent,
        addTask,
        updateTask,
        moveTask,
        deleteTask,
        reminders,
        fresh,
        snooze,
        dismiss,
        panelOpen,
        openPanel,
        closePanel,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}