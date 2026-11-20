import { useEffect, useRef } from "react";
import logoAsset from "@/assets/merport-logo.png";

const FALLBACK = "/favicon.png";

function applyFallback(img: HTMLImageElement | null) {
  if (img && !img.src.endsWith(FALLBACK)) img.src = FALLBACK;
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  const ref = useRef<HTMLImageElement>(null);
  // L’image peut échouer avant l’hydratation (onError n’est alors pas reçu) : on vérifie au montage.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) applyFallback(img);
  }, []);
  return (
    <img
      ref={ref}
      src={logoAsset}
      alt="MERPORT — Distribution matériel électrique"
      width={160}
      height={64}
      className={compact ? "brand-mark brand-mark-compact" : "brand-mark"}
      onError={(event) => applyFallback(event.currentTarget)}
    />
  );
}
