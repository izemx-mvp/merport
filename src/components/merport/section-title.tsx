import type { ReactNode } from "react";

export function SectionTitle({ eyebrow, title, children, tone = "" }: { eyebrow: string; title: ReactNode; children?: ReactNode; tone?: string }) {
  return <div className={`section-title ${tone}`}><span className="eyebrow"><i/> {eyebrow}</span><h2>{title}</h2>{children && <p>{children}</p>}</div>;
}