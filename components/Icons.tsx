import type { SVGProps } from "react";
export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: "lock" | "arrow" | "headphones" | "sound" | "pause" | "down" }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    {name === "lock" && <><rect x="5" y="10" width="14" height="11" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>}
    {name === "arrow" && <path d="M4 12h16m-6-6 6 6-6 6" />}
    {name === "headphones" && <><path d="M4 14v-3a8 8 0 0 1 16 0v3" /><rect x="3" y="12" width="4" height="9" rx="2" /><rect x="17" y="12" width="4" height="9" rx="2" /></>}
    {name === "sound" && <><path d="m11 4-6 5H2v6h3l6 5V4ZM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" /></>}
    {name === "pause" && <path d="M9 5v14M15 5v14" />}
    {name === "down" && <path d="M12 3v18m-6-6 6 6 6-6" />}
  </svg>;
}
