import { useEffect, useState } from "react";
import { relationship } from "@/data/relationship";
import { relationshipDuration, type Duration } from "@/lib/relationship-duration";
import ScrollReveal from "./ScrollReveal";

const units = [{ key: "years", label: "yıl" }, { key: "months", label: "ay" }, { key: "days", label: "gün" }, { key: "hours", label: "saat" }, { key: "minutes", label: "dakika" }] as const;

export default function RelationshipCounter() {
  const [duration, setDuration] = useState<Duration | null>(null);
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    function update() {
      clearTimeout(timeout);
      setDuration(relationshipDuration(relationship.start, new Date(), relationship.timeZone));
      timeout = setTimeout(update, 60000 - Date.now() % 60000 + 20);
    }
    const initial = setTimeout(update, 0);
    const onVisible = () => { if (!document.hidden) update(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { clearTimeout(initial); clearTimeout(timeout); document.removeEventListener("visibilitychange", onVisible); };
  }, []);
  return <section id="together" className="counter-section story-section" aria-labelledby="counter-title"><ScrollReveal>
    <p className="eyebrow">{relationship.displayDate} TARİHİNDEN BERİ</p>
    <h2 id="counter-title" className="section-title">Ne kadar zamandır <em>biziz?</em></h2>
    <div className="counter-grid" role="timer" aria-label="Birlikte geçen süre" aria-live="off">{units.map(unit => <div className="counter-unit" key={unit.key}><span className="counter-value">{duration ? String(duration[unit.key]).padStart(2, "0") : "—"}</span><span className="counter-label">{unit.label}</span></div>)}</div>
    <p className="counter-note"><span aria-hidden="true" />Ve sayaç hâlâ devam ediyor...</p>
  </ScrollReveal></section>;
}

