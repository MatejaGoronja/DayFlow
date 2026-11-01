"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const links = [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
]

export default function Navbar(){
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, {passive:true});
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const showBackground = scrolled || open;


    return(
        <header className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        showBackground
            ? "border-border bg-white/80 backdrop-blur-md" 
            : "border-transparent bg-transparent"
        }`}
        >
            <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
                {/* Logo */}
                <a href="#" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
                    <span className="h-3 w-3 rounded-full bg-primary"></span>
                    <span>Day<span className="text-primary">Flow</span></span>
                </a>
                {/* Desktop: links + auth buttons*/}
                <div className="hidden gap-6 md:flex">
                    <ul className="flex items-center gap-4">
                        {links.map((link) => (
                            <li key={link.href}>
                                <a href={link.href} className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-primary hover:bg-primary-hover/10">{link.label}</a>
                            </li>
                        ))}
                    </ul>
                
                    <div className="flex items-center gap-3">
                        <Link href="/login" className="rounded-lg px-6 py-2 text-sm font-medium hover:text-primary hover:bg-primary-hover/10">Log in</Link>
                        <Link href="/signup" className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-primary-hover">
                        Sign up</Link>
                    </div>
                </div>

                {/* Mobile: burger button */}
                <button type="button" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} className="rounded-lg p-2 md:hidden">{open ? <X size={24}/> : <Menu size={24}/>}</button>
            </nav>
                {/* Mobile: dropdown menu */}
                {open && (
                    <div className="border-t border-border px-6 pb-6 pt-4 md:hidden">
                        <ul className="flex flex-col gap-1">
                            {links.map((link) => (
                                <li key={link.href}>
                                    <a href={link.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-base font-medium hover:bg-primary-hover/10 hover:text-primary">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 flex flex-col gap-3">
                            <Link href="/login" className="rounded-lg border border-border px-4 py-3 text-center text-sm font-semibold hover:bg-primary-hover/10">Log in</Link>
                            <Link href="/signup" className="rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-white hover:bg-primary-hover">Sign up</Link>
                        </div>
                    </div>
                )}
        </header>
    )
}