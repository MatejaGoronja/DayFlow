import { ArrowUp, ArrowUpRight } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features"},
      { label: "Pricing", href: "#pricing"},
      { label: "FAQ", href: "#faq"},
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", href: "/login"},
      { label: "Sign up", href: "/signup"},
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Email us", href: "mailto:hello@dayflow.com"},
      { label: "GitHub", href: "https://github.com/MatejaGoronja"},
    ],
  },
];

export default function Footer(){
  return(
    <footer className="relative overflow-hidden bg-[#16162a] text-white">
      {/* Glows */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl"/>
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl"/>

      <div className="relative mx-auto max-w-7xl px-6 py-14 md:py-16">
        <div className="flex flex-col items-center gap-10 text-center md:flex-row md:items-start md:justify-between md:gap-12 md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <a href="#" className="inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight">
              <span className="h-3.5 w-3.5 rounded-full bg-primary"/>
              <span>
                Day<span className="text-[#5B5BD6]">Flow</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              To-do lists, calendar, notes and reminders, all in one place.
              Plan your day and keep your flow.
            </p>
          </div>

          <div className="grid w-full grid-cols-3 gap-x-4 sm:gap-x-12 md:w-auto md:gap-x-18 lg:gap-x-28">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">
                {column.title}</h3>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="group inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white">
                        <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-[#8c8cf0] after:transition-all after:duration-300 group-hover:after:w-full">
                          {link.label}
                        </span>
                        <ArrowUpRight size={14} className="hidden -translate-x-1 text-[#8c8cf0] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:block"/>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-5 border-t border-white/10 pt-6 text-sm text-white/50 md:mt-14 md:flex-row md:justify-between">
            <p>&copy; 2026 DayFlow. All rights reserved.</p>
            <a href="#" aria-label="Back to top" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-all hover:-translate-y-1 hover:border-primary hover:bg-primary">
              <ArrowUp size={18}/>
            </a>
        </div>
      </div>
    </footer>
  )
}