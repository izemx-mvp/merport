import { useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Check, LayoutGrid, List, Minus, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import { categories, categoryBySlug } from "@/data/categories";
import type { products as allProducts } from "@/data/products";
import { addToQuote } from "@/components/merport/quote-actions";
// Shared catalogue UI (Tailwind): product tile, quantity stepper, product browser.
// Used by /produits, /produits/$category and /produits/$category/$product.

export type Product = (typeof allProducts)[number];

export type BrowserFilters = {
  q?: string | undefined;
  marque?: string | undefined;
  famille?: string | undefined;
};

export const pad = (n: number) => String(n).padStart(2, "0");
export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export function Label({ children, light, className }: { children: ReactNode; light?: boolean; className?: string }) {
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

/* ------------------------------------------------------------------ */
/* Quantity stepper                                                    */
/* ------------------------------------------------------------------ */

export function QtyStepper({
  value,
  onChange,
  size = "lg",
}: {
  value: number;
  onChange: (v: number) => void;
  size?: "sm" | "lg";
}) {
  const clamp = (v: number) => Math.max(1, Math.min(999, Math.round(v) || 1));
  const h = size === "lg" ? "h-[52px]" : "h-10";
  const w = size === "lg" ? "w-11" : "w-9";
  return (
    <div className={cx("inline-flex items-center overflow-hidden rounded-full border-[1.5px] border-mp-line bg-white", h)}>
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= 1}
        aria-label="Diminuer la quantité"
        className={cx("grid h-full cursor-pointer place-items-center text-mp-ink transition hover:text-mp-red disabled:cursor-not-allowed disabled:opacity-30", w)}
      >
        <Minus size={14} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={999}
        value={value}
        onChange={(e) => onChange(clamp(Number(e.target.value)))}
        aria-label="Quantité"
        className="h-full w-12 border-0 bg-transparent text-center font-mono text-[0.95rem] text-mp-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= 999}
        aria-label="Augmenter la quantité"
        className={cx("grid h-full cursor-pointer place-items-center text-mp-ink transition hover:text-mp-red disabled:cursor-not-allowed disabled:opacity-30", w)}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Add-to-quote button (shows a check for a moment)                    */
/* ------------------------------------------------------------------ */

function AddButton({ product, compact }: { product: Product; compact?: boolean }) {
  const [added, setAdded] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        addToQuote(product, 1);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1800);
      }}
      aria-label={`Ajouter ${product.name} au devis`}
      className={cx(
        "inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full border-[1.5px] font-semibold transition",
        compact ? "size-10" : "size-10 text-[0.84rem] sm:h-10 sm:w-auto sm:px-4",
        added ? "border-green-600 bg-green-600 text-white" : "border-mp-ink bg-white text-mp-ink hover:border-mp-red hover:bg-mp-red hover:text-white",
      )}
    >
      {added ? <Check size={16} /> : <Plus size={16} />}
      {!compact && <span className="hidden sm:inline">{added ? "Ajouté" : "Devis"}</span>}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Product tile (grid)                                                 */
/* ------------------------------------------------------------------ */

export function ProductTile({ product, index }: { product: Product; index?: number }) {
  const category = categoryBySlug(product.category);
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[22px] border border-mp-line bg-white transition duration-300 hover:-translate-y-1 hover:border-mp-ink hover:shadow-[0_30px_60px_-35px_rgba(11,24,56,0.55)]">
      <Link
        to="/produits/$category/$product"
        params={{ category: product.category, product: product.slug }}
        className="relative block aspect-square overflow-hidden bg-[linear-gradient(180deg,#f3f4f7,#e7e9ef)]"
      >
        <span aria-hidden="true" className="absolute inset-0 bg-blueprint opacity-70" />
        <img
          src={product.image}
          alt={`${product.name}, ${product.brand}`}
          width={1200}
          height={1200}
          loading="lazy"
          decoding="async"
          className="relative size-full object-contain p-4 transition duration-500 ease-out-expo group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2 py-1 font-mono text-[0.64rem] text-mp-ink backdrop-blur">
          {typeof index === "number" ? pad(index + 1) : product.brand}
        </span>
        <span className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-mp-ink text-white opacity-0 transition group-hover:opacity-100">
          <ArrowUpRight size={16} />
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <span className="font-mono text-[0.64rem] uppercase tracking-[0.12em] text-mp-muted">
          {category?.shortName} <span className="text-mp-red">·</span> {product.brand}
        </span>
        <Link
          to="/produits/$category/$product"
          params={{ category: product.category, product: product.slug }}
          className="mt-1.5 line-clamp-2 text-[1rem] font-bold leading-snug text-mp-ink transition-colors hover:text-mp-red"
        >
          {product.name}
        </Link>
        <span className="mt-1 font-mono text-[0.74rem] text-mp-muted">Réf. {product.reference}</span>
        <ul className="m-0 mt-3 flex list-none flex-wrap gap-1.5 p-0">
          {[product.section, product.voltage].filter((v) => v && v !== "—").map((v) => (
            <li key={v} className="rounded-md border border-mp-line bg-mp-paper px-2 py-0.5 font-mono text-[0.68rem] text-mp-ink">
              {v}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="whitespace-nowrap font-mono text-[0.72rem] font-medium uppercase tracking-[0.08em] text-mp-red">Sur devis</span>
          <AddButton product={product} />
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Product row (list / "bordereau" view)                               */
/* ------------------------------------------------------------------ */

function ProductRow({ product }: { product: Product }) {
  return (
    <li className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-4 border-t border-mp-line px-4 py-3 transition-colors hover:bg-mp-paper/70 md:grid-cols-[56px_150px_minmax(0,1fr)_130px_110px_auto]">
      <img src={product.image} alt="" width={120} height={120} loading="lazy" className="size-14 rounded-xl bg-mp-paper object-contain p-1" />
      <span className="hidden font-mono text-[0.78rem] text-mp-ink md:block">{product.reference}</span>
      <Link
        to="/produits/$category/$product"
        params={{ category: product.category, product: product.slug }}
        className="min-w-0 font-semibold text-mp-ink transition-colors hover:text-mp-red"
      >
        <span className="block truncate">{product.name}</span>
        <span className="block truncate font-mono text-[0.72rem] font-normal text-mp-muted md:hidden">
          {product.reference} · {product.brand}
        </span>
      </Link>
      <span className="hidden truncate text-[0.88rem] text-mp-muted md:block">{product.brand}</span>
      <span className="hidden truncate font-mono text-[0.76rem] text-mp-ink md:block">{product.section}</span>
      <AddButton product={product} compact />
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Product browser                                                     */
/* ------------------------------------------------------------------ */

type Sort = "pertinence" | "nom" | "reference";
const PAGE = 12;

export function ProductBrowser({
  products,
  filters,
  onChange,
  showCategoryFilter,
}: {
  products: readonly Product[];
  filters: BrowserFilters;
  onChange: (patch: BrowserFilters) => void;
  showCategoryFilter?: boolean;
}) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<Sort>("pertinence");
  const [limit, setLimit] = useState(PAGE);
  const [panelOpen, setPanelOpen] = useState(false);

  const brands = useMemo(() => [...new Set(products.map((p) => p.brand))].sort(), [products]);

  const results = useMemo(() => {
    const q = norm(filters.q ?? "");
    const words = q.split(/\s+/).filter(Boolean);
    let list = products.filter((p) => {
      if (filters.marque && p.brand !== filters.marque) return false;
      if (filters.famille && p.category !== filters.famille) return false;
      if (!words.length) return true;
      const hay = norm([p.name, p.reference, p.brand, p.section, p.voltage, p.description].join(" "));
      return words.every((w) => hay.includes(w));
    });
    if (sort === "nom") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "fr"));
    if (sort === "reference") list = [...list].sort((a, b) => a.reference.localeCompare(b.reference, "fr"));
    return list;
  }, [products, filters, sort]);

  const set = (patch: BrowserFilters) => {
    setLimit(PAGE);
    onChange(patch);
  };
  const active = [
    filters.q && { key: "q" as const, label: `« ${filters.q} »` },
    filters.marque && { key: "marque" as const, label: filters.marque },
    filters.famille && { key: "famille" as const, label: categoryBySlug(filters.famille)?.shortName ?? filters.famille },
  ].filter(Boolean) as { key: keyof BrowserFilters; label: string }[];

  const chip = (on: boolean) =>
    cx(
      "flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-[0.9rem] font-medium transition",
      on ? "bg-mp-ink text-white" : "text-mp-ink hover:bg-mp-paper",
    );

  const panel = (
    <div className="grid gap-7">
      {showCategoryFilter && (
        <div>
          <span className="mb-2 block font-mono text-[0.66rem] uppercase tracking-[0.16em] text-mp-muted">Familles</span>
          <div className="grid gap-0.5">
            <button type="button" onClick={() => set({ famille: undefined })} className={chip(!filters.famille)}>
              Toutes <span className="font-mono text-[0.72rem] opacity-60">{pad(products.length)}</span>
            </button>
            {categories.map((c) => {
              const n = products.filter((p) => p.category === c.slug).length;
              if (!n) return null;
              return (
                <button key={c.slug} type="button" onClick={() => set({ famille: c.slug })} className={chip(filters.famille === c.slug)}>
                  <span className="truncate">{c.shortName}</span>
                  <span className="font-mono text-[0.72rem] opacity-60">{pad(n)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div>
        <span className="mb-2 block font-mono text-[0.66rem] uppercase tracking-[0.16em] text-mp-muted">Marques</span>
        <div className="flex flex-wrap gap-2">
          {brands.map((b) => {
            const on = filters.marque === b;
            return (
              <button
                key={b}
                type="button"
                aria-pressed={on}
                onClick={() => set({ marque: on ? undefined : b })}
                className={cx(
                  "cursor-pointer rounded-full border-[1.5px] px-3 py-1.5 text-[0.82rem] font-semibold transition",
                  on ? "border-mp-red bg-mp-red text-white" : "border-mp-line text-mp-ink hover:border-mp-ink",
                )}
              >
                {b}
              </button>
            );
          })}
        </div>
      </div>
      <Link
        to="/devis"
        className="flex items-center justify-between gap-3 rounded-2xl bg-mp-navy p-4 text-[0.88rem] text-white/80 transition hover:bg-mp-ink"
      >
        <span>
          <strong className="block text-white">Référence introuvable ?</strong>
          Envoyez votre liste, on chiffre.
        </span>
        <ArrowRight size={16} className="shrink-0 text-[#ff6b72]" />
      </Link>
    </div>
  );

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
      {/* Filters — desktop */}
      <aside className="sticky top-[calc(var(--header-h,72px)+24px)] hidden rounded-[22px] border border-mp-line bg-white p-5 lg:block">{panel}</aside>

      <div>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-0 flex-1 basis-[260px] items-center gap-3 rounded-full border-[1.5px] border-mp-line bg-white py-1.5 pl-4 pr-1.5 transition focus-within:border-mp-ink">
            <Search size={17} className="shrink-0 text-mp-muted" aria-hidden="true" />
            <label htmlFor="catalog-search" className="sr-only">
              Rechercher dans le catalogue
            </label>
            <input
              id="catalog-search"
              value={filters.q ?? ""}
              onChange={(e) => set({ q: e.target.value || undefined })}
              placeholder="Référence, désignation, section…"
              autoComplete="off"
              className="h-9 min-w-0 flex-1 border-0 bg-transparent text-[0.95rem] text-mp-ink outline-none placeholder:text-mp-muted/70"
            />
            {filters.q && (
              <button type="button" aria-label="Effacer la recherche" onClick={() => set({ q: undefined })} className="grid size-8 cursor-pointer place-items-center rounded-full text-mp-muted hover:bg-mp-paper">
                <X size={15} />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setPanelOpen((v) => !v)}
            aria-expanded={panelOpen}
            className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-mp-line bg-white px-4 font-semibold text-mp-ink lg:hidden"
          >
            <SlidersHorizontal size={16} /> Filtres
          </button>
          <label className="sr-only" htmlFor="catalog-sort">
            Trier
          </label>
          <select
            id="catalog-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="h-12 cursor-pointer rounded-full border-[1.5px] border-mp-line bg-white px-4 text-[0.9rem] font-semibold text-mp-ink outline-none"
          >
            <option value="pertinence">Pertinence</option>
            <option value="nom">Nom (A–Z)</option>
            <option value="reference">Référence</option>
          </select>
          <div className="inline-flex h-12 rounded-full border-[1.5px] border-mp-line bg-white p-1" role="group" aria-label="Affichage">
            {(["grid", "list"] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                aria-label={v === "grid" ? "Vue grille" : "Vue liste"}
                onClick={() => setView(v)}
                className={cx("grid w-10 cursor-pointer place-items-center rounded-full transition", view === v ? "bg-mp-ink text-white" : "text-mp-muted")}
              >
                {v === "grid" ? <LayoutGrid size={16} /> : <List size={16} />}
              </button>
            ))}
          </div>
        </div>

        {/* Filters — mobile */}
        {panelOpen && <div className="mt-4 rounded-[22px] border border-mp-line bg-white p-5 lg:hidden">{panel}</div>}

        {/* Status line */}
        <div className="mb-5 mt-5 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-lg bg-mp-ink px-3 py-1.5 font-mono text-[0.78rem] text-white">
            <span className="size-1.5 rounded-full bg-mp-red" /> {pad(results.length)} référence{results.length > 1 ? "s" : ""}
          </span>
          {active.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => set({ [f.key]: undefined })}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-mp-line bg-white py-1 pl-3 pr-2 text-[0.82rem] text-mp-ink transition hover:border-mp-red"
            >
              {f.label} <X size={13} className="text-mp-muted" />
            </button>
          ))}
          {active.length > 1 && (
            <button type="button" onClick={() => set({ q: undefined, marque: undefined, famille: undefined })} className="cursor-pointer text-[0.82rem] font-semibold text-mp-red underline underline-offset-2">
              Tout effacer
            </button>
          )}
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div className="flex flex-col items-center rounded-[22px] border-2 border-dashed border-[#c9cdd6] bg-white px-6 py-14 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-mp-paper text-mp-muted">
              <Search size={22} />
            </span>
            <p className="m-0 mt-5 text-[1.2rem] font-bold text-mp-ink">Aucune référence en ligne pour cette recherche.</p>
            <p className="m-0 mt-2 max-w-[44ch] text-mp-muted">
              Notre catalogue en ligne n’est qu’une sélection : envoyez-nous la référence, nous la chiffrons ou proposons un équivalent.
            </p>
            <a
              href={filters.q ? `/devis?ref=${encodeURIComponent(filters.q)}` : "/devis"}
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-mp-red px-6 font-semibold text-white transition hover:bg-mp-red-dark"
            >
              Demander cette référence <ArrowRight size={16} />
            </a>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
            {results.slice(0, limit).map((p, i) => (
              <ProductTile key={p.slug} product={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-[22px] border border-mp-line bg-white">
            <div className="hidden grid-cols-[56px_150px_minmax(0,1fr)_130px_110px_40px] gap-4 bg-mp-ink px-4 py-2.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-white/60 md:grid">
              <span />
              <span>Référence</span>
              <span>Désignation</span>
              <span>Marque</span>
              <span>Section</span>
              <span />
            </div>
            <ul className="m-0 list-none p-0">
              {results.slice(0, limit).map((p) => (
                <ProductRow key={p.slug} product={p} />
              ))}
            </ul>
          </div>
        )}

        {results.length > limit && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <span className="font-mono text-[0.74rem] text-mp-muted">
              {pad(Math.min(limit, results.length))} / {pad(results.length)} affichées
            </span>
            <div className="h-1 w-48 overflow-hidden rounded-full bg-mp-line">
              <div className="h-full bg-mp-red" style={{ width: `${(limit / results.length) * 100}%` }} />
            </div>
            <button
              type="button"
              onClick={() => setLimit((l) => l + PAGE)}
              className="mt-2 inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-mp-ink px-6 font-semibold text-mp-ink transition hover:bg-mp-ink hover:text-white"
            >
              Afficher plus <Plus size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}