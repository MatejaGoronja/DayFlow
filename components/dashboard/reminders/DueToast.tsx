"use client";

import { useState } from "react";
import { BellRing, X } from "lucide-react";
import { useDashboard } from "../store/DashboardProvider";

export default function DueToast() {
  const { fresh, panelOpen, openPanel } = useDashboard();
  const [hiddenKey, setHiddenKey] = useState("");

  const key = fresh.map((r) => r.key).join(",");

  if (fresh.length === 0 || panelOpen || key === hiddenKey) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-2xl bg-primary p-4 text-white shadow-xl"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
          <BellRing size={20} className="animate-pulse" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-bold">
            {fresh.length === 1 ? "New reminder" : `${fresh.length} new reminders`}
          </p>
          <p className="truncate text-sm text-white/80">
            {fresh.map((r) => r.title).join(", ")}
          </p>
          <button
            type="button"
            onClick={openPanel}
            className="mt-3 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary-soft"
          >
            View
          </button>
        </div>

        <button
          type="button"
          onClick={() => setHiddenKey(key)}
          aria-label="Dismiss"
          className="rounded-md p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}