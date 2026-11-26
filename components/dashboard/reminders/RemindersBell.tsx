"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AlarmClock, Bell, CalendarDays, Check, ListChecks } from "lucide-react";
import { useDashboard } from "../store/DashboardProvider";

export default function RemindersBell() {
  const {
    ready,
    reminders,
    fresh,
    snooze,
    dismiss,
    panelOpen,
    openPanel,
    closePanel,
  } = useDashboard();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panelOpen) return;

    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) closePanel();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closePanel();
    }

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [panelOpen, closePanel]);

  if (!ready) return null;

  const count = reminders.length;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => (panelOpen ? closePanel() : openPanel())}
        aria-label={count > 0 ? `Reminders, ${count} active` : "Reminders"}
        aria-expanded={panelOpen}
        className={`relative flex h-10 w-10 items-center justify-center rounded-xl border bg-white transition-colors hover:bg-primary-hover/10 hover:text-primary ${
          panelOpen ? "border-primary text-primary" : "border-border text-muted"
        }`}
      >
        <Bell size={20} className={fresh.length > 0 ? "animate-pulse" : ""} />
        {count > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
            {count}
          </span>
        )}
      </button>

      {panelOpen && (
        <div
          role="dialog"
          aria-label="Reminders"
          className="absolute right-0 top-12 w-[min(24rem,calc(100vw-3rem))] overflow-hidden rounded-2xl border border-border bg-white shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-bold">Reminders</h2>
            <span className="text-xs text-muted">{count} active</span>
          </div>

          {count === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted">
              You&apos;re all caught up.
            </p>
          ) : (
            <ul className="max-h-96 divide-y divide-border overflow-y-auto">
              {reminders.map((r) => (
                <li key={r.key} className="p-4">
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        r.source === "event"
                          ? "bg-primary-soft text-primary"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      {r.source === "event" ? (
                        <CalendarDays size={18} />
                      ) : (
                        <ListChecks size={18} />
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={r.href}
                        onClick={closePanel}
                        className="block truncate text-sm font-semibold hover:text-primary"
                      >
                        {r.title}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted">
                        {r.source === "event" ? "Calendar" : "To-do"} · {r.detail}
                      </p>

                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => snooze(r.key, 10)}
                          className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-primary hover:bg-primary-soft hover:text-primary"
                        >
                          <AlarmClock size={14} />
                          Snooze 10 min
                        </button>
                        <button
                          type="button"
                          onClick={() => dismiss(r.key)}
                          className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-primary hover:bg-primary hover:text-white"
                        >
                          <Check size={14} />
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}