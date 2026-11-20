import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, ChevronRight, MapPin } from "lucide-react";
import { seo } from "@/lib/seo";
import { site } from "@/config/site";
import { categories } from "@/data/categories";
// Tailwind tokens/utilities: src/home.css (bg-mp-*, text-outline, current-x/y, animate-*)

export const Route = createFileRoute("/a-propos")({
  head: () =>
    seo({
      title: "À propos",
      description:
        "MERPORT SARL, importateur et distributeur de matériel électrique à Casablanca depuis 1988 : import direct, stock à Aïn Sebaâ, livraison au Maroc et accompagnement à l’export.",
    }),
  component: AboutPage,
});

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const pad = (n: number) => String(n).padStart(2, "0");
const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

const btn =
  "inline-flex min-h-[52px] items-center justify-center gap-2 whitespace-nowrap rounded-full px-[26px] font-semibold transition";
const btnRed = `${btn} bg-mp-red text-white shadow-[0_8px_20px_-10px_rgba(215,31,43,0.8)] hover:-translate-y-px hover:bg-mp-red-dark`;
const btnOutline = `${btn} border-[1.5px] border-mp-ink text-mp-ink hover:bg-mp-ink hover:text-white`;
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

/** Adds `is-in` to every `.reveal` element of this page once it enters the viewport. */
function useReveal(scope: string) {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(`${scope} .reveal`);
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
  }, [scope]);
}

/** 0 → 1 progress of an element through the viewport (never goes back down). */
function useScrollProgress<T extends HTMLElement>(start = 0.85, length = 0.6) {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh * start - rect.top) / (rect.height * length + vh * 0.25);
      setProgress((prev) => Math.max(prev, Math.min(1, Math.max(0, p))));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [start, length]);
  return { ref, progress };
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const figures = [
  { value: "1988", label: "Année de création" },
  { value: pad(categories.length), label: "Familles de produits" },
  { value: "01", label: "Entrepôt à Aïn Sebaâ" },
  { value: "24 h", label: "Pour répondre à un devis" },
];

const milestones = [
  { mark: "1988", title: "Création à Casablanca", text: "MERPORT SARL naît à Casablanca avec un métier : importer du matériel électrique pour les professionnels." },
  { mark: "Au fil des ans", title: "Un catalogue complet", text: `Des câbles à l’outillage, le catalogue s’étend jusqu’à ${categories.length} familles de produits.` },
  { mark: "Aujourd’hui", title: "Stock et livraison", text: "Un entrepôt à Aïn Sebaâ, des livraisons partout au Maroc et un conseil technique avant chaque commande." },
  { mark: "Cap Afrique", title: "L’export en ligne de mire", text: "Accompagner le développement des infrastructures électriques en Afrique, depuis Casablanca." },
];

const layers = [
  {
    key: "core",
    name: "L’âme",
    title: "Le bon matériel",
    text: "Câbles, appareillage, éclairage, automatisme : des produits de marques reconnues, achetés en direct auprès des fabricants.",
  },
  {
    key: "insulation",
    name: "L’isolant",
    title: "Le conseil technique",
    text: "Section, norme, usage, environnement : on vérifie avec vous avant de chiffrer, pour éviter les mauvaises surprises sur chantier.",
  },
  {
    key: "sheath",
    name: "La gaine",
    title: "La logistique",
    text: "Stock à Aïn Sebaâ, préparation, livraison au Maroc et accompagnement à l’export : tout ce qui protège votre délai.",
  },
] as const;

