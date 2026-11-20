import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight, ChevronRight, Search } from "lucide-react";
import { categories } from "@/data/categories";
import { products, productsInCategory } from "@/data/products";
import { seo } from "@/lib/seo";
import { Label, ProductBrowser, cx, pad, type BrowserFilters } from "@/components/merport/catalog";
// Tailwind tokens/utilities: src/home.css

const str = (value: unknown) => (typeof value === "string" && value.trim() ? value.slice(0, 120) : undefined);

export const Route = createFileRoute("/produits/")({
  validateSearch: (search: Record<string, unknown>): BrowserFilters => ({
    q: str(search["q"]),
    marque: str(search["marque"]),
    famille: str(search["famille"]),
  }),
  head: () =>
    seo({
      title: "Catalogue matériel électrique",
      description:
        "Catalogue MERPORT : câbles, raccordement, cheminement, éclairage, appareillage, automatisme, comptage et outillage. Prix sur devis.",
    }),
  component: CataloguePage,
});

const QUICK = ["U-1000 R2V", "H07RN-F", "Disjoncteur", "Chemin de câbles", "LED IP65", "Presse-étoupe"];

function CataloguePage() {
  const filters = Route.useSearch();
  const navigate = Route.useNavigate();
  const update = (patch: BrowserFilters) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false });

  const toResults = () => document.getElementById("resultats")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="catalogue overflow-x-clip">
      <CatalogueHero
        query={filters.q ?? ""}
        onSearch={(q) => {
          update({ q: q || undefined });
          toResults();
        }}
      />
      <DrawerCabinet
        active={filters.famille}
        onPick={(slug) => {
          update({ famille: slug === filters.famille ? undefined : slug });
          toResults();
        }}
      />
      <section id="resultats" className="scroll-mt-[calc(var(--header-h,72px)+16px)] bg-mp-paper bg-blueprint py-14 md:py-20">
        <div className="container">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Label>Références en ligne</Label>
              <h2 className="m-0 text-[clamp(1.8rem,3.4vw,2.8rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-mp-ink">
                Cherchez, filtrez, <span className="text-mp-red">ajoutez au devis.</span>
              </h2>
            </div>
            <p className="m-0 max-w-[40ch] text-[0.94rem] text-mp-muted">
              Une sélection de nos références courantes. Les prix sont communiqués sur devis, selon vos quantités.
            </p>
          </div>
          <ProductBrowser products={products} filters={filters} showCategoryFilter onChange={update} />
        </div>
      </section>
    </div>
  );
}

/* =================================================================== */
/* 1. HERO — reference search                                          */
/* =================================================================== */

function CatalogueHero({ query, onSearch }: { query: string; onSearch: (q: string) => void }) {
  const [value, setValue] = useState(query);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };
  const stats = [
    { value: pad(categories.length), label: "Familles" },
    { value: `${products.length}+`, label: "Références en ligne" },
    { value: "24 h", label: "Réponse devis" },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-mp-navy bg-blueprint-dark text-white">
      <div className="pointer-events-none absolute -right-40 -top-40 -z-10 size-[640px] rounded-full bg-[radial-gradient(circle,rgba(215,31,43,0.22),transparent_65%)]" />
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
              Produits
            </li>
          </ol>
        </nav>

        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="min-w-0">
            <Label light className="animate-fade-up [animation-delay:80ms]">
              Catalogue
            </Label>
            <h1 className="m-0 text-[clamp(2.6rem,5.6vw,5.2rem)] font-extrabold leading-[0.95] tracking-[-0.045em] text-white">
              <span className="block animate-fade-up [animation-delay:160ms]">Le matériel électrique</span>
              <span className="block text-[#ff4d55] animate-fade-up [animation-delay:260ms]">de vos projets.</span>
            </h1>

            <form
              onSubmit={submit}
              role="search"
              className="mt-9 flex w-full max-w-[620px] items-center gap-2 rounded-full border border-white/20 bg-white/10 py-[6px] pl-4 pr-[6px] sm:gap-3 sm:py-[7px] sm:pl-5 sm:pr-[7px] backdrop-blur-md transition animate-fade-up [animation-delay:360ms] focus-within:border-white/60 focus-within:bg-white/15"
            >
              <Search size={19} className="shrink-0 text-white/60" aria-hidden="true" />
              <label htmlFor="hero-catalog-search" className="sr-only">
                Rechercher une référence
              </label>
              <input
                id="hero-catalog-search"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Référence ou désignation…"
                autoComplete="off"
                className="min-w-0 flex-1 border-0 bg-transparent text-[0.95rem] text-white sm:text-[1.02rem] outline-none placeholder:text-white/50"
              />
              <button type="submit" aria-label="Chercher" className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-mp-red px-3.5 font-semibold transition hover:bg-mp-red-dark sm:px-5">
                <span className="hidden sm:inline">Chercher</span> <ArrowRight size={16} />
              </button>
            </form>
            <div className="mt-4 flex flex-wrap items-center gap-2 animate-fade-up [animation-delay:440ms]">
              <span className="w-full font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/45 sm:w-auto">Fréquent :</span>
              {QUICK.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    setValue(q);
                    onSearch(q);
                  }}
                  className="cursor-pointer rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[0.74rem] text-white/80 transition hover:border-white/50 hover:text-white"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <dl className="m-0 grid min-w-0 grid-cols-3 gap-3 border-t border-white/15 pt-6 animate-fade-up [animation-delay:500ms] lg:grid-cols-1 lg:gap-0 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            {stats.map((s, i) => (
              <div key={s.label} className={cx(i > 0 && "lg:border-t lg:border-white/10", "lg:py-5")}>
                <dd className="m-0 whitespace-nowrap font-mono text-[clamp(1.4rem,3vw,2.6rem)] font-medium leading-none text-white">{s.value}</dd>
                <dt className="mt-2 text-[0.74rem] leading-snug text-white/55 sm:text-[0.8rem]">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* =================================================================== */
