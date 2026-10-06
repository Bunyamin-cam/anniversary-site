import Image from "next/image";
import { useState } from "react";
import { assetPath } from "@/lib/asset-path";

export default function MemoryPhoto({ src, title, tone = "blue", sizes = "(max-width: 700px) 85vw, 40vw" }: { src: string; title: string; tone?: "blue" | "wine" | "sand"; sizes?: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [directSrc, setDirectSrc] = useState<string | null>(null);
  return <div className={`memory-photo tone-${tone}`}>
    <div className="photo-placeholder" role={failedSrc === src ? "img" : undefined} aria-label={failedSrc === src ? `${title} — fotoğraf alanı` : undefined}>
      <span className="placeholder-orbit" aria-hidden="true" /><span aria-hidden="true" className="placeholder-spark">✧</span><span className="placeholder-caption" aria-hidden="true">BİR AN, SONSUZA KADAR</span>
    </div>
    {failedSrc !== src && <Image key={`${src}-${directSrc === src}`} src={assetPath(src)} alt={title} fill sizes={sizes} loading="lazy" unoptimized={directSrc === src} onError={() => {
      // An optimizer failure must not hide an otherwise valid public file.
      if (directSrc !== src) setDirectSrc(src);
      else setFailedSrc(src);
    }} />}
  </div>;
}
