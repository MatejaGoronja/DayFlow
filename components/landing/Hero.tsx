import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image src="/hero-bg.svg" alt="" fill priority aria-hidden="true" className="scale-110 object-cover blur-[1px]"/>
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-2">
        {/* Left side */}
        <div className="text-center lg:text-left">
          <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-sm font-semibold text-primary">
            Your day, organized!
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Plan your day.
            <span className="block text-primary">Keep your flow.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-sm text-muted sm:text-lg lg:mx-0">
            To-do lists, calendar, notes and reminders, all in one place.
            DayFlow helps you focus on what matters today.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <Link
              href="/signup"
              className="rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover"
            >
              Get started free
            </Link>
            <a
              href="#features"
              className="rounded-lg border border-border px-6 py-3 text-base font-semibold hover:bg-surface"
            >
              See features
            </a>
          </div>
        </div>

        {/* Right side */}
        <div className="relative isolate">
          <div className="absolute -inset-2 -z-10 rounded-3xl bg-primary/10 blur-xl" />

          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-lg">
            <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <div className="ml-4 flex-1 rounded-md bg-white px-3 py-1 text-xs text-muted">
                dayflow.com
              </div>
            </div>

            <Image
              src="/DashboardProba.png"
              alt="DayFlow dashboard"
              width={1200}
              height={800}
              priority
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
