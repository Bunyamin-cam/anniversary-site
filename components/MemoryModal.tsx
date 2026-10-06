import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { Memory } from "@/data/memories";
import MemoryPhoto from "./MemoryPhoto";

export default function MemoryModal({ memory, onClose }: { memory: Memory; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => { element?.close(); document.body.style.overflow = overflow; previousFocus?.focus({ preventScroll: true }); };
  }, []);
  return createPortal(<dialog ref={dialog} className="memory-modal" aria-labelledby="memory-modal-title" aria-describedby={memory.description ? "memory-modal-description" : undefined} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="modal-panel">
      <button className="modal-close" onClick={onClose} aria-label="Anıyı kapat" autoFocus>×</button>
      <MemoryPhoto src={memory.photo} title={memory.title} tone={memory.tone} sizes="(max-width: 700px) 90vw, 800px" />
      <div className="modal-copy">{memory.date && <p className="moment-date">{memory.date}</p>}<h2 id="memory-modal-title">{memory.title}</h2>{memory.description && <p id="memory-modal-description">{memory.description}</p>}</div>
    </div>
  </dialog>, document.body);
}
