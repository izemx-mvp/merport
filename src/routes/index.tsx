import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  ClipboardPaste,
  Factory,
  Power,
  Ship,
  ShieldCheck,
  Sparkles,
  Warehouse,
  Wrench,
  Zap,
} from "lucide-react";
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";
import { sectors } from "@/data/sectors";
import { site } from "@/config/site";
import { seo } from "@/lib/seo";
import { WhatsAppIcon } from "@/components/merport/site-shell";
// Tokens, keyframes and custom utilities: src/home.css (imported in src/styles.css)

export const Route = createFileRoute("/")({
  head: () =>
    seo({
      title: "MERPORT — Importateur de matériel électrique à Casablanca",
      description:
        "Câbles, raccordement, cheminement, éclairage, appareillage, automatisme, comptage et outillage : MERPORT importe en direct et livre les professionnels depuis 1988.",
    }),
  component: HomePage,
});

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const pad = (n: number) => String(n).padStart(2, "0");
const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

const btn =
  "inline-flex min-h-[52px] items-center justify-center gap-2 whitespace-nowrap rounded-full px-[26px] font-semibold transition";
const btnRed = `${btn} bg-mp-red text-white shadow-[0_8px_20px_-10px_rgba(215,31,43,0.8)] hover:-translate-y-px hover:bg-mp-red-dark`;
const btnGhost = `${btn} border-[1.5px] border-white/35 bg-white/5 text-white backdrop-blur hover:border-white hover:bg-white/15`;
const btnDark = `${btn} bg-mp-ink text-white hover:-translate-y-px hover:bg-black`;
const sectionTitle =
  "m-0 max-w-[18ch] text-[clamp(2rem,4.2vw,3.6rem)] font-extrabold leading-[1.02] tracking-[-0.035em]";

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

/** Adds `is-in` to every `.reveal` element once it enters the viewport. */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".home .reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/** True once the element has entered the viewport. */
function useInView<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function HomePage() {
  useReveal();
  return (
    <div className="home overflow-x-clip">
      <HeroConfigurator />
      <PrintedCable />
      <DistributionBoard />
      <MeterReadings />
      <SingleLineDiagram />
      <PasteYourList />
      <DeparturesBoard />
      <SwitchCta />
    </div>
  );
}

/* =================================================================== */
/* 1. HERO — live cable configurator                                    */
/* =================================================================== */

type Cores = 3 | 4 | 5;
const CORE_OPTIONS: Cores[] = [3, 4, 5];
const SECTION_OPTIONS = ["1,5", "2,5", "6", "16", "35"] as const;
type Section = (typeof SECTION_OPTIONS)[number];

const COPPER_RATIO: Record<Section, number> = { "1,5": 0.46, "2,5": 0.53, "6": 0.6, "16": 0.68, "35": 0.75 };
const CORE_COLORS: Record<Cores, string[]> = {
  3: ["url(#mp-gy)", "#2f6fd6", "#7a4a2a"],
  4: ["url(#mp-gy)", "#7a4a2a", "#1b1c20", "#8d939e"],
  5: ["url(#mp-gy)", "#2f6fd6", "#7a4a2a", "#1b1c20", "#8d939e"],
};
// 7-strand conductor, unit radius
const STRANDS = [
  [0, 0],
  ...Array.from({ length: 6 }, (_, i) => [Math.cos((i * Math.PI) / 3) * 0.66, Math.sin((i * Math.PI) / 3) * 0.66]),
];

function CableSection({ cores, section }: { cores: Cores; section: Section }) {
  const inner = 132;
  const s = Math.sin(Math.PI / cores);
  const coreR = (inner * s) / (1 + s);
  const dist = inner - coreR;
  const insR = coreR - 3;
  const cuR = insR * COPPER_RATIO[section];
  const colors = CORE_COLORS[cores];
  const smooth = "transition-all duration-700 ease-out-expo";

  return (
    <svg viewBox="-235 -185 470 370" className="h-auto w-full overflow-visible" role="img" aria-label={`Coupe d’un câble ${cores}G${section} mm²`}>
      <defs>
        <radialGradient id="mp-sheath" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#3a3e48" />
          <stop offset="60%" stopColor="#14161b" />
          <stop offset="100%" stopColor="#08090c" />
        </radialGradient>
        <radialGradient id="mp-cu" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f4a46f" />
          <stop offset="100%" stopColor="#a8562b" />
        </radialGradient>
        <pattern id="mp-gy" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="14" height="14" fill="#2f9e44" />
          <rect width="7" height="14" fill="#e4c51c" />
        </pattern>
        <filter id="mp-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>

      {/* red halo */}
      <circle r="150" fill="#d71f2b" opacity="0.28" filter="url(#mp-glow)" />
      {/* sheath + bedding */}
      <circle r="160" fill="url(#mp-sheath)" />
      <circle r="160" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      <circle r="140" fill="#2a2d34" />
      <circle r="140" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="3 5" />

      {colors.map((color, i) => {
        const angle = -90 + (i * 360) / cores;
        return (
          <g key={i} className={smooth} style={{ transform: `rotate(${angle}deg) translate(${dist}px)` }}>
            <g style={{ transform: `rotate(${-angle}deg)` }} className={smooth}>
              <circle className={smooth} r={insR} style={{ r: insR } as unknown as CSSProperties} fill={color} stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
              <circle className={smooth} r={cuR} style={{ r: cuR } as unknown as CSSProperties} fill="url(#mp-cu)" />
              <g className={smooth} style={{ transform: `scale(${cuR})` }}>
                {STRANDS.map(([x, y], k) => (
                  <circle key={k} cx={x} cy={y} r={0.33} fill={k % 2 ? "#d9814d" : "#efa06c"} stroke="#8c4521" strokeWidth={0.04} />
                ))}
              </g>
            </g>
          </g>
        );
      })}

      {/* leader labels */}
      <g fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1.5" fill="rgba(255,255,255,0.7)">
        <line x1="113" y1="-113" x2="168" y2="-150" stroke="rgba(255,255,255,0.4)" />
        <circle cx="113" cy="-113" r="3" fill="#d71f2b" />
        <text x="174" y="-146">GAINE PVC</text>

        <line x1="0" y1={-dist} x2="-150" y2="-160" stroke="rgba(255,255,255,0.4)" className={smooth} />
        <circle cx="0" cy={-dist} r="3" fill="#d71f2b" className={smooth} />
        <text x="-232" y="-164">ÂME CUIVRE</text>

        <line x1={-dist * 0.92} y1={dist * 0.4} x2="-170" y2="150" stroke="rgba(255,255,255,0.4)" className={smooth} />
        <circle cx={-dist * 0.92} cy={dist * 0.4} r="3" fill="#d71f2b" className={smooth} />
        <text x="-232" y="166">ISOLANT PR</text>
      </g>
    </svg>
  );
}

