import Link from "next/link";
import Reveal from "./Reveal";

export default function Cta(){
    return(
        <section className="overflow-hidden bg-white px-6 py-20 md:py-28">
            <Reveal direction="up" className="mx-auto max-w-5xl">
                <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary via-[#6e6ee0] to-[#8c8cf0] px-6 py-16 text-center text-white shadow-xl md:px-16 md:py-20">
                    {/* Circles */}
                    <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10"/>
                    <div className="pointer-events-none absolute -bottom-20 -right-12 h-72 w-72 rounded-full bg-white/10"/>

                    <div className="relative">
                        <h2 className="mx-auto max-w-2xl text-balance text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                            Ready to take control of your day?
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
                            Join DayFlow for free. No credit card required.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                            <Link href="/signup" className="rounded-lg bg-white px-6 py-3 text-base font-semibold text-primary transition-colors hover:bg-primary-soft">
                            Get Started Free
                            </Link>
                            <a href="#pricing" className="rounded-lg border border-white/40 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10">
                            See Pricing
                            </a>
                        </div>
                    </div>
                </div>
            </Reveal>
        </section>
    );
}