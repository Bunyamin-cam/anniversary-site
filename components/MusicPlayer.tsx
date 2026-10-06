import type { RefObject } from "react";
import { Icon } from "./Icons";
import { assetPath } from "@/lib/asset-path";
export default function MusicPlayer({ audioRef, active, playing, error, onPlaying, onError, onToggle }: {
  audioRef: RefObject<HTMLAudioElement | null>; active: boolean; playing: boolean; error: string;
  onPlaying: (playing: boolean) => void; onError: () => void; onToggle: () => void;
}) {
  return <>
    <audio ref={audioRef} src={assetPath("/music/our-song.mp3")} preload="none" loop onPlay={() => onPlaying(true)} onPause={() => onPlaying(false)} onError={onError} />
    {active && <div className="music-container"><button className="music-button" onClick={onToggle} aria-label={playing ? "Müziği duraklat" : "Müziği çal"} aria-pressed={playing}>
      <Icon name={playing ? "pause" : "sound"} /><span>{playing ? "Bizim şarkımız" : "Müziği çal"}</span>
      <span className={`equalizer ${playing ? "playing" : ""}`} aria-hidden="true"><i /><i /><i /></span>
    </button><p className="music-error" role="status">{error}</p></div>}
  </>;
}
