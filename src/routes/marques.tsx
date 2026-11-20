import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, ChevronRight, Search } from "lucide-react";
import { brands } from "@/data/brands";
import { categories, categoryBySlug } from "@/data/categories";
import { products } from "@/data/products";
import { seo } from "@/lib/seo";
// Tailwind tokens/utilities: src/home.css

export const Route = createFileRoute("/marques")({
  head: () =>
    seo({
      title: "Nos marques",
      description:
        "Les fabricants que MERPORT importe en direct : câbles, raccordement, appareillage, éclairage, automatisme et coffrets.",
    }),
  component: BrandsPage,
});

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
const pad = (n: number) => String(n).padStart(2, "0");
const productCount = (name: string) => products.filter((p) => p.brand === name).length;
const productImage = (p: (typeof products)[number]) => ("image" in p && typeof p.image === "string" ? p.image : undefined);

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

const sectionTitle =
  "m-0 max-w-[18ch] text-[clamp(2rem,4.2vw,3.6rem)] font-extrabold leading-[1.02] tracking-[-0.035em]";

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function BrandsPage() {
  const [active, setActive] = useState(0);
  return (
    <div className="marques overflow-x-clip">
      <BrandsHero active={active} onSelect={setActive} />
      <Datasheet active={active} onSelect={setActive} />
      <CoverageMatrix onSelect={setActive} />
      <SourcingBox />
    </div>
  );
}

/* =================================================================== */
/* 1. HERO — brand tags hanging from a cable                            */
/* =================================================================== */

