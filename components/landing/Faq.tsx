"use client";

import { useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { Send } from 'lucide-react';

const faqs = [
  {
    question: "Is DayFlow really free?",
    answer: "Yes. The Free plan has no time limit and doesn't need a credit card. You can upgrade to Pro whenever you need more.",
  },
  {
    question: "What can I organize with DayFlow?",
    answer:
      "Tasks, calendar events, notes, shopping lists and reminders, all in one place, so you don't need a separate app for each.",
  },
  {
    question: "Can I use DayFlow on my phone?",
    answer:
      "DayFlow runs in your browser and the layout adapts to any screen size, so it works on phones, tablets and computers.",
  },
  {
    question: "Can I cancel my Pro plan at any time?",
    answer:
      "Yes. You can cancel whenever you want and you'll keep access until the end of the period you've paid for.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Your data is tied to your account and only you can see it. Passwords are never stored in plain text.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return(
    <section id="faq" className="scroll-mt-20 bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Text + illustration */}
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-sm font-semibold text-primary">FAQ</span>
            <h2 className="mt-6 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted lg:mx-0">
              Everything you need to know about DayFlow. Can&apos;t find the answer you&apos;re 
              looking for? Reach out and we&apos;ll get back to you.
            </p>
            <Link href="mailto:hello@dayflow.com" className="mt-6 inline-block rounded-lg border border-border bg-white px-6 py-3 text-base font-semibold hover:bg-primary-hover/10 hover:text-primary">
            Contact Us</Link>
          </div>

          <div className="flex justify-center lg:justify-end">
            <Image src="/FAQ.svg" alt="" width={500} height={400} aria-hidden='true' className="h-auto w-full max-w-sm lg:max-w-md"/>
          </div>
        </div>

        {/* Chat */}
        <div className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-3xl border border-border bg-white shadow-lg">
          <div className="flex items-center gap-3 border-b border-border px-5 py-4 md:px-8">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <span className="h-3 w-3 rounded-full bg-white"/>
            </span>
            <div>
              <p className="text-sm font-bold leading-tight">DayFlow Help</p>
              <p className="flex items-center gap-1.5 text-xs text-muted">
                <span className="h-2 w-2 rounded-full bg-accent"/>
                Online
              </p>
            </div>
          </div>

          <div className="space-y-5 bg-surface/60 px-5 py-8 md:px-8">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return(
                <div key={faq.question}>
                  <button type="button" onClick={() => setOpenIndex(isOpen ? null : index)} aria-expanded={isOpen} className={`ml-auto block max-w-[85%] rounded-2xl rounded-br-sm px-5 py-3 text-left font-semibold transition-colors md:max-w-[70%] ${
                    isOpen
                    ? "bg-primary text-white"
                    : "bg-primary-soft text-primary hover:bg-primary/20"
                  }`}> {faq.question}</button>

                  <div className={`grid transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}>
                    <div className="overflow-hidden">
                      <div className="flex items-end gap-3 pt-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary">
                          <span className="h-2.5 w-2.5 rounded-full bg-white"/>
                        </span>
                        <p className="max-w-[85%] rounded-2xl rounded-bl-sm border border-border bg-white px-5 py-3 text-muted md:max-w-[70%]">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input bar */}
          <div aria-hidden='true' className="flex items-center gap-3 border-t border-border px-5 py-4 md:px-8">
            <div className="flex-1 rounded-full bg-surface px-5 py-3 text-sm text-muted">Pick a question above...</div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
              <Send size={18}/>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}