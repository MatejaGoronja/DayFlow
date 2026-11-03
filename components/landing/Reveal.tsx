"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  direction?: "left" | "right" | "up";
  delay?: number;
  className?: string;
};

const hiddenStyles = {
  left: "-translate-x-24",
  right: "translate-x-24",
  up: "translate-y-12",
};

export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if(entry.isIntersecting){
          setVisible(true);
        }else if(entry.boundingClientRect.top > 0){
          setVisible(false);
        }
      },
      {threshold: 0.2, rootMargin: "0px 0px -15% 0px"}
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return(
    <div ref={ref} style={{transitionDelay: `${delay}ms`}}
    className={`transition-all duration-1000 ease-out motion-reduce:transition-none ${
      visible
      ? "translate-x-0 translate-y-0 opacity-100"
      : `${hiddenStyles[direction]} opacity-0 motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:opacity-100`
    } ${className}`}>{children}</div>
  );
}