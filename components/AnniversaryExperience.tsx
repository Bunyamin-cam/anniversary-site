"use client";
import { useEffect, useRef, useState } from "react";
import AnniversaryGate from "./AnniversaryGate";
import BackgroundEffects from "./BackgroundEffects";
import HeadphoneIntro from "./HeadphoneIntro";
import CinematicIntro from "./CinematicIntro";
import MusicPlayer from "./MusicPlayer";
import RelationshipCounter from "./RelationshipCounter";
import MemoryGallery from "./MemoryGallery";
import SealedLetter from "./SealedLetter";
import useCinematicAudio from "./useCinematicAudio";
type Stage = "gate" | "headphones" | "cinematic";
export default function AnniversaryExperience() {
  const [stage, setStage] = useState<Stage>("gate");
  const [leaving, setLeaving] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [musicError, setMusicError] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const { play, setNearLetter } = useCinematicAudio(audioRef);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => { if (stage !== "gate") document.querySelector<HTMLElement>("[data-screen-heading]")?.focus({ preventScroll: true }); }, [stage]);
  function transition(next: Stage) {
    if (leaving) return;
    setLeaving(true);
    timer.current = setTimeout(() => { setStage(next); setLeaving(false); window.scrollTo({ top: 0, behavior: "instant" }); }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 650);
  }
  function playMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    setMusicError("");
    // Start directly from a click to preserve mobile browser user activation.
    void play().catch(() => setMusicError("Müzik şu an çalınamıyor. Yeniden deneyebilirsin."));
  }
  return <main className={`experience relative isolate min-h-svh text-center ${stage === "cinematic" ? "story-unlocked" : ""}`}>
    <BackgroundEffects />
    <div key={stage} className={`stage ${leaving ? "stage-leaving" : "stage-entering"}`} inert={leaving}>
      {stage === "gate" && <AnniversaryGate onUnlock={() => transition("headphones")} />}
      {stage === "headphones" && <HeadphoneIntro onReady={() => { playMusic(); transition("cinematic"); }} />}
      {stage === "cinematic" && <><CinematicIntro /><RelationshipCounter /><MemoryGallery /><SealedLetter onProximityChange={setNearLetter} /></>}
    </div>
    <footer className="site-footer"><span className="footer-caption">BAZI ANLAR, SONSUZA KADAR.</span><div className="step-indicators" aria-label={`Adım ${stage === "gate" ? 1 : stage === "headphones" ? 2 : 3} / 3`}>{["gate", "headphones", "cinematic"].map((step, i) => <span key={step} className={stage === step ? "current" : ""}>{String(i + 1).padStart(2, "0")}</span>)}</div><span className="footer-edition">BİZİM HİKÂYEMİZ</span></footer>
    <MusicPlayer audioRef={audioRef} active={stage === "cinematic"} playing={playing} error={musicError} onPlaying={setPlaying} onError={() => setMusicError("Şarkı henüz burada değil. Hikâyemiz sessizce devam ediyor.")} onToggle={() => { if (playing) audioRef.current?.pause(); else playMusic(); }} />
  </main>;
}



