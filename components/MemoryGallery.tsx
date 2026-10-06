import { useState, type CSSProperties } from "react";
import { memories, type Memory } from "@/data/memories";
import MemoryPhoto from "./MemoryPhoto";
import MemoryModal from "./MemoryModal";
import ScrollReveal from "./ScrollReveal";

export default function MemoryGallery() {
  const [selected, setSelected] = useState<Memory | null>(null);
  return <section className="gallery-section story-section" aria-labelledby="gallery-title">
    <ScrollReveal><h2 id="gallery-title" className="section-title"><em>Anılarımız</em></h2><p className="gallery-note">Bazı anlar geçip gitmez.</p></ScrollReveal>
    <div className="memory-grid">{memories.map((memory, index) => <ScrollReveal key={memory.id} className="gallery-item" delay={(index % 3) * 75}><button className="memory-card" style={{ "--card-angle": `${[-1.2, .8, -0.5, 1.1, -.7, .5][index % 6]}deg` } as CSSProperties} onClick={() => setSelected(memory)} aria-label={`${memory.title}, anıyı aç`} aria-haspopup="dialog">
      <MemoryPhoto src={memory.thumbnail} title={memory.title} tone={memory.tone} sizes="(max-width: 360px) 85vw, (max-width: 600px) 43vw, (max-width: 900px) 40vw, 520px" />
      <span className="memory-card-title">{memory.title}</span>
    </button></ScrollReveal>)}</div>
    {selected && <MemoryModal memory={selected} onClose={() => setSelected(null)} />}
  </section>;
}
