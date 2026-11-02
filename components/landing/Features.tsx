"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  ListChecks,
  StickyNote,
  ShoppingCart,
  Bell,
  Sun,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: CalendarDays,
    title: "Calendar",
    description:
      "See your week at a glance and plan events, meetings and deadlines in one view.",
    image: "/Calendar.jpeg",
  },
  {
    icon: ListChecks,
    title: "To-do lists",
    description: "Capture tasks, set priorities and check them off as you go.",
    image: "/DashboardProba.png",
  },
  {
    icon: StickyNote,
    title: "Notes",
    description:
      "Write down ideas, meeting notes and anything you want to remember.",
    image: "/Calendar.jpeg",
  },
  {
    icon: ShoppingCart,
    title: "Shopping lists",
    description:
      "Keep groceries and shopping lists handy, and tick items off in the store.",
    image: "/DashboardProba.png",
  },
  {
    icon: Bell,
    title: "Reminders",
    description:
      "Get nudged at the right time so nothing important slips through.",
    image: "/Calendar.jpeg",
  },
  {
    icon: Sun,
    title: "Today view",
    description:
      "Everything planned for today in one place, so you know what to focus on.",
    image: "/DashboardProba.png",
  },
];

export default function FeatureTabs() {
  const [active, setActive] = useState(0);
  const current = features[active];

  const prev = () =>
    setActive((active - 1 + features.length) % features.length);

  const next = () => setActive((active + 1) % features.length);

  return (
    <section id="features" className="scroll-mt-20 bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* HEADING */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-sm font-semibold text-primary">
            Features
          </span>

          <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Everything you need to stay on top of your day
          </h2>
        </div>

        <div className="mt-14 grid items-start gap-6 xl:grid-cols-[320px_1fr] xl:gap-8">
          {/* SMALL SCREENS: FEATURE TEXT */}
          <div className="mx-auto min-h-32 w-full max-w-xl rounded-2xl border border-border bg-white p-5 text-left shadow-sm xl:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                <current.icon size={20} />
              </div>

              <h3 className="text-lg font-bold">{current.title}</h3>
            </div>
            <p className="mt-3 text-sm text-muted">{current.description}</p>
          </div>

          {/* LARGE SCREENS: TABS */}
          <div className="hidden flex-col gap-2 xl:flex">
            {features.map((feature, index) => {
              const isActive = index === active;

              return (
                <button
                  key={feature.title}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    isActive
                      ? "border-border bg-white shadow-md"
                      : "border-transparent hover:bg-primary-hover/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        isActive
                          ? "bg-primary text-white"
                          : "bg-primary-soft text-primary"
                      }`}
                    >
                      <feature.icon size={20} />
                    </span>
                    <span className="font-bold">{feature.title}</span>
                  </div>

                  {isActive && (
                    <p className="mt-3 text-sm text-muted">
                      {feature.description}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {/* IMAGE */}
          <div className="mx-auto w-full max-w-xl xl:max-w-none">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
              <Image
                key={current.title}
                src={current.image}
                alt={`${current.title} preview`}
                fill
                sizes="(min-width: 1280px) 840px, (min-width: 576px) 576px, 100vw"
                className="object-cover object-top"
              />
            </div>
          </div>

          {/* SMALL SCREENS: ARROWS + DOTS */}
          <div className="flex items-center justify-center gap-6 xl:hidden">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous feature"
              className="rounded-full border border-border bg-white p-3 hover:bg-primary-hover/10"
            >
              <ChevronLeft size={20} />{" "}
            </button>

            <div className="flex gap-2">
              {features.map((feature, index) => (
                <button
                  key={feature.title}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Show ${feature.title}`}
                  className={`h-2 rounded-full transition-all ${
                    index === active ? "w-6 bg-primary" : "w-2 bg-border"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next feature"
              className="rounded-full border border-border bg-white p-3 hover:bg-primary-hover/10"
            >
              <ChevronRight size={20} />{" "}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
