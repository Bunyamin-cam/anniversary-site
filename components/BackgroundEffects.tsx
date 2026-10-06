import type { CSSProperties } from "react";
export default function BackgroundEffects() {
  return <div className="background-effects" aria-hidden="true">
    <div className="nebula" /><div className="orbit orbit-one" /><div className="orbit orbit-two" />
    {Array.from({ length: 48 }, (_, i) => <span key={i} className={`star ${i % 3 === 0 ? "star-drifting" : ""}`} style={{ left: `${(i * 37.73 + 3) % 100}%`, top: `${(i * 23.17 + 7) % 100}%`, "--size": `${i % 7 === 0 ? 2.8 : i % 3 === 0 ? 2 : 1.3}px`, "--opacity": `${0.45 + (i % 5) * 0.1}`, "--delay": `${-(i * 1.37)}s`, "--duration": `${[3, 5, 7, 6, 4][i % 5]}s` } as CSSProperties} />)}
    <div className="grain" />
  </div>;
}