const values = [
  { letter: "D", word: "Direct", color: "bg-mp-red text-white", text: "Nous achetons à la source. Moins d’intermédiaires, c’est plus de clarté sur les prix et sur l’origine du matériel." },
  { letter: "F", word: "Fiable", color: "bg-[#e4c51c] text-mp-ink", text: "Ce que nous annonçons, nous le livrons : références, quantités et délais confirmés avant la commande." },
  { letter: "P", word: "Proche", color: "bg-[#2f6fd6] text-white", text: "Une équipe à Casablanca qui décroche le téléphone, connaît vos chantiers et parle votre langage technique." },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function AboutPage() {
  useReveal(".about");
  return (
    <div className="about overflow-x-clip">
      <AboutHero />
      <CableTimeline />
      <TradeLayers />
      <ValueMarkers />
      <CompanyRecord />
    </div>
  );
}

/* =================================================================== */
/* 1. HERO — warehouse + spinning drum label                            */
/* =================================================================== */

function DrumLabel() {
  const text = "MERPORT · IMPORTATEUR · DISTRIBUTEUR · CASABLANCA · DEPUIS 1988 · ";
  return (
    <div className="relative size-[150px] sm:size-[176px]" aria-hidden="true">
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full animate-[spin_28s_linear_infinite]">
        <defs>
          <path id="about-drum-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <circle cx="100" cy="100" r="98" fill="#0b1838" />
        <circle cx="100" cy="100" r="98" fill="none" stroke="rgba(255,255,255,0.18)" />
        <text fontFamily="var(--font-mono)" fontSize="11.5" letterSpacing="2.6" fill="rgba(255,255,255,0.85)">
          <textPath href="#about-drum-circle">{text}</textPath>
        </text>
      </svg>
      <div className="absolute inset-[30%] grid place-items-center rounded-full bg-mp-red text-white shadow-[0_0_0_6px_rgba(215,31,43,0.2)]">
        <span className="text-[1.6rem] font-extrabold leading-none tracking-[-0.04em] sm:text-[2rem]">88</span>
      </div>
    </div>
  );
}

function AboutHero() {
  return (
    <section className="relative isolate overflow-hidden bg-mp-navy bg-blueprint-dark text-white">
      <div className="pointer-events-none absolute -left-40 -top-40 -z-10 size-[620px] rounded-full bg-[radial-gradient(circle,rgba(215,31,43,0.2),transparent_65%)]" />

      <div className="container grid items-center gap-12 pb-16 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24 lg:pt-14">
        <div>
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
                À propos
              </li>
            </ol>
          </nav>

          <Label light className="animate-fade-up [animation-delay:80ms]">
            À propos de MERPORT
          </Label>
          <h1 className="m-0 text-[clamp(2.6rem,5.8vw,5.6rem)] font-extrabold leading-[0.95] tracking-[-0.045em] text-white">
            <span className="block animate-fade-up [animation-delay:160ms]">Importateur</span>
            <span className="block animate-fade-up [animation-delay:260ms]">de matériel électrique</span>
            <span className="block text-[#ff4d55] animate-fade-up [animation-delay:360ms]">depuis 1988.</span>
          </h1>
          <p className="mt-8 max-w-[52ch] text-[1.08rem] leading-relaxed text-white/75 animate-fade-up [animation-delay:460ms]">
            MERPORT SARL importe, stocke et distribue du matériel électrique professionnel depuis Casablanca. Notre métier :
            mettre le bon matériel, au juste prix, entre les mains de ceux qui construisent.
          </p>
        </div>

        <figure className="relative m-0 animate-fade-up [animation-delay:240ms]">
          <div className="relative overflow-hidden rounded-[28px]">
            <img
              src="/images/about-warehouse.webp"
              alt="Entrepôt MERPORT à Casablanca : rayonnages de tourets de câbles et de matériel électrique"
              width={1000}
              height={1241}
              fetchPriority="high"
              decoding="async"
              className="aspect-[4/5] w-full object-cover sm:aspect-[5/5] lg:aspect-[4/5]"
            />
            <span className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,17,42,0.7)_0%,transparent_45%)]" />
            <figcaption className="absolute right-5 top-5 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-[rgba(8,17,42,0.6)] px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-white backdrop-blur-md">
              <MapPin size={13} className="text-[#ff6b72]" /> Aïn Sebaâ · Casablanca
            </figcaption>
          </div>
          <div className="absolute -bottom-10 -left-4 sm:-left-10">
            <DrumLabel />
          </div>
        </figure>
      </div>

      {/* Figures strip */}
      <div className="border-t border-white/10 bg-[rgba(8,17,42,0.55)]">
        <dl className="container m-0 grid grid-cols-2 lg:grid-cols-4">
          {figures.map((f, i) => (
            <div
              key={f.label}
              className={cx(
                "reveal border-white/10 py-7 lg:py-9",
                i % 2 === 1 && "border-l pl-6",
                i >= 2 && "max-lg:border-t",
                i === 2 && "lg:border-l lg:pl-6",
                i > 0 && "lg:pl-8",
              )}
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <dd className="m-0 font-mono text-[clamp(2rem,3.4vw,3rem)] font-medium leading-none text-white">{f.value}</dd>
              <dt className="mt-2 text-[0.88rem] text-white/60">{f.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* =================================================================== */
/* 2. STORY — a cable unrolling from its drum                           */
/* =================================================================== */

function Drum({ turn }: { turn: number }) {
  return (
    <svg viewBox="0 0 120 120" className="size-full" aria-hidden="true">
      <g style={{ transform: `rotate(${turn}deg)`, transformOrigin: "60px 60px" }}>
        <circle cx="60" cy="60" r="58" fill="#c08a52" stroke="#8a5a2c" strokeWidth="3" />
        <circle cx="60" cy="60" r="40" fill="#14161b" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
          <circle key={k} cx="60" cy="60" r={40 - k * 3.6} fill="none" stroke="rgba(255,255,255,0.08)" />
        ))}
        <circle cx="60" cy="60" r="12" fill="#c08a52" stroke="#8a5a2c" strokeWidth="2" />
        <circle cx="60" cy="60" r="4" fill="#5b3a1b" />
        {[0, 90, 180, 270].map((a) => (
          <circle key={a} cx={60 + Math.cos((a * Math.PI) / 180) * 50} cy={60 + Math.sin((a * Math.PI) / 180) * 50} r="3" fill="#5b3a1b" />
        ))}
      </g>
    </svg>
  );
}

function CableTimeline() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>(0.85, 0.7);
  const n = milestones.length;
  const at = (i: number) => (i + 0.5) / n;

  return (
    <section className="bg-white py-20 md:py-[120px]">
      <div className="container">
        <div className="reveal mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
          <div>
            <Label>Notre histoire</Label>
            <h2 className={cx(sectionTitle, "text-mp-ink")}>
              Plus de 35 ans, <span className="text-mp-red">déroulés au mètre près.</span>
            </h2>
          </div>
          <p className="m-0 max-w-[36ch] text-mp-muted">Faites défiler : le câble se déroule depuis son touret, une étape à la fois.</p>
        </div>

        <div ref={ref} style={{ "--p": progress } as CSSProperties}>
          {/* Desktop: horizontal */}
          <div className="relative hidden md:block">
            <div className="absolute left-0 top-0 size-[120px]">
              <Drum turn={progress * 720} />
            </div>
            <div className="relative ml-[60px] pt-[54px]">
              {/* cable track */}
              <span className="absolute left-[60px] right-0 top-[54px] h-3 rounded-full bg-mp-paper" />
              <span
                className="absolute left-[60px] top-[54px] h-3 origin-left rounded-full bg-cable shadow-[0_10px_20px_-10px_rgba(11,24,56,0.6)]"
                style={{ width: `calc((100% - 60px) * ${progress})` }}
              />
              <div className="relative ml-[60px] grid pt-12" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
                {milestones.map((m, i) => {
                  const on = progress >= at(i);
                  return (
                    <div key={m.mark} className="relative pr-6">
                      <span
                        className={cx(
                          "absolute -top-[54px] left-0 h-[42px] w-[2px] transition-colors duration-500",
                          on ? "bg-mp-red" : "bg-mp-line",
                        )}
                      />
                      <span
                        className={cx(
                          "absolute -top-[62px] left-[-5px] size-3 rounded-full border-2 transition-colors duration-500",
                          on ? "border-mp-red bg-mp-red shadow-[0_0_0_6px_rgba(215,31,43,0.15)]" : "border-mp-line bg-white",
                        )}
                      />
                      <div className={cx("transition duration-700 ease-out-expo", on ? "translate-y-0 opacity-100" : "translate-y-4 opacity-30")}>
                        <span className="font-mono text-[0.8rem] uppercase tracking-[0.12em] text-mp-red">{m.mark}</span>
                        <h3 className="m-0 mt-2 text-[1.3rem] font-bold leading-tight text-mp-ink">{m.title}</h3>
                        <p className="m-0 mt-2 text-[0.95rem] leading-relaxed text-mp-muted">{m.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile: vertical */}
          <div className="relative md:hidden">
            <div className="mb-4 size-[84px]">
              <Drum turn={progress * 720} />
            </div>
            <span className="absolute bottom-0 left-[37px] top-[84px] w-2.5 rounded-full bg-mp-paper" />
            <span
              className="absolute left-[37px] top-[84px] w-2.5 rounded-full bg-cable"
              style={{ height: `calc((100% - 84px) * ${progress})` }}
            />
            <ol className="m-0 grid list-none gap-10 p-0 pl-[72px] pt-4">
              {milestones.map((m, i) => {
                const on = progress >= at(i) * 0.9;
                return (
                  <li key={m.mark} className="relative">
                    <span
                      className={cx(
                        "absolute -left-[41px] top-1 size-3 rounded-full border-2 transition-colors",
                        on ? "border-mp-red bg-mp-red" : "border-mp-line bg-white",
                      )}
                    />
                    <span className="font-mono text-[0.76rem] uppercase tracking-[0.12em] text-mp-red">{m.mark}</span>
                    <h3 className="m-0 mt-1.5 text-[1.2rem] font-bold text-mp-ink">{m.title}</h3>
                    <p className="m-0 mt-1.5 text-[0.95rem] leading-relaxed text-mp-muted">{m.text}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =================================================================== */
/* 3. OUR TRADE — layer by layer, like a cable cross-section            */
/* =================================================================== */

function LayersSvg({ active }: { active: (typeof layers)[number]["key"] }) {
  const dim = (k: string) => (active === k ? 1 : 0.7);
  return (
    <svg viewBox="-200 -200 400 400" className="h-auto w-full max-w-[460px]" aria-hidden="true">
      <defs>
        <radialGradient id="about-cu" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f4a46f" />
          <stop offset="100%" stopColor="#a8562b" />
        </radialGradient>
        <radialGradient id="about-sheath" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#3a3e48" />
          <stop offset="100%" stopColor="#0b0c10" />
        </radialGradient>
      </defs>
      <g className="transition-opacity duration-500" style={{ opacity: dim("sheath") }}>
        <circle r="190" fill="url(#about-sheath)" />
      </g>
      <g className="transition-opacity duration-500" style={{ opacity: dim("insulation") }}>
        <circle r="140" fill="#2f6fd6" />
        <circle r="140" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      </g>
      <g className="transition-opacity duration-500" style={{ opacity: dim("core") }}>
        <circle r="90" fill="url(#about-cu)" />
        {Array.from({ length: 19 }, (_, k) => {
          const ring = k === 0 ? 0 : k <= 6 ? 1 : 2;
          const idx = k === 0 ? 0 : k <= 6 ? k - 1 : k - 7;
          const count = ring === 1 ? 6 : 12;
          const r = ring * 30;
          const a = (idx / count) * Math.PI * 2;
          return <circle key={k} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r="14" fill={k % 2 ? "#d9814d" : "#efa06c"} stroke="#8c4521" strokeWidth="1.2" />;
        })}
      </g>
      {/* active ring outline */}
      <circle
        r={active === "core" ? 92 : active === "insulation" ? 142 : 192}
        fill="none"
        stroke="#d71f2b"
        strokeWidth="6"
        strokeDasharray="12 8"
        className="transition-all duration-500 ease-out-expo"
      />
    </svg>
  );
}

function TradeLayers() {
  const [active, setActive] = useState<(typeof layers)[number]["key"]>("core");
  return (
    <section className="bg-mp-paper bg-blueprint py-20 md:py-[120px]">
      <div className="container grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <div className="reveal flex justify-center">
          <LayersSvg active={active} />
        </div>

        <div className="reveal">
          <Label>Notre métier</Label>
          <h2 className={cx(sectionTitle, "text-mp-ink")}>
            Couche par couche, <span className="text-mp-red">comme un bon câble.</span>
          </h2>
          <ol className="m-0 mt-10 grid list-none gap-3 p-0">
            {layers.map((l, i) => {
              const on = active === l.key;
              return (
                <li key={l.key}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onMouseEnter={() => setActive(l.key)}
                    onFocus={() => setActive(l.key)}
                    onClick={() => setActive(l.key)}
                    className={cx(
                      "w-full cursor-pointer rounded-2xl border p-5 text-left transition duration-300 sm:p-6",
                      on ? "border-mp-ink bg-white shadow-[0_20px_40px_-25px_rgba(11,24,56,0.5)]" : "border-mp-line bg-white/60 hover:border-mp-ink/40",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className={cx("font-mono text-[0.72rem]", on ? "text-mp-red" : "text-mp-muted")}>{pad(i + 1)}</span>
                      <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-mp-muted">{l.name}</span>
                    </span>
                    <strong className="mt-2 block text-[1.35rem] font-bold text-mp-ink">{l.title}</strong>
                    <span
                      className={cx(
                        "block overflow-hidden text-[0.96rem] leading-relaxed text-mp-muted transition-all duration-500 ease-out-expo",
                        on ? "mt-2 max-h-40 opacity-100" : "max-h-0 opacity-0",
                      )}
                    >
                      {l.text}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* =================================================================== */
/* 4. VALUES — wire marker sleeves                                      */
/* =================================================================== */

function ValueMarkers() {
  return (
    <section className="bg-mp-night py-20 text-white md:py-[120px]">
      <div className="container">
        <div className="reveal mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Label light>Nos engagements</Label>
            <h2 className={cx(sectionTitle, "text-white")}>
              Trois repères, <span className="text-mp-red">sur chaque fil.</span>
            </h2>
          </div>
          <p className="m-0 max-w-[36ch] text-white/60">
            Comme les bagues de repérage sur un câblage propre : on sait toujours où l’on va.
          </p>
        </div>

        <ol className="m-0 list-none p-0">
          {values.map((v, i) => (
            <li
              key={v.word}
              className="reveal group grid items-center gap-6 border-t border-white/10 py-8 last:border-b md:grid-cols-[auto_1fr_1fr] md:gap-10 md:py-10"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* the wire with its marker */}
              <span className="relative flex h-12 w-[220px] items-center" aria-hidden="true">
                <span className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 rounded-full bg-cable" />
                <span className="absolute left-0 top-1/2 size-4 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#efa06c,#a8562b)]" />
                <span
                  className={cx(
                    "relative ml-16 grid h-12 w-14 place-items-center rounded-lg font-mono text-[1.4rem] font-bold shadow-[0_10px_20px_-10px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-out-expo group-hover:translate-x-16",
                    v.color,
                  )}
                >
                  {v.letter}
                </span>
              </span>
              <h3 className="m-0 text-[clamp(2.6rem,6vw,5rem)] font-extrabold leading-none tracking-[-0.045em] text-white">
                {v.word}
                <span className="text-mp-red">.</span>
              </h3>
              <p className="m-0 max-w-[44ch] text-[1.02rem] leading-relaxed text-white/70">{v.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* =================================================================== */
/* 5. COMPANY RECORD — official sheet with stamp                        */
/* =================================================================== */

function CompanyRecord() {
  const rows = [
    { k: "Raison sociale", v: "MERPORT SARL" },
    { k: "Activité", v: "Import et distribution de matériel électrique" },
    { k: "Siège et entrepôt", v: site.address },
    { k: "Capital", v: "2 000 000 DH" },
    { k: "RC", v: "Casablanca 53339" },
    { k: "ICE", v: "000084219000058" },
  ];
  return (
    <section className="bg-white py-20 md:py-[120px]">
      <div className="container grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="reveal">
          <Label>L’entreprise</Label>
          <h2 className={cx(sectionTitle, "text-mp-ink")}>
            Une société, <span className="text-mp-red">des interlocuteurs.</span>
          </h2>
          <p className="mt-6 max-w-[46ch] text-[1.04rem] leading-relaxed text-mp-muted">
            Passez nous voir à Aïn Sebaâ, appelez-nous ou envoyez votre liste : vous parlez à l’équipe qui prépare votre
            commande.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/contact" className={btnRed}>
              Nous contacter <ArrowRight size={16} />
            </Link>
            <Link to="/produits" className={btnOutline}>
              Voir le catalogue
            </Link>
          </div>
        </div>

        {/* The record sheet */}
        <div className="reveal relative">
          <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-1 rounded-[22px] bg-mp-paper" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[22px] border border-mp-line bg-white p-6 shadow-[0_40px_80px_-50px_rgba(11,24,56,0.6)] sm:p-9">
            <div className="flex items-start justify-between gap-4 border-b-2 border-dashed border-mp-line pb-5">
              <div>
                <span className="block pr-24 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-mp-muted sm:pr-28">Fiche entreprise · N° MP-1988</span>
                <p className="m-0 mt-1 pr-24 text-[1.6rem] font-extrabold tracking-[-0.02em] text-mp-ink">MERPORT SARL</p>
              </div>
            </div>
            <dl className="m-0 mt-2">
              {rows.map((r) => (
                <div key={r.k} className="grid gap-1 border-b border-mp-line py-3.5 last:border-b-0 sm:grid-cols-[170px_1fr] sm:gap-4">
                  <dt className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-mp-muted">{r.k}</dt>
                  <dd className="m-0 font-medium text-mp-ink">{r.v}</dd>
                </div>
              ))}
            </dl>

            {/* Stamp */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-4 flex size-[96px] -rotate-12 flex-col items-center justify-center rounded-full border-[3px] border-mp-red/70 bg-white/70 text-center font-mono text-mp-red/80 sm:right-6 sm:top-5 sm:size-[108px]"
            >
              <span className="absolute inset-[7px] rounded-full border border-mp-red/50" />
              <span className="text-[0.62rem] uppercase tracking-[0.18em]">Est.</span>
              <span className="text-[1.7rem] font-bold leading-none">1988</span>
              <span className="text-[0.56rem] uppercase tracking-[0.16em]">Casablanca</span>
            </span>
          </div>
          <Link
            to="/contact"
            className="relative mt-4 inline-flex items-center gap-2 text-[0.92rem] font-semibold text-mp-ink transition-all hover:gap-3"
          >
            Plan d’accès et horaires <ArrowUpRight size={16} className="text-mp-red" />
          </Link>
        </div>
      </div>
    </section>
  );
}