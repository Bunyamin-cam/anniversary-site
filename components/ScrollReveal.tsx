import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

export default function ScrollReveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    element.classList.add("reveal-pending");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { element.classList.add("revealed"); observer.disconnect(); }
    }, { threshold: 0.12 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties} className={`scroll-reveal ${className}`}>{children}</div>;
}
