import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { CurrentLines } from "./current-lines";

export type Crumb = { label: string; to?: string; params?: Record<string, string> };
export type HeroStat = { value: string; label: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Fil d’Ariane">
      <ol>
        <li><Link to="/">Accueil</Link></li>
        {items.map((item) => (
          <li key={item.label}>
            {item.to ? <Link to={item.to} params={item.params as never}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Editorial page hero: blueprint grid, glowing current lines, giant outlined word,
 * and (optionally) a framed image with technical corner marks plus a stats row.
 */
export function PageHero({
  eyebrow,
  title,
  children,
  crumbs,
  image,
  imageAlt = "",
  word,
  stats,
  caption,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  crumbs: Crumb[];
  image?: string;
  imageAlt?: string;
  /** Giant outlined word in the background (defaults to the eyebrow). */
  word?: string;
  stats?: HeroStat[];
  caption?: string;
}) {
  return (
    <section className={image ? "page-hero phx phx-media-on" : "page-hero phx"}>
      <div className="phx-grid" aria-hidden="true" />
      <CurrentLines className="phx-lines" />
      <div className="container phx-inner">
        <div className="phx-text">
          <Breadcrumbs items={crumbs} />
          <span className="phx-tag"><span className="live-dot" aria-hidden="true" /> {eyebrow}</span>
          <h1 className="phx-title">{title}</h1>
          {children && <div className="page-hero-lead">{children}</div>}
          {stats && stats.length > 0 && (
            <dl className="phx-stats">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        {image && (
          <figure className="phx-media">
            <img src={image} alt={imageAlt} width={1200} height={1200} fetchPriority="high" decoding="async" />
            <span className="corner corner-tl" aria-hidden="true" />
            <span className="corner corner-br" aria-hidden="true" />
            {caption && <figcaption><span className="live-dot" aria-hidden="true" /> {caption}</figcaption>}
          </figure>
        )}
      </div>
      <div className="phx-word" aria-hidden="true">{word ?? eyebrow}</div>
    </section>
  );
}
