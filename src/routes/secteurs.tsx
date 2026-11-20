import { useEffect, useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { sectors } from "@/data/sectors";
import { site } from "@/config/site";
import { seo } from "@/lib/seo";
import { WhatsAppIcon } from "@/components/merport/site-shell";
// Tailwind tokens/utilities: src/home.css

export const Route = createFileRoute("/secteurs")({
  head: () =>
    seo({
      title: "Secteurs d’activité",
      description:
        "Industrie, BTP, énergie, logistique, installateurs : MERPORT fournit le matériel électrique adapté à chaque secteur, au Maroc et à l’export.",
    }),
  component: SectorsPage,
});

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const pad = (n: number) => String(n).padStart(2, "0");
const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

function Label({ children, light, className }: { children: ReactNode; light?: boolean; className?: string }) {
  return (
    <p
      className={cx(
        "mb-[18px] inline-flex items-center gap-2.5 font-mono text-[0.74rem] font-medium uppercase tracking-[0.16em]",
        "before:h-0.5 before:w-6 before:bg-current before:content-['']",
        light ? "text-[#ff8a8f]" : "text-mp-red",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** Which sector is in the middle of the viewport (also honours /secteurs#slug on load). */
function useActiveSector() {
  const [active, setActive] = useState(sectors[0]?.slug ?? "");
  useEffect(() => {
    const fromHash = window.location.hash.slice(1);
    if (fromHash && sectors.some((s) => s.slug === fromHash)) setActive(fromHash);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sectors.forEach((sector) => {
      const el = document.getElementById(sector.slug);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return active;
}

const goTo = (slug: string) => {
  document.getElementById(slug)?.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `#${slug}`);
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function SectorsPage() {
  const active = useActiveSector();
  const activeIndex = Math.max(0, sectors.findIndex((s) => s.slug === active));

  return (
    <div className="secteurs overflow-x-clip">
      <SectorsHero activeIndex={activeIndex} />

      {/* Mobile selector bar */}
      <div className="sticky top-[var(--header-h,72px)] z-30 border-b border-mp-line bg-white/90 backdrop-blur-xl lg:hidden">
        <div className="container flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
          {sectors.map((s, i) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => goTo(s.slug)}
              className={cx(
                "inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border-[1.5px] py-1.5 pl-1.5 pr-3.5 text-[0.84rem] font-semibold transition",
                i === activeIndex ? "border-mp-ink bg-mp-ink text-white" : "border-mp-line text-mp-ink",
              )}
            >
              <span className={cx("grid size-6 place-items-center rounded-full font-mono text-[0.62rem]", i === activeIndex ? "bg-mp-red" : "bg-mp-paper text-mp-muted")}>
                {pad(i + 1)}
              </span>
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <section className="bg-mp-paper bg-blueprint py-14 md:py-20">
        <div className="container grid items-start gap-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-16">
          <SelectorSwitch activeIndex={activeIndex} />
          <div className="grid gap-8 md:gap-12">
            {sectors.map((sector, index) => (
              <SectorChapter key={sector.slug} sector={sector} index={index} on={index === activeIndex} />
            ))}
          </div>
        </div>
      </section>

      <OtherSectorCta />
    </div>
  );
}

/* =================================================================== */
/* 1. HERO                                                              */
/* =================================================================== */

function SectorsHero({ activeIndex }: { activeIndex: number }) {
  const stats = [
    { value: pad(sectors.length), label: "Secteurs servis" },
    { value: "1988", label: "Depuis" },
    { value: "Maroc", label: "Et accompagnement export" },
  ];
  return (
    <section className="relative isolate overflow-hidden bg-mp-navy bg-blueprint-dark text-white">
      <div className="pointer-events-none absolute -right-40 -top-40 -z-10 size-[620px] rounded-full bg-[radial-gradient(circle,rgba(215,31,43,0.22),transparent_65%)]" />
      <div className="container pb-16 pt-10 lg:pb-20 lg:pt-14">
        <nav aria-label="Fil d’Ariane" className="mb-10 animate-fade-up">
          <ol className="m-0 flex list-none items-center gap-1.5 p-0 text-[0.84rem] text-white/60">
            <li>
              <Link to="/" className="transition-colors hover:text-white">
                Accueil
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={14} />
            </li>
            <li aria-current="page" className="text-white">
              Secteurs
            </li>
          </ol>
        </nav>

        <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Label light className="animate-fade-up [animation-delay:80ms]">
              Secteurs d’activité
            </Label>
            <h1 className="m-0 text-[clamp(2.6rem,5.8vw,5.4rem)] font-extrabold leading-[0.95] tracking-[-0.045em] text-white">
              <span className="block animate-fade-up [animation-delay:160ms]">Le bon matériel,</span>
              <span className="block text-[#ff4d55] animate-fade-up [animation-delay:260ms]">pour chaque métier.</span>
            </h1>
          </div>
          <div className="animate-fade-up [animation-delay:360ms]">
            <p className="m-0 max-w-[46ch] text-[1.06rem] leading-relaxed text-white/75">
              Depuis 1988, nous accompagnons industriels, entreprises du BTP, installateurs et opérateurs d’infrastructures,
              au Maroc et à l’export.
            </p>
            <dl className="m-0 mt-8 grid grid-cols-3 gap-4 border-t border-white/15 pt-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <dd className="m-0 font-mono text-[clamp(1.3rem,2.4vw,1.9rem)] font-medium leading-none text-white">{s.value}</dd>
                  <dt className="mt-2 text-[0.76rem] text-white/55 sm:text-[0.8rem]">{s.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Image strip: one tile per sector, the active one widens */}
        <div className="mt-12 hidden h-[180px] gap-2 md:flex">
          {sectors.map((s, i) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => goTo(s.slug)}
              className={cx(
                "group relative min-w-0 cursor-pointer overflow-hidden rounded-2xl transition-[flex-grow] duration-700 ease-out-expo",
                i === activeIndex ? "grow-[3]" : "grow",
              )}
              style={{ flexBasis: 0 }}
            >
              <img src={s.image} alt="" width={1200} height={1200} loading="lazy" className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105" />
              <span className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,17,42,0.9),rgba(8,17,42,0.2))]" />
              <span className="absolute bottom-3 left-4 right-4 truncate text-left text-[0.9rem] font-bold text-white">
                <span className="mr-2 font-mono text-[0.7rem] font-normal text-[#ff8a8f]">{pad(i + 1)}</span>
                {s.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================================================================== */
/* 2. SELECTOR SWITCH — a rotary switch that follows the scroll         */
/* =================================================================== */

function SelectorSwitch({ activeIndex }: { activeIndex: number }) {
  const n = sectors.length;
  const sweep = 270;
  const angleOf = (i: number) => -sweep / 2 + (n > 1 ? (i * sweep) / (n - 1) : 0);
  const pointer = angleOf(activeIndex);

  return (
    <aside className="sticky top-[calc(var(--header-h,72px)+32px)] hidden lg:block" aria-label="Sélecteur de secteur">
      <div className="rounded-[26px] border border-mp-line bg-[linear-gradient(180deg,#fbfbfd,#eceef3)] p-6 shadow-[0_40px_80px_-50px_rgba(11,24,56,0.55)]">
        <div className="flex items-center justify-between font-mono text-[0.66rem] uppercase tracking-[0.16em] text-mp-muted">
          <span>Commutateur</span>
          <span className="text-mp-red">
            Pos. {pad(activeIndex + 1)}
          </span>
        </div>

        {/* Dial */}
        <svg viewBox="-110 -108 220 186" className="mx-auto mt-4 block w-[240px]" aria-hidden="true">
          <defs>
            <radialGradient id="sw-knob" cx="40%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#2a3150" />
              <stop offset="100%" stopColor="#0b1838" />
            </radialGradient>
          </defs>
          {/* scale */}
          {sectors.map((s, i) => {
            const a = ((angleOf(i) - 90) * Math.PI) / 180;
            const on = i === activeIndex;
            return (
              <g key={s.slug}>
                <line
                  x1={Math.cos(a) * 82}
                  y1={Math.sin(a) * 82}
                  x2={Math.cos(a) * 94}
                  y2={Math.sin(a) * 94}
                  stroke={on ? "#d71f2b" : "#9aa0ab"}
                  strokeWidth={on ? 4 : 2}
                  strokeLinecap="round"
                />
                <text
                  x={Math.cos(a) * 70}
                  y={Math.sin(a) * 70 + 4}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize="11"
                  fill={on ? "#d71f2b" : "#5d6679"}
                  fontWeight={on ? 700 : 400}
                >
                  {pad(i + 1)}
                </text>
              </g>
            );
          })}
          {/* knob */}
          <circle r="52" fill="#c9cdd6" />
          <circle r="48" fill="url(#sw-knob)" />
          <g style={{ transform: `rotate(${pointer}deg)`, transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1)" }}>
            <rect x="-9" y="-46" width="18" height="92" rx="9" fill="#14204a" stroke="rgba(255,255,255,0.12)" />
            <rect x="-3" y="-42" width="6" height="22" rx="3" fill="#d71f2b" />
          </g>
          <circle r="5" fill="#0b1838" stroke="rgba(255,255,255,0.2)" />
        </svg>

        {/* Positions */}
        <ol className="m-0 mt-5 grid list-none gap-1 border-t border-mp-line p-0 pt-4">
          {sectors.map((s, i) => {
            const on = i === activeIndex;
            return (
              <li key={s.slug}>
                <a
                  href={`#${s.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(s.slug);
                  }}
                  aria-current={on ? "true" : undefined}
                  className={cx(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.92rem] font-semibold transition",
                    on ? "bg-mp-ink text-white" : "text-mp-ink hover:bg-white",
                  )}
                >
                  <span className={cx("font-mono text-[0.68rem]", on ? "text-[#ff8a8f]" : "text-mp-muted")}>{pad(i + 1)}</span>
                  {s.name}
                  {on && <span className="ml-auto size-2 rounded-full bg-mp-red shadow-[0_0_8px_2px_rgba(215,31,43,0.7)]" />}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}

/* =================================================================== */
/* 3. CHAPTER — one sector, with its "bill of materials"                */
/* =================================================================== */

type Sector = (typeof sectors)[number];

function SectorChapter({ sector, index, on }: { sector: Sector; index: number; on: boolean }) {
  return (
    <article
      id={sector.slug}
      className={cx(
        "scroll-mt-[calc(var(--header-h,72px)+80px)] overflow-hidden rounded-[26px] border bg-white transition duration-500 lg:scroll-mt-[calc(var(--header-h,72px)+32px)]",
        on ? "border-mp-ink shadow-[0_40px_80px_-50px_rgba(11,24,56,0.6)]" : "border-mp-line",
      )}
    >
      <figure className="relative m-0 aspect-[16/8] overflow-hidden bg-mp-navy">
        <img
          src={sector.image}
          alt={sector.imageAlt}
          width={1200}
          height={1200}
          loading="lazy"
          decoding="async"
          className={cx("absolute inset-0 size-full object-cover transition duration-[1200ms] ease-out-expo", on ? "scale-100" : "scale-[1.06] saturate-50")}
        />
        <span className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,17,42,0.85)_0%,rgba(8,17,42,0.1)_60%)]" />
        <span aria-hidden="true" className="absolute right-5 top-3 text-[clamp(4rem,9vw,7rem)] font-extrabold leading-none tracking-[-0.05em] text-outline [--outline:rgba(255,255,255,0.7)]">
          {pad(index + 1)}
        </span>
        <figcaption className="absolute bottom-5 left-6 right-6 sm:bottom-7 sm:left-8">
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[#ff8a8f]">
            Secteur {pad(index + 1)} / {pad(sectors.length)}
          </span>
          <h2 className="m-0 mt-2 text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-none tracking-[-0.04em] text-white">{sector.name}</h2>
        </figcaption>
      </figure>

      <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col">
          <p className="m-0 text-[1.08rem] leading-relaxed text-mp-ink">{sector.summary}</p>
          <div className="mt-auto flex flex-wrap gap-3 pt-8">
            <Link
              to="/devis"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-mp-red px-6 font-semibold text-white shadow-[0_8px_20px_-10px_rgba(215,31,43,0.8)] transition hover:-translate-y-px hover:bg-mp-red-dark"
            >
              Demander un devis <ArrowRight size={16} />
            </Link>
            <Link to="/produits" className="inline-flex h-12 items-center rounded-full border-[1.5px] border-mp-line px-6 font-semibold text-mp-ink transition hover:border-mp-ink">
              Catalogue
            </Link>
          </div>
        </div>

        {/* Bill of materials */}
        <div className="overflow-hidden rounded-2xl border border-mp-line">
          <div className="grid grid-cols-[52px_1fr_auto] bg-mp-ink px-4 py-2.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-white/60">
            <span>Pos.</span>
            <span>Besoins couverts</span>
            <span />
          </div>
          <ol className="m-0 list-none p-0">
            {sector.needs.map((need, i) => (
              <li key={need} className="grid grid-cols-[52px_1fr_auto] items-center border-t border-mp-line px-4 py-3 text-[0.94rem] text-mp-ink odd:bg-mp-paper/60">
                <span className="font-mono text-[0.76rem] text-mp-red">{pad(i + 1)}</span>
                <span className="pr-3">{need}</span>
                <span className="grid size-6 place-items-center rounded-full bg-green-500/10 text-green-600">
                  <Check size={14} aria-hidden="true" />
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </article>
  );
}

/* =================================================================== */
/* 4. CTA — sector not listed                                           */
/* =================================================================== */

function OtherSectorCta() {
  return (
    <section className="relative isolate overflow-hidden bg-mp-night py-20 text-white md:py-[100px]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(215,31,43,0.22),transparent_65%)]" />
      <div className="container flex flex-col items-center text-center">
        <span className="font-mono text-[0.74rem] uppercase tracking-[0.16em] text-[#ff8a8f]">Position libre</span>
        <h2 className="m-0 mt-4 max-w-[18ch] text-[clamp(2.2rem,4.8vw,4rem)] font-extrabold leading-[1] tracking-[-0.04em] text-white">
          Votre secteur n’est pas dans la liste ?
        </h2>
        <p className="m-0 mt-5 max-w-[50ch] text-[1.04rem] leading-relaxed text-white/70">
          Hôtellerie, santé, agriculture, enseignement… Si votre projet a besoin de matériel électrique, parlons-en.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/devis" className="inline-flex h-[52px] items-center gap-2 rounded-full bg-mp-red px-7 font-semibold transition hover:bg-mp-red-dark">
            Demander un devis <ArrowRight size={16} />
          </Link>
          <a
            href={`https://wa.me/${site.whatsappDigits}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-[52px] items-center gap-2 rounded-full border-[1.5px] border-white/30 px-7 font-semibold transition hover:border-[#25d366] hover:text-[#25d366]"
          >
            <span className="inline-flex size-4 [&_svg]:size-full">
              <WhatsAppIcon />
            </span>
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}