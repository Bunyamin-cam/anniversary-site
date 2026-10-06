import { Icon } from "./Icons";
import { relationship } from "@/data/relationship";
export default function CinematicIntro() {
  return <section className="screen cinematic-screen" aria-labelledby="cinematic-title">
    <div className="cinema-line" />
    <p className="eyebrow cinema-kicker">BİZİM HİKÂYEMİZ</p>
    <h1 id="cinematic-title" tabIndex={-1} data-screen-heading className="cinema-title">HER ŞEY BİR<br /><em>GÜN BAŞLADI</em></h1>
    <p className="cinema-date">{relationship.displayDate}</p>
    <a href="#together" className="scroll-cue"><span>Aşağı kaydır</span><Icon name="down" /></a>
  </section>;
}

