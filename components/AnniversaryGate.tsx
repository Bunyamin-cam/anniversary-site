import { useState, type FormEvent } from "react";
import { Icon } from "./Icons";
import { relationship } from "@/data/relationship";
export default function AnniversaryGate({ onUnlock }: { onUnlock: () => void }) {
  const [date, setDate] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (date === relationship.displayDate) onUnlock();
    else { setError(true); setAttempt(value => value + 1); }
  }
  return <section className="screen gate-screen" aria-labelledby="gate-title">
    <div className="intro-copy"><p className="eyebrow">SADECE İKİMİZİN BİLDİĞİ</p>
      <h1 id="gate-title">Bazı hikâyelerin<br />anahtarı <em>bir tarihtir.</em></h1>
      <p className="description">Bizim hikâyemizin başladığı günü hatırlıyor musun?</p>
    </div>
    <form className="glass-card" onSubmit={submit} noValidate>
      <div className="lock-medallion"><Icon name="lock" /></div>
      <label htmlFor="anniversary-date" className="date-label">İlk kez yollarımızın kesiştiği gün</label>
      <div className="input-wrap">
        <input id="anniversary-date" type="text" inputMode="numeric" autoComplete="off" placeholder="GG.AA.YYYY" maxLength={10} value={date}
          aria-invalid={error} aria-describedby="date-help date-error"
          onChange={event => { const digits = event.target.value.replace(/\D/g, "").slice(0, 8); setDate([digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join(".")); setError(false); }} />
      </div>
      <p id="date-help" className="input-hint">GÜN <span>·</span> AY <span>·</span> YIL</p>
      <button type="submit" className="primary-button">Hikâyemize açıl <Icon name="arrow" /></button>
      <div id="date-error" className="error-slot" role="status" aria-live="polite">{error && <p key={attempt} className="error-message">Biraz daha düşün ❤️</p>}</div>
    </form>
    <p className="private-note"><span /> Bu küçük evren, sadece bize ait.</p>
  </section>;
}
