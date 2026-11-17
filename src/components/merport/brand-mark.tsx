import logoAsset from "@/assets/merport-logo.png.asset.json";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <img
      src={logoAsset.url}
      alt="MERPORT — Distribution matériel électrique"
      className={compact ? "brand-mark brand-mark-compact" : "brand-mark"}
    />
  );
}