function HeroConfigurator() {
  const [cores, setCores] = useState<Cores>(5);
  const [section, setSection] = useState<Section>("16");
  const reference = `U-1000 R2V ${cores}G${section}`;

  const chip = (on: boolean) =>
    cx(
      "h-10 min-w-12 cursor-pointer rounded-full border px-3.5 font-mono text-[0.82rem] transition",
      on ? "border-mp-red bg-mp-red text-white" : "border-white/20 bg-white/5 text-white/80 hover:border-white/50",
    );

  return (
    <section className="relative isolate overflow-hidden bg-mp-navy bg-blueprint-dark text-white">
      <div className="pointer-events-none absolute -right-40 top-10 -z-10 size-[720px] rounded-full bg-[radial-gradient(circle,rgba(215,31,43,0.22),transparent_65%)]" />
      <div className="pointer-events-none absolute -bottom-60 -left-40 -z-10 size-[620px] rounded-full bg-[radial-gradient(circle,rgba(27,49,112,0.8),transparent_65%)]" />

      <div className="container grid min-h-[calc(100svh-var(--header-h,72px))] items-center gap-12 py-14 lg:grid-cols-[1fr_1.05fr] lg:py-20">
        {/* Copy */}
        <div>
          <p className="m-0 inline-flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-white/70 animate-fade-up">
            <span className="size-2 rounded-full bg-mp-red animate-ping-soft" /> Importateur-distributeur · Casablanca · 1988
          </p>
          <h1 className="mt-6 text-[clamp(2.6rem,5.6vw,5.4rem)] font-extrabold leading-[0.96] tracking-[-0.045em] text-white">
            <span className="block animate-fade-up [animation-delay:120ms]">Le bon câble,</span>
            <span className="block animate-fade-up [animation-delay:240ms]">la bonne section,</span>
            <span className="block text-[#ff4d55] animate-fade-up [animation-delay:360ms]">sans détour.</span>
          </h1>
          <p className="mt-7 max-w-[500px] text-[1.08rem] leading-relaxed text-white/75 animate-fade-up [animation-delay:480ms]">
            Câbles, appareillage, éclairage et tout le matériel électrique professionnel, importés en direct et livrés
            aux industriels, installateurs et entreprises du BTP.
          </p>
          <div className="mt-9 flex flex-wrap gap-3 animate-fade-up [animation-delay:600ms]">
            <Link to="/devis" className={cx(btnRed, "max-sm:basis-full")}>
              Demander un devis <ArrowRight size={16} />
            </Link>
            <Link to="/produits" className={cx(btnGhost, "max-sm:basis-full")}>
              Voir le catalogue
            </Link>
          </div>
          <dl className="mt-12 grid max-w-[520px] grid-cols-3 border-t border-white/15 pt-6 animate-fade-up [animation-delay:720ms]">
            {[
              ["Import", "Direct fabricant"],
              ["Stock", "Aïn Sebaâ"],
              ["Devis", "Sous 24 h"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-white/50">{k}</dt>
                <dd className="m-0 mt-1 font-semibold text-white">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Configurator */}
        <div className="relative animate-fade-up [animation-delay:300ms]">
          <div className="mx-auto max-w-[560px]">
            <CableSection cores={cores} section={section} />
          </div>

          <div className="relative mx-auto -mt-2 max-w-[560px] rounded-3xl border border-white/15 bg-[rgba(8,17,42,0.6)] p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="m-0 inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-white/60">
                <Sparkles size={14} className="text-[#ff6b72]" /> Composez votre câble
              </p>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-white/40">0,6/1 kV · Cu · PR/PVC</span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-[auto_1fr]">
              <div>
                <span className="mb-2 block text-[0.78rem] text-white/55">Conducteurs</span>
                <div className="flex gap-2" role="radiogroup" aria-label="Nombre de conducteurs">
                  {CORE_OPTIONS.map((n) => (
                    <button key={n} type="button" role="radio" aria-checked={cores === n} onClick={() => setCores(n)} className={chip(cores === n)}>
                      {n}G
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="mb-2 block text-[0.78rem] text-white/55">Section (mm²)</span>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Section">
                  {SECTION_OPTIONS.map((s) => (
                    <button key={s} type="button" role="radio" aria-checked={section === s} onClick={() => setSection(s)} className={chip(section === s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
              <div>
                <span className="block font-mono text-[0.66rem] uppercase tracking-[0.14em] text-white/45">Référence</span>
                <strong className="font-mono text-[1.35rem] font-medium tracking-[0.02em] text-white" aria-live="polite">
                  {reference}
                </strong>
              </div>
              <a
                href={`/devis?ref=${encodeURIComponent(reference)}`}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 font-semibold text-mp-ink transition hover:gap-3"
              >
                Demander ce câble <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =================================================================== */
/* 2. BRANDS — printed cable marking                                   */
/* =================================================================== */

function PrintedCable() {
  const marks = brands.flatMap((b, i) => [b.name.toUpperCase(), `${pad(i + 1)}0 M`]);
  const row = [...marks, ...marks];
  return (
    <section className="overflow-hidden bg-white pb-16 pt-20 md:pb-24 md:pt-28" aria-label="Marques distribuées">
      <div className="container reveal mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Label>Marques distribuées</Label>
          <h2 className={cx(sectionTitle, "text-mp-ink")}>
            Des fabricants reconnus, <span className="text-mp-red">sans intermédiaire.</span>
          </h2>
        </div>
        <p className="m-0 max-w-[36ch] text-mp-muted">
          Comme le marquage imprimé sur une gaine : nos marques, au mètre près, en direct d’importation.
        </p>
      </div>

      {/* The cable */}
      <div className="relative -rotate-2 py-6">
        <div className="relative flex h-[76px] items-center overflow-hidden bg-cable shadow-[0_30px_50px_-25px_rgba(11,24,56,0.6)] md:h-[92px]">
          <div className="flex w-max items-center animate-cable">
            {row.map((m, i) => (
              <span
                key={i}
                className={cx(
                  "whitespace-nowrap px-6 font-mono uppercase",
                  i % 2 === 0
                    ? "text-[1.05rem] font-medium tracking-[0.28em] text-white/85 md:text-[1.25rem]"
                    : "text-[0.72rem] tracking-[0.2em] text-white/35",
                )}
              >
                {i % 2 === 0 ? m : `▸ ${m} ▸`}
              </span>
            ))}
          </div>
          {/* specular highlight */}
          <span className="pointer-events-none absolute inset-x-0 top-[18%] h-[2px] bg-white/15" />
        </div>
      </div>

      {/* Brand list, plain typographic */}
      <div className="container reveal mt-14">
        <ul className="m-0 grid list-none grid-cols-2 gap-y-8 p-0 md:grid-cols-3 lg:grid-cols-6">
          {brands.map((b, i) => (
            <li key={b.name} className="border-l-2 border-mp-line pl-4 transition-colors hover:border-mp-red">
              <span className="block font-mono text-[0.7rem] text-mp-red">{pad(i + 1)}</span>
              <strong className="mt-1 block text-[1.15rem] font-extrabold tracking-[-0.02em] text-mp-ink">{b.name}</strong>
              <span className="text-[0.86rem] text-mp-muted">{b.specialty}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* =================================================================== */
/* 3. FAMILIES — the distribution board                                 */
/* =================================================================== */

function Breaker({ index, on, label, onSelect }: { index: number; on: boolean; label: string; onSelect: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={label}
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onClick={onSelect}
      className="group relative flex cursor-pointer flex-col items-center rounded-[10px] border border-[#d6d9e1] bg-[linear-gradient(180deg,#ffffff_0%,#eef0f4_100%)] px-1.5 pb-3 pt-2.5 shadow-[0_2px_0_#c9cdd6,0_14px_24px_-14px_rgba(11,24,56,0.45)] transition-transform hover:-translate-y-0.5"
    >
      {/* top terminals */}
      <span className="flex gap-1.5">
        <i className="size-2.5 rounded-full bg-[radial-gradient(circle,#9aa0ab_30%,#c9cdd6_70%)]" />
        <i className="size-2.5 rounded-full bg-[radial-gradient(circle,#9aa0ab_30%,#c9cdd6_70%)]" />
      </span>
      {/* rating window */}
      <span className="mt-2 rounded-[4px] bg-mp-ink px-1.5 py-0.5 font-mono text-[0.62rem] text-white/80">{pad(index + 1)}</span>
      {/* lever slot */}
      <span className="relative mt-2.5 h-[68px] w-[30px] rounded-[7px] bg-[#1d2027] p-[3px] shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)]">
        <span
          className={cx(
            "absolute left-[3px] right-[3px] h-[30px] rounded-[5px] transition-all duration-300 ease-out-expo",
            on
              ? "top-[3px] bg-[linear-gradient(180deg,#ff4d55,#b3161f)] shadow-[0_0_14px_rgba(215,31,43,0.8)]"
              : "top-[35px] bg-[linear-gradient(180deg,#e6e8ee,#a9aeb9)]",
          )}
        />
      </span>
      {/* state indicator */}
      <span
        className={cx(
          "mt-2.5 rounded-[3px] px-2 py-0.5 font-mono text-[0.6rem] font-medium transition-colors",
          on ? "bg-mp-red text-white" : "bg-[#dfe2e8] text-mp-muted",
        )}
      >
        {on ? "ON" : "OFF"}
      </span>
      {/* bottom terminals */}
      <span className="mt-2.5 flex gap-1.5">
        <i className="size-2.5 rounded-full bg-[radial-gradient(circle,#9aa0ab_30%,#c9cdd6_70%)]" />
        <i className="size-2.5 rounded-full bg-[radial-gradient(circle,#9aa0ab_30%,#c9cdd6_70%)]" />
      </span>
    </button>
  );
}

function DistributionBoard() {
  const [active, setActive] = useState(0);
  const current = categories[active] ?? categories[0];
  if (!current) return null;

  return (
    <section className="bg-mp-paper py-20 md:py-[120px]">
      <div className="container">
        <div className="reveal mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Label>Catalogue · {categories.length} familles</Label>
            <h2 className={cx(sectionTitle, "text-mp-ink")}>
              Enclenchez une famille, <span className="text-mp-red">on s’occupe du reste.</span>
            </h2>
          </div>
          <p className="m-0 max-w-[34ch] text-mp-muted">Chaque disjoncteur ouvre une gamme. Survolez ou touchez pour la mettre sous tension.</p>
        </div>

        <div className="reveal grid items-stretch gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Enclosure */}
          <div className="relative flex flex-col justify-center rounded-[28px] border border-[#d6d9e1] bg-[linear-gradient(180deg,#fbfbfd,#eceef3)] p-5 shadow-[0_40px_80px_-50px_rgba(11,24,56,0.6)] sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-mp-muted">Tableau MERPORT · TGBT</span>
              <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-mp-ink">
                <span className="size-2 rounded-full bg-green-500 shadow-[0_0_0_4px_rgba(34,197,94,0.2)]" /> Sous tension
              </span>
            </div>

            {/* DIN rail */}
            <div className="relative">
              <span className="absolute inset-x-[-12px] top-1/2 h-7 -translate-y-1/2 rounded-sm bg-[linear-gradient(180deg,#c7cbd3,#eef0f4_40%,#aeb3bd)] shadow-inner" />
              <div className="relative grid grid-cols-4 gap-2.5 sm:gap-3 md:grid-cols-8">
                {categories.map((c, i) => (
                  <Breaker key={c.slug} index={i} on={i === active} label={c.name} onSelect={() => setActive(i)} />
                ))}
              </div>
            </div>

            {/* Printed label (like a label-maker strip on a real panel) */}
            <div className="mt-8 flex items-center gap-3 rounded-lg border border-dashed border-[#c9cdd6] bg-white px-4 py-3">
              <span className="rounded bg-mp-red px-2 py-0.5 font-mono text-[0.7rem] text-white">Q{pad(active + 1)}</span>
              <span key={current.slug} className="truncate font-mono text-[0.82rem] uppercase tracking-[0.12em] text-mp-ink animate-fade-up">
                {current.name}
              </span>
            </div>
            <p className="m-0 mt-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-mp-muted">
              {categories.length} départs · 1 seul fournisseur
            </p>
          </div>

          {/* Live panel */}
          <Link
            to="/produits/$category"
            params={{ category: current.slug }}
            className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-[28px] bg-mp-navy p-7 text-white sm:p-9"
          >
            {categories.map((c, i) => (
              <img
                key={c.slug}
                src={c.image}
                alt=""
                width={1200}
                height={1200}
                loading="lazy"
                className={cx(
                  "absolute inset-0 size-full object-cover transition duration-700 ease-out-expo",
                  i === active ? "scale-100 opacity-100" : "scale-110 opacity-0",
                )}
              />
            ))}
            <span className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,17,42,0.95)_0%,rgba(8,17,42,0.35)_55%,rgba(8,17,42,0.1)_100%)]" />
            <span className="absolute left-7 top-7 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-white/70">
              Circuit {pad(active + 1)} / {pad(categories.length)}
            </span>
            <div className="relative" key={current.slug}>
              <h3 className="m-0 text-[clamp(1.7rem,2.6vw,2.4rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-white animate-fade-up">
                {current.name}
              </h3>
              <p className="mt-3 max-w-[40ch] text-white/75 animate-fade-up [animation-delay:80ms]">{current.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-mp-red px-5 py-3 text-[0.92rem] font-semibold transition-all group-hover:gap-3 animate-fade-up [animation-delay:160ms]">
                Voir la gamme <ArrowUpRight size={16} />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* =================================================================== */
/* 4. FIGURES — meter readings (odometer)                               */
/* =================================================================== */

function OdometerDigit({ char, run, delay }: { char: string; run: boolean; delay: number }) {
  if (!/\d/.test(char)) return <span className="px-0.5">{char}</span>;
  const d = Number(char);
  return (
    <span className="relative inline-block h-[1em] w-[0.68em] overflow-hidden rounded-[4px] bg-black/60 text-center leading-none">
      <span
        className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-[1600ms] ease-out-expo"
        style={{ transform: `translateY(-${run ? d * 10 : 0}%)`, transitionDelay: `${delay}ms` }}
      >
        {Array.from({ length: 10 }, (_, k) => (
          <span key={k} className="block h-[1em]">
            {k}
          </span>
        ))}
      </span>
    </span>
  );
}

function MeterReadings() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const readings = [
    { value: "1988", unit: "AN", label: "Création à Casablanca" },
    { value: pad(categories.length), unit: "FAM", label: "Familles de produits" },
    { value: pad(brands.length), unit: "MRQ", label: "Marques distribuées" },
    { value: "24", unit: "H", label: "Pour recevoir votre devis" },
  ];
  const model = [
    { icon: Ship, text: "Import direct auprès des fabricants" },
    { icon: Warehouse, text: "Stock à Aïn Sebaâ, Casablanca" },
    { icon: ShieldCheck, text: "Conseil technique avant chaque commande" },
  ];

  return (
    <section className="relative overflow-hidden bg-mp-navy py-20 text-white md:py-[120px]">
      <div className="container">
        <div className="reveal mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Label light>Relevé de compteur</Label>
            <h2 className={cx(sectionTitle, "text-white")}>
              Les chiffres, <span className="text-mp-red">sans arrondi.</span>
            </h2>
          </div>
          <p className="m-0 max-w-[38ch] text-white/65">
            Un importateur-distributeur depuis 1988 : on achète en direct, on stocke à Casablanca, on livre les pros.
          </p>
        </div>

        <div ref={ref} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {readings.map((r, idx) => (
            <div
              key={r.label}
              className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,#e9ebf0,#cfd3db)] p-3 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]"
            >
              <div className="rounded-[14px] bg-[#0d1220] p-5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
                <div className="flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.16em] text-white/40">
                  <span>MP-{pad(idx + 1)}</span>
                  <span className="inline-flex items-center gap-1.5">
                    <i className={cx("size-1.5 rounded-full", inView ? "bg-mp-red animate-ping-soft" : "bg-white/20")} /> imp/kWh
                  </span>
                </div>
                <div className="mt-4 flex items-end gap-2">
                  <span className="flex gap-1 font-mono text-[clamp(2.6rem,4vw,3.4rem)] font-medium text-[#f4f6fb]">
                    {r.value.split("").map((ch, k) => (
                      <OdometerDigit key={k} char={ch} run={inView} delay={idx * 180 + k * 90} />
                    ))}
                  </span>
                  <span className="mb-1 font-mono text-[0.8rem] text-mp-red">{r.unit}</span>
                </div>
              </div>
              <p className="m-0 px-2 pb-1 pt-3 text-[0.9rem] font-semibold text-mp-ink">{r.label}</p>
            </div>
          ))}
        </div>

        <ul className="reveal m-0 mt-14 flex list-none flex-col gap-4 border-t border-white/15 p-0 pt-8 md:flex-row md:gap-10">
          {model.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-white/85">
              <Icon size={18} className="shrink-0 text-[#ff6b72]" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* =================================================================== */
/* 5. SECTORS — single-line diagram                                     */
/* =================================================================== */

const SECTOR_ICONS = [Factory, Building2, Wrench, Zap, Warehouse];

function SingleLineDiagram() {
  const [active, setActive] = useState(0);
  const n = sectors.length;
  const pos = (i: number) => ((i + 0.5) / n) * 100;
  const a = pos(active);
  const current = sectors[active] ?? sectors[0];
  if (!current) return null;

  return (
    <section className="bg-white py-20 md:py-[120px]">
      <div className="container">
        <div className="reveal mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Label>Secteurs · schéma unifilaire</Label>
            <h2 className={cx(sectionTitle, "text-mp-ink")}>
              Une seule source, <span className="text-mp-red">tous vos chantiers.</span>
            </h2>
          </div>
          <Link to="/secteurs" className="inline-flex h-12 items-center gap-2 rounded-full border-[1.5px] border-mp-ink px-[22px] font-semibold text-mp-ink transition hover:bg-mp-ink hover:text-white">
            Tous les secteurs <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Desktop diagram */}
        <div className="reveal relative hidden md:block">
          {/* Source */}
          <div className="relative z-[1] mx-auto flex w-fit items-center gap-3 rounded-2xl bg-mp-ink px-5 py-3.5 text-white shadow-[0_20px_40px_-20px_rgba(11,24,56,0.7)]">
            <Power size={18} className="text-mp-red" />
            <span className="font-mono text-[0.78rem] uppercase tracking-[0.14em]">Source · MERPORT Casablanca</span>
          </div>

          <div className="relative h-[86px]">
            {/* feeder */}
            <span className="absolute left-1/2 top-0 h-[60px] w-[3px] -translate-x-1/2 current-y animate-flow-y" />
            {/* busbar (idle) */}
            <span className="absolute top-[58px] h-[3px] bg-mp-line" style={{ left: `${pos(0)}%`, right: `${100 - pos(n - 1)}%` }} />
            {/* busbar (live segment) */}
            <span
              className="absolute top-[58px] h-[3px] current-x animate-flow-x transition-all duration-500 ease-out-expo"
              style={{ left: `${Math.min(50, a)}%`, width: `${Math.abs(a - 50)}%` }}
            />
            {/* drops */}
            {sectors.map((s, i) => (
              <span
                key={s.slug}
                className={cx("absolute top-[58px] h-[28px] w-[3px] -translate-x-1/2", i === active ? "current-y animate-flow-y" : "bg-mp-line")}
                style={{ left: `${pos(i)}%` }}
              />
            ))}
          </div>

          {/* Loads */}
          <div className="grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0,1fr))` }}>
            {sectors.map((s, i) => {
              const Icon = SECTOR_ICONS[i % SECTOR_ICONS.length] ?? Factory;
              const on = i === active;
              return (
                <button
                  key={s.slug}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={on}
                  className="group flex cursor-pointer flex-col items-center gap-3 px-2 text-center"
                >
                  <span
                    className={cx(
                      "grid size-16 place-items-center rounded-full border-2 transition duration-300",
                      on ? "border-mp-red bg-mp-red text-white shadow-[0_0_0_10px_rgba(215,31,43,0.12)]" : "border-mp-line bg-white text-mp-muted group-hover:border-mp-ink",
                    )}
                  >
                    <Icon size={24} />
                  </span>
                  <span className="font-mono text-[0.68rem] text-mp-muted">Q{pad(i + 1)}</span>
                  <span className={cx("text-[1rem] font-bold leading-tight", on ? "text-mp-ink" : "text-mp-muted")}>{s.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile diagram */}
        <div className="relative pl-6 md:hidden">
          <span className="absolute bottom-6 left-[11px] top-2 w-[3px] current-y animate-flow-y" />
          <div className="relative -ml-6 mb-5 flex w-fit items-center gap-2.5 rounded-xl bg-mp-ink px-4 py-3 text-white">
            <Power size={16} className="text-mp-red" />
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em]">Source · MERPORT</span>
          </div>
          <div className="grid gap-3">
            {sectors.map((s, i) => {
              const Icon = SECTOR_ICONS[i % SECTOR_ICONS.length] ?? Factory;
              const on = i === active;
              return (
                <button key={s.slug} type="button" onClick={() => setActive(i)} aria-pressed={on} className="relative flex cursor-pointer items-center gap-3 text-left">
                  <span className={cx("absolute -left-[13px] top-1/2 h-[3px] w-4", on ? "current-x animate-flow-x" : "bg-mp-line")} />
                  <span className={cx("grid size-11 shrink-0 place-items-center rounded-full border-2", on ? "border-mp-red bg-mp-red text-white" : "border-mp-line bg-white text-mp-muted")}>
                    <Icon size={18} />
                  </span>
                  <span className={cx("font-bold", on ? "text-mp-ink" : "text-mp-muted")}>{s.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live load detail */}
        <Link
          to="/secteurs"
          hash={current.slug}
          className="group mt-10 grid overflow-hidden rounded-[24px] border border-mp-line bg-mp-paper transition hover:border-mp-ink md:mt-14 md:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto">
            <img key={current.slug} src={current.image} alt={current.imageAlt} width={1200} height={1200} loading="lazy" className="absolute inset-0 size-full object-cover animate-fade-up" />
          </div>
          <div className="flex flex-col justify-center p-7 md:p-10" key={`t-${current.slug}`}>
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-mp-red">Départ Q{pad(active + 1)} · sous tension</span>
            <h3 className="m-0 mt-3 text-[clamp(1.6rem,2.6vw,2.3rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-mp-ink animate-fade-up">{current.name}</h3>
            <p className="mt-3 max-w-[46ch] text-mp-muted animate-fade-up [animation-delay:80ms]">{current.summary}</p>
            <span className="mt-6 inline-flex w-fit items-center gap-2 font-semibold text-mp-ink transition-all group-hover:gap-3">
              Voir le secteur <ArrowRight size={16} className="text-mp-red" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}

/* =================================================================== */
/* 6. PROCESS — paste your list, get a structured quote request         */
/* =================================================================== */

const SAMPLE_LIST = `Câble U-1000 R2V 3G2,5 — 250 m
H07V-U 1,5 mm² bleu x 10 rouleaux
Chemin de câbles perforé 200x50 : 40 m
Disjoncteur 1P+N 16A x 24
Réglette LED étanche IP65 - 60`;

type Line = { label: string; qty: string; unit: string };

function parseList(text: string): Line[] {
  const unitRe = "(m|ml|mètres?|metres?|rouleaux?|tourets?|pcs?|pièces?|u|unités?)";
  const re = new RegExp(`(?:x\\s*)?(\\d+(?:[.,]\\d+)?)\\s*${unitRe}?\\s*$`, "i");
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const m = l.match(re);
      if (!m || m.index === undefined) return { label: l, qty: "—", unit: "" };
      const label = l.slice(0, m.index).replace(/[\s:—–\-x×]+$/i, "").trim() || l;
      const raw = (m[2] || "u").toLowerCase();
      const unit = /^(m|ml|m[eè]tre)/.test(raw) ? "m" : /^roul/.test(raw) ? "rouleau(x)" : /^tour/.test(raw) ? "touret(s)" : "u";
      return { label, qty: m[1] ?? "—", unit };
    });
}

function PasteYourList() {
  const [text, setText] = useState(SAMPLE_LIST);
  const [lines, setLines] = useState<Line[] | null>(null);
  const [runId, setRunId] = useState(0);

  const analyse = () => {
    setLines(parseList(text));
    setRunId((n) => n + 1);
  };

  const keep = () => {
    try {
      sessionStorage.setItem("merport-quote-list", text);
    } catch {
      /* storage unavailable */
    }
  };

  const steps = [
    ["Collez", "Votre liste telle quelle : bordereau, mail, notes de chantier."],
    ["Vérifiez", "Chaque ligne est structurée : désignation, quantité, unité."],
    ["Envoyez", "Un commercial chiffre et confirme disponibilités et délais."],
  ];

  return (
    <section className="bg-mp-paper bg-blueprint py-20 md:py-[120px]">
      <div className="container grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="reveal">
          <Label>Comment ça marche</Label>
          <h2 className={cx(sectionTitle, "text-mp-ink")}>
            Votre liste devient <span className="text-mp-red">un devis.</span>
          </h2>
          <ol className="m-0 mt-10 list-none space-y-6 p-0">
            {steps.map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[52px_1fr] items-start gap-4">
                <span className="font-mono text-[2rem] font-medium leading-none text-mp-red">{pad(i + 1)}</span>
                <span>
                  <strong className="block text-[1.15rem] font-bold text-mp-ink">{t}</strong>
                  <span className="text-mp-muted">{d}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Widget */}
        <div className="reveal overflow-hidden rounded-[24px] bg-mp-ink text-white shadow-[0_50px_90px_-50px_rgba(11,24,56,0.8)]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
            <span className="flex gap-1.5">
              <i className="size-2.5 rounded-full bg-mp-red" />
              <i className="size-2.5 rounded-full bg-white/25" />
              <i className="size-2.5 rounded-full bg-white/25" />
            </span>
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-white/50">merport · demande-de-devis</span>
          </div>

          <div className="grid md:grid-cols-2">
            <div className="border-b border-white/10 p-5 md:border-b-0 md:border-r">
              <label htmlFor="paste-list" className="mb-2 flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/55">
                <ClipboardPaste size={14} /> Votre liste
              </label>
              <textarea
                id="paste-list"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={9}
                spellCheck={false}
                className="w-full resize-none rounded-xl border border-white/10 bg-black/30 p-3.5 font-mono text-[0.8rem] leading-[1.7] text-white/90 outline-none transition focus:border-white/40"
              />
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={analyse} className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-mp-red font-semibold transition hover:bg-mp-red-dark">
                  Structurer ma liste <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setText("");
                    setLines(null);
                  }}
                  className="h-11 cursor-pointer rounded-full border border-white/20 px-4 text-[0.88rem] text-white/75 transition hover:border-white/50"
                >
                  Effacer
                </button>
              </div>
            </div>

            <div className="flex flex-col p-5">
              <span className="mb-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/55">Demande structurée</span>
              {lines ? (
                <div className="flex-1" key={runId}>
                  <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 border-b border-white/10 pb-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-white/40">
                    <span>Désignation</span>
                    <span className="text-right">Qté</span>
                    <span>Unité</span>
                  </div>
                  <ul className="m-0 list-none p-0">
                    {lines.map((l, i) => (
                      <li
                        key={i}
                        className="grid grid-cols-[1fr_auto_auto] items-baseline gap-x-3 border-b border-white/5 py-2.5 text-[0.86rem] animate-fade-up"
                        style={{ animationDelay: `${i * 90}ms` }}
                      >
                        <span className="min-w-0 truncate text-white/90">{l.label}</span>
                        <span className="text-right font-mono text-[#ff6b72]">{l.qty}</span>
                        <span className="w-[78px] whitespace-nowrap font-mono text-[0.7rem] text-white/50">{l.unit}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/devis"
                    onClick={keep}
                    className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white font-semibold text-mp-ink transition hover:gap-3"
                  >
                    Envoyer pour devis ({lines.length} lignes) <ArrowRight size={16} />
                  </a>
                </div>
              ) : (
                <div className="grid flex-1 place-items-center rounded-xl border border-dashed border-white/15 p-6 text-center text-[0.9rem] text-white/45">
                  Cliquez sur « Structurer ma liste » pour voir votre demande prête à envoyer.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =================================================================== */
/* 7. EXPORT — split-flap departures board                              */
/* =================================================================== */

const FLAP_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·/";

function useSplitFlap(target: string, run: boolean, delay = 0) {
  const [shown, setShown] = useState(() => target.replace(/[^ ]/g, " "));
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(target);
      return;
    }
    let frame = 0;
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      timer = setInterval(() => {
        frame++;
        setShown(
          target
            .split("")
            .map((ch, i) => (ch === " " || frame > i * 1.4 + 6 ? ch : FLAP_CHARS[Math.floor(Math.random() * FLAP_CHARS.length)]))
            .join(""),
        );
        if (frame > target.length * 1.4 + 8 && timer) clearInterval(timer);
      }, 40);
    }, delay);
    return () => {
      clearTimeout(start);
      if (timer) clearInterval(timer);
    };
  }, [target, run, delay]);
  return shown;
}

function FlapText({ text, run, delay, className }: { text: string; run: boolean; delay: number; className?: string }) {
  const shown = useSplitFlap(text, run, delay);
  return (
    <span className={cx("flex flex-nowrap gap-[2px]", className)} aria-label={text}>
      {shown.split("").map((ch, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cx(
            "relative inline-grid h-[1.8em] w-[1.05em] shrink-0 place-items-center rounded-[3px] font-mono",
            ch === " " ? "bg-transparent" : "bg-[#141a2b] shadow-[inset_0_-1px_0_rgba(255,255,255,0.06)] after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-black/60 after:content-['']",
          )}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

function DeparturesBoard() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const rows = [
    { dest: "MAROC", mode: "Livraison chantier", status: "SUR DEMANDE" },
    { dest: "AFRIQUE OUEST", mode: "Groupage / conteneur", status: "SUR DEVIS" },
    { dest: "AFRIQUE CENTRALE", mode: "Groupage / conteneur", status: "SUR DEVIS" },
  ];

  return (
    <section className="relative overflow-hidden bg-mp-night py-20 text-white md:py-[120px]">
      <div className="container grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="reveal">
          <Label light>Import · Export</Label>
          <h2 className={cx(sectionTitle, "text-white")}>
            Départ Casablanca, <span className="text-mp-red">destination vos chantiers.</span>
          </h2>
          <p className="mt-6 max-w-[44ch] text-[1.06rem] leading-[1.65] text-white/70">
            Basés près du port de Casablanca, nous livrons partout au Maroc et accompagnons vos projets à l’export vers
            l’Afrique de l’Ouest et centrale : préparation, colisage et documents.
          </p>
          <Link to="/contact" className={cx(btnRed, "mt-9")}>
            Parler d’un projet export <ArrowRight size={16} />
          </Link>
        </div>

        <div ref={ref} className="reveal overflow-x-auto rounded-[22px] border border-white/10 bg-[#0a0f1d] p-4 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)] sm:p-6">
          <div className="mb-4 flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.18em]">
            <span className="text-[#ffb547]">Départs · Casablanca</span>
            <span className="inline-flex items-center gap-2 text-white/50">
              <i className="size-1.5 rounded-full bg-[#ffb547] animate-ping-soft" /> En service
            </span>
          </div>
          <div className="sm:min-w-[660px]">
            <div className="hidden grid-cols-[260px_1fr_200px] gap-5 border-b border-white/10 pb-2 sm:grid font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white/40">
              <span>Destination</span>
              <span>Mode</span>
              <span>Statut</span>
            </div>
            {rows.map((r, i) => (
              <div key={r.dest} className="flex flex-col gap-2 border-b border-white/5 py-4 sm:grid sm:grid-cols-[260px_1fr_200px] sm:items-center sm:gap-5">
                <FlapText text={r.dest} run={inView} delay={i * 350} className="text-[0.8rem] text-[#ffd27a]" />
                <span className="font-mono text-[0.74rem] uppercase tracking-[0.1em] text-white/70">{r.mode}</span>
                <FlapText text={r.status} run={inView} delay={i * 350 + 250} className="text-[0.8rem] text-[#7ee2a8]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =================================================================== */
/* 8. FINAL CTA — the big switch                                        */
/* =================================================================== */

function SwitchCta() {
  const [on, setOn] = useState(false);
  return (
    <section
      className={cx(
        "relative isolate overflow-hidden py-20 text-white transition-colors duration-700 md:py-[130px]",
        on ? "bg-mp-red" : "bg-mp-night",
      )}
    >
      <div
        aria-hidden="true"
        className={cx(
          "pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-700",
          "bg-[radial-gradient(circle,rgba(255,255,255,0.35),transparent_60%)]",
          on ? "opacity-100" : "opacity-0",
        )}
      />
      <div className="container flex flex-col items-center text-center">
        <Label light className={on ? "!text-white" : ""}>
          Demande de devis
        </Label>
        <h2 className="m-0 max-w-[16ch] text-[clamp(2.6rem,6vw,5.4rem)] font-extrabold leading-[0.98] tracking-[-0.045em] text-white">
          {on ? "C’est parti. Envoyez-nous votre liste." : "Prêt à mettre votre projet sous tension ?"}
        </h2>

        {/* Rocker switch */}
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label="Mettre sous tension"
          onClick={() => setOn((v) => !v)}
          className="group mt-12 cursor-pointer rounded-[34px] bg-[linear-gradient(180deg,#f4f5f8,#c9cdd6)] p-3 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] transition-transform hover:scale-[1.02]"
        >
          <span className="relative block h-[170px] w-[112px] overflow-hidden rounded-[24px] bg-[#1b1e25] shadow-[inset_0_4px_14px_rgba(0,0,0,0.7)]">
            <span
              className={cx(
                "absolute inset-x-2 flex h-[78px] items-center justify-center rounded-[18px] font-mono text-[1.6rem] font-bold transition-all duration-500 ease-out-expo",
                on
                  ? "top-2 bg-[linear-gradient(180deg,#ff5a62,#b3161f)] text-white shadow-[0_0_30px_rgba(255,77,85,0.8)]"
                  : "top-[84px] bg-[linear-gradient(180deg,#eef0f4,#a9aeb9)] text-mp-ink",
              )}
            >
              {on ? "I" : "O"}
            </span>
          </span>
        </button>
        <span className={cx("mt-4 font-mono text-[0.72rem] uppercase tracking-[0.16em]", on ? "text-white" : "text-white/50")}>
          {on ? "Sous tension" : "Appuyez sur l’interrupteur"}
        </span>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/devis" className={on ? btnDark : btnRed}>
            Demander un devis <ArrowRight size={16} />
          </Link>
          <a href={`https://wa.me/${site.whatsappDigits}`} target="_blank" rel="noreferrer" className={btnGhost}>
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