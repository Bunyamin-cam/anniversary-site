import { useCallback, useEffect, useRef, type RefObject } from "react";
import { LETTER_VOLUME, NORMAL_VOLUME, scheduleGain } from "@/lib/audio-fade";

type AudioGraph = { context: AudioContext; gain: GainNode; source: MediaElementAudioSourceNode };

export default function useCinematicAudio(audioRef: RefObject<HTMLAudioElement | null>) {
  const graph = useRef<AudioGraph | null>(null);
  const target = useRef(NORMAL_VOLUME);
  const fallbackTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const started = useRef(false);

  const fade = useCallback((level: number, seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fallbackTimer.current) clearInterval(fallbackTimer.current);
    audio.dataset.volumeTarget = String(level);
    if (graph.current) {
      scheduleGain(graph.current.gain.gain, graph.current.context.currentTime, level, seconds);
      return;
    }
    const initial = audio.volume;
    const begin = performance.now();
    fallbackTimer.current = setInterval(() => {
      const progress = Math.min(1, (performance.now() - begin) / (seconds * 1000));
      audio.volume = initial + (level - initial) * progress;
      if (progress === 1 && fallbackTimer.current) { clearInterval(fallbackTimer.current); fallbackTimer.current = null; }
    }, 40);
  }, [audioRef]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return Promise.reject(new Error("Audio unavailable"));
    // Create/unlock Web Audio synchronously in the user's click, including iOS.
    if (!graph.current && !started.current) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        const context = new AudioContextClass();
        const gain = context.createGain();
        gain.gain.value = 0;
        const source = context.createMediaElementSource(audio);
        source.connect(gain).connect(context.destination);
        graph.current = { context, gain, source };
        audio.dataset.volumeEngine = "web-audio";
      } else { audio.volume = 0; audio.dataset.volumeEngine = "media-volume"; }
    }
    const resumed = graph.current?.context.resume() ?? Promise.resolve();
    const playing = audio.play(); // Never defer this behind an await or an effect.
    return Promise.all([resumed, playing]).then(() => {
      const first = !started.current;
      started.current = true;
      fade(target.current, first ? 2.5 : 1.2);
    });
  }, [audioRef, fade]);

  const setNearLetter = useCallback((near: boolean) => {
    target.current = near ? LETTER_VOLUME : NORMAL_VOLUME;
    if (started.current) fade(target.current, 1.8);
  }, [fade]);

  useEffect(() => () => {
    if (fallbackTimer.current) clearInterval(fallbackTimer.current);
    if (graph.current) { graph.current.source.disconnect(); void graph.current.context.close(); graph.current = null; }
  }, []);
  return { play, setNearLetter };
}
