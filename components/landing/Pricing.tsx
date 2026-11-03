"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import Image from "next/image";

const plans = [
  {
    name: "Free",
    description: "Everything you need to get organized.",
    monthly: 0,
    yearly: 0,
    cta: "Get started free",
    href: "/signup",
    highlighted: false,
    features: [
      "Calendar",
      "Unlimited notes",
      "Shopping lists",
      "Up to 50 active tasks",
      "Basic reminders",
    ],
  },
  {
    name: "Pro",
    description: "For people who want to get the most out of their day.",
    monthly: 4,
    yearly: 3,
    cta: "Upgrade to Pro",
    href: "/signup",
    highlighted: true,
    features: [
      "Everything in Free",
      "Unlimited tasks",
      "Dark theme",
      "Recurring reminders",
      "Tags and search",
      "Priority support",
    ],
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image src="/pricing-bg.svg" alt="" fill priority aria-hidden='true' className="scale-110 object-cover blur-[1px]"></Image>
      </div>

      <div id="pricing" className="scroll-mt-20 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          {/* Heading */}
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-sm font-semibold text-primary">
              Pricing
            </span>
            <h2 className="mt-6 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
              Simple pricing, no suprises
            </h2>
            <p className="mt-4 text-lg text-muted">
              Start for free and upgrade when you need more.
            </p>
          </div>

          {/* Billing toggle */}
          <div className="mt-10 flex justify-center">
            <div className="flex rounded-full border border-border bg-surface p-1">
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  billing === "monthly"
                    ? "bg-primary text-white"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBilling("yearly")}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  billing === "yearly"
                    ? "bg-primary text-white"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Yearly
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    billing === "yearly"
                      ? "bg-white/20 text-white"
                      : "bg-primary-soft text-primary"
                  }`}
                >
                  Save 25%
                </span>
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="mx-auto mt-14 grid max-w-4xl gap-8 md:grid-cols-2">
            {plans.map((plan) => {
              const price = billing === "monthly" ? plan.monthly : plan.yearly;

              return (
                <div
                  key={plan.name}
                  className={`relative flex flex-col rounded-2xl border bg-white p-8 ${
                    plan.highlighted
                      ? "border-primary shadow-xl ring-1 ring-primary"
                      : "border-border"
                  }`}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                      Most popular
                    </span>
                  )}

                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="mt-2 text-sm text-muted">{plan.description}</p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold tracking-tight">
                      ${price}
                    </span>
                    <span className="text-muted">/ month</span>
                  </div>

                  <p className="mt-1 min-h-5 text-sm text-muted">
                    {plan.monthly === 0
                      ? "Free forever"
                      : billing === "yearly"
                        ? `Billed $${plan.yearly * 12} per year`
                        : "Billed monthly"}
                  </p>

                  <ul className="mt-8 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-sm"
                      >
                        <Check size={18} className="shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.href}
                    className={`mt-8 rounded-lg px-6 py-3 text-center text-base font-semibold transition-colors ${
                      plan.highlighted
                        ? "bg-primary text-white hover:bg-primary-hover"
                        : "border border-border hover:bg-primary-hover/10 hover:text-primary"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
