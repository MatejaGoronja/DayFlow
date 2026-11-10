"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CalendarDays, ListChecks, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Settings, ShoppingCart, StickyNote, Sun, X, type LucideIcon } from "lucide-react";

const groups = [
  {
    title: "Overview",
    items: [{ href: "/dashboard", label: "Today", icon: Sun }],
  },
  {
    title: "Plan",
    items: [
      { href: "/dashboard/calendar", label: "Calendar", icon: CalendarDays},
      { href: "/dashboard/todo", label: "To-do", icon: ListChecks},
      { href: "/dashboard/reminders", label: "Reminders", icon: Bell},
    ],
  },
  {
    title: "Organize",
    items: [
      { href: "/dashboard/notes", label: "Notes", icon: StickyNote},
      { href: "/dashboard/shopping", label: "Shopping", icon: ShoppingCart},
    ],
  },
];

const user = { name: "Mateja Goronja", email: "mateja@gmail.com"};

const initials = user.name.split(" ").map((part) => part[0]).join("").slice(0,2).toUpperCase();

const fade = "overflow-hidden whitespace-nowrap transition-all duration-300";

function Logo({ collapsed = false}: { collapsed?: boolean}){
  return(
    <Link href="/" className={`flex items-center text-xl font-extrabold tracking-tight ${
      collapsed ? "lg:w-3 lg:justify-start" : ""
    }`}>
      <span className="h-3 w-3 shrink-0 rounded-full bg-primary"/>
      <span className={`ml-2 whitespace-nowrap transition-opacity duration-300 ${
        collapsed ? "lg:opacity-0" : ""
      }`}>
        Day<span className="text-primary">Flow</span>
      </span>
    </Link>
  );
}

type NavItemProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
};

function NavItem({
  href,
  label,
  icon: Icon,
  active,
  collapsed,
  onClick,
}: NavItemProps){
  return(
    <Link
      href={href}
      onClick={onClick}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={`group relative flex items-center rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors ${
        active ? "bg-primary-soft text-primary" : "text-muted hover:bg-primary-hover/10 hover:text-primary"
      }`}
    >
      <span aria-hidden="true" className={`absolute -left-2 top-1/2 h-6 w-1 origin-center -translate-y-1/2 rounded-r-full bg-primary transition-transform duration-200 ${
        active ? "scale-y-100" : "scale-y-0"
      }`}/>

      <Icon size={20} className="shrink-0" />
      <span className={`${fade} ml-3 max-w-40 ${
        collapsed ? "lg:ml-0 lg:max-w-0 lg:opacity-0" : ""
      }`}>{label}</span>

      <span aria-hidden="true" className={`pointer-events-none absolute left-full z-50 ml-4 hidden whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 ${
        collapsed ? "lg:block" : ""
      }`}>{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const close = () => setOpen(false);

  return (
    <>
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white px-6 lg:hidden">
        <Logo/>
        <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-lg p-2">
          <Menu size={24}/>
        </button>
      </div>

      {open && (
        <div onClick={close} className="fixed inset-0 z-30 bg-foreground/40 lg:hidden"/>
      )}

      <aside className={`fixed inset-y-0 left-0 z-40 w-72 p-3 transition-[transform,width] duration-300 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0 lg:p-4 ${
        collapsed ? "lg:w-24" : "lg:w-72"
      } ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-full flex-col rounded-2xl border border-border bg-white shadow-lg">
          <div className={`flex items-center justify-between overflow-hidden px-5 pt-6 ${
            collapsed ? "lg:flex-col lg:gap-4 lg:px-0" : ""
          }`}>
            <Logo collapsed={collapsed}/>

            <button type="button" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-expanded={!collapsed} className="hidden rounded-lg p-1.5 text-muted transition-colors hover:bg-primary-hover/10 hover:text-primary lg:block">
              {collapsed ? (
                <PanelLeftOpen size={20}/>
              ): (
                <PanelLeftClose size={20}/>
              )}
            </button>

            <button type="button" onClick={close} aria-label="Close menu" className="rounded-lg p-1 lg:hidden">
              <X size={22}/>
            </button>
          </div>

          <nav aria-label="Dashboard" className="mt-6 flex-1 px-2">
            {groups.map((group, index) => (
              <div key={group.title} className={`transition-[margin] duration-300 ${
                index === 0 ? "" : collapsed ? "mt-6 lg:mt-3" : "mt-6"
              }`}>
                <p className={`${fade} px-3.5 text-xs font-semibold uppercase tracking-widest text-muted/70 ${
                  collapsed ? "lg:mb-0 lg:max-h-0 lg:opacity-0" : "mb-2 max-h-6"
                }`}>
                  {group.title}
                </p>

                {index > 0 && (
                  <div aria-hidden="true" className={`mx-3 border-t border-border transition-all duration-300 ${
                    collapsed ? "lg:mb-3 lg:opacity-100" : "opacity-0"
                  }`}/>
                )}

                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <NavItem {...item} active={isActive(item.href)} collapsed={collapsed} onClick={close}/>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="border-t border-border p-3">
            <ul className="-mx-1 space-y-1">
              <li>
                <NavItem href="/dashboard/settings" label="Settings" icon={Settings} active={isActive("/dashboard/settings")} collapsed={collapsed} onClick={close}/>
              </li>
              <li>
                <NavItem href="/" label="Log out" icon={LogOut} active={false} collapsed={collapsed} onClick={close}/>
              </li>
            </ul>

            <div className={`mt-3 flex items-center rounded-xl bg-surface p-2.5 transition-all duration-300 ${
              collapsed ? "lg:bg-transparent lg:p-0" : ""
            }`}>
              <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {initials}
              </span>
              <div className={`${fade} ml-3 min-w-0 max-w-40 ${
                collapsed ? "lg:ml-0 lg:max-w-0 lg:opacity-0" : ""
              }`}>
                <p className="truncate text-sm font-bold leading-tight">{user.name}</p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}