function BrandsHero({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const covered = new Set(brands.flatMap((b) => b.families)).size;
  const total = products.filter((p) => brands.some((b) => b.name === p.brand)).length;
  const stats = [
    { value: pad(brands.length), label: "Marques partenaires" },
    { value: pad(covered), label: "Familles couvertes" },
    { value: pad(total), label: "Produits au catalogue" },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-mp-navy bg-blueprint-dark text-white">
      <div className="pointer-events-none absolute -left-40 -top-40 -z-10 size-[620px] rounded-full bg-[radial-gradient(circle,rgba(215,31,43,0.2),transparent_65%)]" />

      <div className="container pt-10 lg:pt-14">
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
              Marques
            </li>
          </ol>
        </nav>

        <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Label light className="animate-fade-up [animation-delay:80ms]">
              Marques
            </Label>
            <h1 className="m-0 text-[clamp(2.6rem,5.8vw,5.4rem)] font-extrabold leading-[0.95] tracking-[-0.045em] text-white">
              <span className="block animate-fade-up [animation-delay:160ms]">Des fabricants choisis,</span>
              <span className="block text-[#ff4d55] animate-fade-up [animation-delay:260ms]">importés en direct.</span>
            </h1>
          </div>
          <div className="animate-fade-up [animation-delay:360ms]">
            <p className="m-0 max-w-[46ch] text-[1.06rem] leading-relaxed text-white/75">
              Nous travaillons sans intermédiaire avec des fabricants reconnus. Une marque recherchée n’apparaît pas ? Nous
              pouvons la sourcer pour vous.
            </p>
            <dl className="m-0 mt-8 grid grid-cols-3 gap-4 border-t border-white/15 pt-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <dd className="m-0 font-mono text-[1.9rem] font-medium leading-none text-white">{s.value}</dd>
                  <dt className="mt-2 text-[0.74rem] leading-snug text-white/55 sm:text-[0.8rem]">{s.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Hanging tags */}
      <div className="relative mt-14 pb-14 lg:mt-16 lg:pb-20" aria-label="Choisir une marque">
        {/* the cable */}
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-3 bg-cable shadow-[0_10px_20px_-10px_rgba(0,0,0,0.8)]" />
        <div className="container">
          <ul className="m-0 flex list-none gap-3 overflow-x-auto p-0 pb-2 pt-1 [scrollbar-width:none] md:grid md:overflow-visible" style={{ gridTemplateColumns: `repeat(${brands.length}, minmax(0, 1fr))` }}>
            {brands.map((b, i) => {
              const on = i === active;
              return (
                <li key={b.name} className="flex shrink-0 flex-col items-center">
                  {/* tie */}
                  <span aria-hidden="true" className={cx("h-8 w-[2px] transition-colors", on ? "bg-mp-red" : "bg-white/30")} />
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      onSelect(i);
                      document.getElementById("fiche")?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    onMouseEnter={() => onSelect(i)}
                    className={cx(
                      "group relative w-[150px] origin-top cursor-pointer rounded-[10px] px-4 pb-4 pt-6 text-left transition duration-500 ease-out-expo md:w-full",
                      on
                        ? "rotate-0 bg-white text-mp-ink shadow-[0_24px_40px_-20px_rgba(0,0,0,0.8)]"
                        : cx("bg-[#152049] text-white hover:bg-[#1b2a5c]", i % 2 ? "rotate-[3deg]" : "-rotate-[3deg]"),
                    )}
                  >
                    {/* eyelet */}
                    <span aria-hidden="true" className={cx("absolute left-1/2 top-2 size-2.5 -translate-x-1/2 rounded-full border-2", on ? "border-mp-red" : "border-white/40")} />
                    <span className={cx("block font-mono text-[0.66rem]", on ? "text-mp-red" : "text-white/45")}>{pad(i + 1)}</span>
                    <span className="mt-1 block text-[1.05rem] font-extrabold leading-tight tracking-[-0.02em]">{b.name}</span>
                    <span className={cx("mt-1 block truncate text-[0.76rem]", on ? "text-mp-muted" : "text-white/55")}>{b.specialty}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* =================================================================== */
/* 2. DATASHEET — technical sheet of the selected brand                 */
/* =================================================================== */

function Datasheet({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const brand = brands[active] ?? brands[0];
  if (!brand) return null;
  const count = productCount(brand.name);
  const sample = products.filter((p) => p.brand === brand.name).slice(0, 3);

  return (
    <section id="fiche" className="scroll-mt-[calc(var(--header-h,72px)+16px)] bg-mp-paper bg-blueprint py-20 md:py-[110px]">
      <div className="container">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Label>Fiche fabricant</Label>
            <h2 className={cx(sectionTitle, "text-mp-ink")}>
              Une marque, <span className="text-mp-red">une fiche claire.</span>
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Marque précédente"
              onClick={() => onSelect((active - 1 + brands.length) % brands.length)}
              className="grid size-12 cursor-pointer place-items-center rounded-full border-[1.5px] border-mp-ink text-mp-ink transition hover:bg-mp-ink hover:text-white"
            >
              <ArrowRight size={18} className="rotate-180" />
            </button>
            <button
              type="button"
              aria-label="Marque suivante"
              onClick={() => onSelect((active + 1) % brands.length)}
              className="grid size-12 cursor-pointer place-items-center rounded-full bg-mp-ink text-white transition hover:bg-black"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <article key={brand.name} className="overflow-hidden rounded-[26px] border border-mp-line bg-white shadow-[0_40px_80px_-50px_rgba(11,24,56,0.55)] animate-fade-up [animation-duration:600ms]">
          {/* Title block, like the cartouche of a technical drawing */}
          <header className="grid border-b-2 border-mp-ink md:grid-cols-[1fr_auto_auto]">
            <div className="p-6 sm:p-8">
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-mp-muted">
                Fabricant {pad(active + 1)} / {pad(brands.length)}
              </span>
              <h3 className="m-0 mt-2 text-[clamp(2.4rem,5vw,4.4rem)] font-extrabold leading-none tracking-[-0.045em] text-mp-ink">
                {brand.name}
                <span className="text-mp-red">.</span>
              </h3>
              <p className="m-0 mt-3 font-semibold text-mp-red">{brand.specialty}</p>
            </div>
            <div className="grid grid-cols-2 border-t border-mp-line md:grid-cols-1 md:border-l md:border-t-0">
              <div className="border-r border-mp-line p-5 md:border-b md:border-r-0">
                <span className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-mp-muted">Origine</span>
                <p className="m-0 mt-1 font-semibold text-mp-ink">{brand.origin || "—"}</p>
              </div>
              <div className="p-5">
                <span className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-mp-muted">Au catalogue</span>
                <p className="m-0 mt-1 font-mono text-[1.4rem] text-mp-ink">{pad(count)}</p>
              </div>
            </div>
            <div className="hidden place-items-center border-l border-mp-line bg-mp-ink px-8 md:grid">
              <span className="text-[4rem] font-extrabold leading-none tracking-[-0.05em] text-outline [--outline:rgba(255,255,255,0.6)]">{pad(active + 1)}</span>
            </div>
          </header>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-6 sm:p-8">
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-mp-muted">Présentation</span>
              <p className="m-0 mt-3 max-w-[56ch] text-[1.06rem] leading-relaxed text-mp-ink">{brand.description}</p>

              <span className="mt-8 block font-mono text-[0.68rem] uppercase tracking-[0.16em] text-mp-muted">Familles couvertes</span>
              <ul className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0">
                {brand.families.map((slug) => {
                  const cat = categoryBySlug(slug);
                  if (!cat) return null;
                  return (
                    <li key={slug}>
                      <Link
                        to="/produits/$category"
                        params={{ category: cat.slug }}
                        className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-mp-line py-1.5 pl-1.5 pr-3.5 text-[0.88rem] font-semibold text-mp-ink transition hover:border-mp-ink"
                      >
                        <img src={cat.image} alt="" width={60} height={60} loading="lazy" className="size-7 rounded-full object-cover" />
                        {cat.shortName}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <Link
                to="/produits"
                search={{ marque: brand.name }}
                className="mt-9 inline-flex h-[52px] items-center gap-2 rounded-full bg-mp-red px-7 font-semibold text-white shadow-[0_8px_20px_-10px_rgba(215,31,43,0.8)] transition hover:-translate-y-px hover:bg-mp-red-dark"
              >
                Voir les {count} produit{count > 1 ? "s" : ""}<span className="max-sm:hidden"> {brand.name}</span> <ArrowUpRight size={16} />
              </Link>
            </div>

            {/* Sample references */}
            <div className="border-t border-mp-line bg-mp-paper/60 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-mp-muted">Exemples de références</span>
              {sample.length ? (
                <ul className="m-0 mt-4 grid list-none gap-3 p-0">
                  {sample.map((p) => (
                    <li key={p.slug} className="flex items-center gap-4 rounded-2xl border border-mp-line bg-white p-3">
                      {productImage(p) && <img src={productImage(p)} alt="" width={120} height={120} loading="lazy" className="size-14 shrink-0 rounded-xl bg-mp-paper object-contain" />}
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-mp-ink">{p.name}</span>
                        <span className="block truncate font-mono text-[0.74rem] text-mp-muted">{p.reference}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="m-0 mt-4 rounded-2xl border border-dashed border-[#c9cdd6] p-5 text-[0.94rem] text-mp-muted">
                  Gamme disponible sur demande. Envoyez-nous vos références.
                </p>
              )}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

/* =================================================================== */
/* 3. COVERAGE MATRIX — brands × families, like a wiring matrix         */
/* =================================================================== */

function CoverageMatrix({ onSelect }: { onSelect: (i: number) => void }) {
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null);

  return (
    <section className="bg-white py-20 md:py-[110px]">
      <div className="container">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Label>Matrice de couverture</Label>
            <h2 className={cx(sectionTitle, "text-mp-ink")}>
              Qui couvre quoi, <span className="text-mp-red">en un coup d’œil.</span>
            </h2>
          </div>
          <p className="m-0 max-w-[36ch] text-mp-muted">Chaque point est une connexion entre une marque et une famille. Survolez pour suivre la ligne.</p>
        </div>

        <div className="overflow-x-auto rounded-[22px] border border-mp-line">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="bg-mp-paper">
                <th scope="col" className="sticky left-0 z-[1] bg-mp-paper px-5 py-4 font-mono text-[0.66rem] font-medium uppercase tracking-[0.16em] text-mp-muted">
                  Marque ↓ / Famille →
                </th>
                {categories.map((c, ci) => (
                  <th
                    key={c.slug}
                    scope="col"
                    className={cx("px-2 py-4 text-center text-[0.76rem] font-semibold leading-tight transition-colors", hover?.c === ci ? "text-mp-red" : "text-mp-ink")}
                  >
                    {c.shortName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {brands.map((b, ri) => (
                <tr key={b.name} className={cx("border-t border-mp-line transition-colors", hover?.r === ri && "bg-mp-red/[0.04]")}>
                  <th scope="row" className="sticky left-0 z-[1] bg-white px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(ri);
                        document.getElementById("fiche")?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className={cx("cursor-pointer text-left font-bold transition-colors hover:text-mp-red", hover?.r === ri ? "text-mp-red" : "text-mp-ink")}
                    >
                      <span className="mr-2 font-mono text-[0.68rem] font-normal text-mp-muted">{pad(ri + 1)}</span>
                      {b.name}
                    </button>
                  </th>
                  {categories.map((c, ci) => {
                    const on = b.families.includes(c.slug);
                    const lit = hover && (hover.r === ri || hover.c === ci);
                    return (
                      <td
                        key={c.slug}
                        onMouseEnter={() => setHover({ r: ri, c: ci })}
                        onMouseLeave={() => setHover(null)}
                        className={cx("relative px-2 py-3.5 text-center", hover?.c === ci && "bg-mp-red/[0.04]")}
                      >
                        {/* grid wires */}
                        <span aria-hidden="true" className={cx("absolute inset-x-0 top-1/2 h-px -translate-y-1/2", lit && hover?.r === ri ? "bg-mp-red/40" : "bg-mp-line")} />
                        <span aria-hidden="true" className={cx("absolute inset-y-0 left-1/2 w-px -translate-x-1/2", lit && hover?.c === ci ? "bg-mp-red/40" : "bg-mp-line")} />
                        {on ? (
                          <span
                            className={cx(
                              "relative inline-block size-3.5 rounded-full border-2 border-white transition-transform",
                              hover?.r === ri && hover?.c === ci ? "scale-150 bg-mp-red shadow-[0_0_0_6px_rgba(215,31,43,0.18)]" : "bg-mp-ink",
                            )}
                            title={`${b.name} · ${c.name}`}
                          />
                        ) : (
                          <span className="relative inline-block size-1.5 rounded-full bg-white" />
                        )}
                        <span className="sr-only">{on ? "Oui" : "Non"}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* =================================================================== */
/* 4. SOURCING — look for another brand / equivalent reference          */
/* =================================================================== */

function SourcingBox() {
  const [ref, setRef] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = ref.trim();
    window.location.assign(q ? `/devis?ref=${encodeURIComponent(q)}` : "/devis");
  };

  return (
    <section className="relative isolate overflow-hidden bg-mp-night py-20 text-white md:py-[110px]">
      <span aria-hidden="true" className="pointer-events-none absolute -right-10 top-1/2 -z-10 -translate-y-1/2 select-none text-[clamp(14rem,30vw,26rem)] font-extrabold leading-none text-outline [--outline:rgba(255,255,255,0.07)]">
        ?
      </span>
      <div className="container grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
        <div>
          <Label light>Sourcing</Label>
          <h2 className={cx(sectionTitle, "text-white")}>
            Une autre marque, <span className="text-mp-red">une référence équivalente ?</span>
          </h2>
          <p className="m-0 mt-6 max-w-[46ch] text-[1.04rem] leading-relaxed text-white/70">
            Donnez-nous la marque et la référence recherchées : nous la chiffrons, ou nous vous proposons un équivalent adapté à
            votre usage.
          </p>
        </div>

        <form onSubmit={submit} className="rounded-[26px] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <label htmlFor="sourcing-ref" className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-white/55">
            Marque et référence recherchées
          </label>
          <div className="mt-3 flex items-center gap-3 rounded-full border border-white/20 bg-black/20 py-[7px] pl-5 pr-[7px] transition focus-within:border-white/60">
            <Search size={18} className="shrink-0 text-white/50" aria-hidden="true" />
            <input
              id="sourcing-ref"
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              placeholder="Ex. disjoncteur 4P 63 A, câble R2V 4G10…"
              autoComplete="off"
              className="min-w-0 flex-1 border-0 bg-transparent text-white outline-none placeholder:text-white/40"
            />
            <button type="submit" aria-label="Envoyer la référence" className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full bg-mp-red transition hover:bg-mp-red-dark">
              <ArrowRight size={18} />
            </button>
          </div>
          <ul className="m-0 mt-6 grid list-none gap-3 p-0 text-[0.92rem] text-white/75">
            {["La référence est reprise dans votre demande de devis", "Chiffrage ou équivalent proposé sous 24 h ouvrées", "Aucun engagement de votre part"].map((t, i) => (
              <li key={t} className="flex items-center gap-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/10 font-mono text-[0.66rem] text-[#ff8a8f]">{pad(i + 1)}</span>
                {t}
              </li>
            ))}
          </ul>
        </form>
      </div>
    </section>
  );
}