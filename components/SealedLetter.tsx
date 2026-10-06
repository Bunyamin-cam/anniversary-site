import { useEffect, useRef, useState } from "react";
import { letter } from "@/data/letter";
import ScrollReveal from "./ScrollReveal";

export default function SealedLetter({ onProximityChange }: { onProximityChange: (near: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => onProximityChange(entry.isIntersecting), { rootMargin: "200px 0px", threshold: 0 });
    observer.observe(element);
    return () => { observer.disconnect(); onProximityChange(false); };
  }, [onProximityChange]);
  return <section ref={section} className="letter-section" aria-labelledby="letter-heading">
    <ScrollReveal>
      <p id="letter-heading" className="letter-heading">{letter.heading}</p>
      <div className={`letter-scene ${open ? "letter-open" : ""}`}>
        <div className="envelope-back" aria-hidden="true" />
        <div className="envelope-flap" aria-hidden="true" />
        <article id="personal-letter" className="letter-paper" aria-hidden={!open}>
          <span className="paper-mark" aria-hidden="true">SANA</span>
          <p>{letter.text}</p>
        </article>
        <div className="envelope-front" aria-hidden="true" />
        <button className="seal-button" aria-label={open ? "Mektup açıldı" : "Mühüre tıkla"} aria-expanded={open} aria-controls="personal-letter" aria-disabled={open} onClick={() => setOpen(true)}>
          <span className="seal-half seal-left" aria-hidden="true" />
          <span className="seal-half seal-right" aria-hidden="true" />
          <span className="seal-symbol" aria-hidden="true">✧</span>
        </button>
        <p className="seal-hint" role="status">{open ? "Sadece sana." : "Mühüre tıkla"}</p>
      </div>
    </ScrollReveal>
  </section>;
}
