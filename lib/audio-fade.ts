export const NORMAL_VOLUME = 0.38;
export const LETTER_VOLUME = 0.18;

export function scheduleGain(param: AudioParam, now: number, target: number, duration: number) {
  const current = param.value;
  if (typeof param.cancelAndHoldAtTime === "function") param.cancelAndHoldAtTime(now);
  else { param.cancelScheduledValues(now); param.setValueAtTime(current, now); }
  param.linearRampToValueAtTime(Math.max(0, Math.min(1, target)), now + duration);
}