/* 2. FAMILIES — a parts cabinet with 8 drawers                         */
/* =================================================================== */

function DrawerCabinet({ active, onPick }: { active: string | undefined; onPick: (slug: string) => void }) {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="container">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Label>Parcourir par famille</Label>
            <h2 className="m-0 text-[clamp(1.8rem,3.4vw,2.8rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-mp-ink">
              Ouvrez le bon tiroir.
            </h2>
          </div>
          <p className="m-0 max-w-[36ch] text-[0.94rem] text-mp-muted">Un clic filtre les références ci-dessous. La flèche ouvre la page complète de la famille.</p>
        </div>

        {/* Cabinet */}
        <div className="rounded-[28px] bg-[linear-gradient(180deg,#1b2550,#0b1838)] p-3 shadow-[0_40px_80px_-40px_rgba(11,24,56,0.7)] sm:p-4">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
            {categories.map((c, i) => {
              const on = active === c.slug;
              const n = productsInCategory(c.slug).length;
              return (
                <div key={c.slug} className="relative">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => onPick(c.slug)}
                    className={cx(
                      "group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-[16px] border text-left transition duration-500 ease-out-expo",
                      on
                        ? "z-[1] -translate-y-1 border-mp-red bg-white shadow-[0_24px_40px_-16px_rgba(0,0,0,0.7)] sm:scale-[1.03]"
                        : "border-white/10 bg-[linear-gradient(180deg,#eef0f4,#d6dae2)] hover:-translate-y-0.5",
                    )}
                  >
                    {/* drawer content preview */}
                    <span className={cx("relative block overflow-hidden transition-[height] duration-500 ease-out-expo", on ? "h-28 sm:h-32" : "h-0")}>
                      <img src={c.image} alt="" width={600} height={600} loading="lazy" className="absolute inset-0 size-full object-cover" />
                    </span>
                    {/* front panel */}
                    <span className="relative flex flex-col items-center px-3 pb-4 pt-4 text-center">
                      {/* label holder */}
                      <span className={cx("w-full rounded-md border px-2 py-1.5", on ? "border-mp-red/40 bg-mp-red/5" : "border-[#b9bec9] bg-white shadow-inner")}>
                        <span className={cx("block font-mono text-[0.62rem]", on ? "text-mp-red" : "text-mp-muted")}>
                          {pad(i + 1)} · {pad(n)} réf.
                        </span>
                        <span className="block truncate text-[0.86rem] font-bold text-mp-ink sm:text-[0.92rem]">{c.shortName}</span>
                      </span>
                      {/* handle */}
                      <span className={cx("mt-3 h-2 w-16 rounded-full transition", on ? "bg-mp-red shadow-[0_0_12px_rgba(215,31,43,0.6)]" : "bg-[#9aa0ab] group-hover:bg-mp-ink")} />
                    </span>
                  </button>
                  <Link
                    to="/produits/$category"
                    params={{ category: c.slug }}
                    aria-label={`Voir la famille ${c.name}`}
                    className={cx(
                      "absolute bottom-2 right-2 z-[2] grid size-8 place-items-center rounded-full transition",
                      on ? "bg-mp-ink text-white" : "bg-white/80 text-mp-ink hover:bg-mp-ink hover:text-white",
                    )}
                  >
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}