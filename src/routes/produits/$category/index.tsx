import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { categories, categoryBySlug } from "@/data/categories";
import { productsInCategory } from "@/data/products";
import { seo } from "@/lib/seo";
import { Label, ProductBrowser, cx, pad, type BrowserFilters } from "@/components/merport/catalog";
// Tailwind tokens/utilities: src/home.css

const str = (value: unknown) => (typeof value === "string" && value.trim() ? value.slice(0, 120) : undefined);

export const Route = createFileRoute("/produits/$category/")({
  validateSearch: (search: Record<string, unknown>): Omit<BrowserFilters, "famille"> => ({
    q: str(search["q"]),
    marque: str(search["marque"]),
  }),
  loader: ({ params }) => {
    const category = categoryBySlug(params.category);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) =>
    loaderData
      ? seo({ title: `${loaderData.category.name} — catalogue`, description: loaderData.category.intro })
      : seo({ title: "Famille introuvable", description: "Cette famille de produits n’existe pas.", noindex: true }),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const filters = Route.useSearch();
  const navigate = Route.useNavigate();
  const list = productsInCategory(category.slug);
  const index = Math.max(0, categories.findIndex((item) => item.slug === category.slug));
  const prev = categories[(index - 1 + categories.length) % categories.length];
  const next = categories[(index + 1) % categories.length];
  const brands = [...new Set(list.map((item) => item.brand))];

  const stats = [
    { value: pad(list.length), label: "Références en ligne" },
    { value: pad(brands.length), label: `Marque${brands.length > 1 ? "s" : ""}` },
    { value: "Sur devis", label: "Prix selon quantités" },
  ];

  return (
    <div className="famille overflow-x-clip">
      {/* ============================ HERO ============================ */}
      <section className="relative isolate overflow-hidden bg-mp-navy bg-blueprint-dark text-white">
        <div className="pointer-events-none absolute -left-40 -top-40 -z-10 size-[620px] rounded-full bg-[radial-gradient(circle,rgba(215,31,43,0.2),transparent_65%)]" />
        <div className="container pb-14 pt-10 lg:pb-20 lg:pt-14">
          <nav aria-label="Fil d’Ariane" className="mb-10 animate-fade-up">
            <ol className="m-0 flex list-none flex-wrap items-center gap-1.5 p-0 text-[0.84rem] text-white/60">
              <li>
                <Link to="/" className="transition-colors hover:text-white">
                  Accueil
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={14} />
              </li>
              <li>
                <Link to="/produits" className="transition-colors hover:text-white">
                  Produits
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={14} />
              </li>
              <li aria-current="page" className="text-white">
                {category.name}
              </li>
            </ol>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <div key={category.slug}>
              <Label light className="animate-fade-up [animation-delay:80ms]">
                Famille {pad(index + 1)} / {pad(categories.length)}
              </Label>
              <h1 className="m-0 text-[clamp(2.6rem,5.6vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.045em] text-white animate-fade-up [animation-delay:160ms]">
                {category.name}
                <span className="text-[#ff4d55]">.</span>
              </h1>
              <p className="m-0 mt-7 max-w-[54ch] text-[1.06rem] leading-relaxed text-white/75 animate-fade-up [animation-delay:260ms]">{category.intro}</p>

              <dl className="m-0 mt-9 grid max-w-[560px] grid-cols-3 gap-4 border-t border-white/15 pt-6 animate-fade-up [animation-delay:340ms]">
                {stats.map((s) => (
                  <div key={s.label}>
                    <dd className="m-0 font-mono text-[clamp(1.3rem,2.6vw,2rem)] font-medium leading-none text-white">{s.value}</dd>
                    <dt className="mt-2 text-[0.76rem] text-white/55 sm:text-[0.8rem]">{s.label}</dt>
                  </div>
                ))}
              </dl>

              {brands.length > 0 && (
                <div className="mt-7 flex flex-wrap items-center gap-2 animate-fade-up [animation-delay:420ms]">
                  <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/45">Marques :</span>
                  {brands.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => {
                        navigate({ search: (p) => ({ ...p, marque: p.marque === b ? undefined : b }), replace: true, resetScroll: false });
                        document.getElementById("references")?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className={cx(
                        "cursor-pointer rounded-full border px-3 py-1 text-[0.8rem] font-semibold transition",
                        filters.marque === b ? "border-mp-red bg-mp-red text-white" : "border-white/20 bg-white/5 text-white/85 hover:border-white/60",
                      )}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer pulled out of the cabinet */}
            <figure key={`img-${category.slug}`} className="relative m-0 animate-fade-up [animation-delay:200ms]">
              <div className="relative overflow-hidden rounded-[26px] border border-white/10">
                <img
                  src={category.image}
                  alt={category.imageAlt}
                  width={1200}
                  height={1200}
                  fetchPriority="high"
                  decoding="async"
                  className="aspect-[5/4] w-full object-cover"
                />
                <span className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,17,42,0.55)_0%,transparent_45%)]" />
                <span aria-hidden="true" className="absolute left-5 top-5 size-8 border-2 border-b-0 border-r-0 border-mp-red" />
                <span aria-hidden="true" className="absolute right-6 top-4 text-[clamp(3.5rem,7vw,5.5rem)] font-extrabold leading-none tracking-[-0.05em] text-outline [--outline:rgba(255,255,255,0.75)]">
                  {pad(index + 1)}
                </span>
              </div>
              {/* drawer front + label holder */}
              <div className="relative mx-6 -mt-6 rounded-[18px] bg-[linear-gradient(180deg,#eef0f4,#d6dae2)] px-5 pb-4 pt-4 text-center shadow-[0_24px_40px_-20px_rgba(0,0,0,0.8)]">
                <span className="mx-auto block max-w-[320px] rounded-md border border-[#b9bec9] bg-white px-3 py-1.5 shadow-inner">
                  <span className="block font-mono text-[0.64rem] text-mp-red">
                    {pad(index + 1)} · {pad(list.length)} réf.
                  </span>
                  <span className="block truncate text-[0.95rem] font-bold text-mp-ink">{category.shortName}</span>
                </span>
                <span className="mx-auto mt-3 block h-2 w-20 rounded-full bg-mp-red shadow-[0_0_12px_rgba(215,31,43,0.6)]" />
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* ======================= FAMILY SWITCHER ====================== */}
      <nav aria-label="Autres familles" className="sticky top-[var(--header-h,72px)] z-30 border-b border-mp-line bg-white/90 backdrop-blur-xl">
        <div className="container flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
          {categories.map((item, i) => {
            const on = item.slug === category.slug;
            return (
              <Link
                key={item.slug}
                to="/produits/$category"
                params={{ category: item.slug }}
                aria-current={on ? "page" : undefined}
                className={cx(
                  "inline-flex shrink-0 items-center gap-2 rounded-full border-[1.5px] py-1 pl-1 pr-3.5 text-[0.84rem] font-semibold transition",
                  on ? "border-mp-ink bg-mp-ink text-white" : "border-mp-line text-mp-ink hover:border-mp-ink",
                )}
              >
                <img src={item.image} alt="" width={64} height={64} loading="lazy" decoding="async" className="size-7 rounded-full object-cover" />
                <span className={cx("font-mono text-[0.64rem]", on ? "text-[#ff8a8f]" : "text-mp-muted")}>{pad(i + 1)}</span>
                {item.shortName}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ========================== BROWSER =========================== */}
      <section id="references" className="scroll-mt-[calc(var(--header-h,72px)+64px)] bg-mp-paper bg-blueprint py-12 md:py-16">
        <div className="container">
          <ProductBrowser
            key={category.slug}
            products={list}
            filters={filters}
            onChange={({ famille: _ignored, ...patch }) => navigate({ search: (p) => ({ ...p, ...patch }), replace: true, resetScroll: false })}
          />
        </div>
      </section>

      {/* ======================== PREV / NEXT ========================= */}
      {prev && next && (
        <section className="bg-white py-12 md:py-16">
          <div className="container grid gap-3 md:grid-cols-2">
            {[
              { item: prev, dir: "prev" as const, i: (index - 1 + categories.length) % categories.length },
              { item: next, dir: "next" as const, i: (index + 1) % categories.length },
            ].map(({ item, dir, i }) => (
              <Link
                key={dir}
                to="/produits/$category"
                params={{ category: item.slug }}
                className={cx(
                  "group relative flex items-center gap-5 overflow-hidden rounded-[22px] border border-mp-line bg-white p-4 transition hover:border-mp-ink hover:shadow-[0_30px_60px_-40px_rgba(11,24,56,0.6)]",
                  dir === "next" && "md:flex-row-reverse md:text-right",
                )}
              >
                <img src={item.image} alt="" width={240} height={240} loading="lazy" className="size-20 shrink-0 rounded-2xl object-cover sm:size-24" />
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[0.68rem] uppercase tracking-[0.16em] text-mp-muted">
                    {dir === "prev" ? "Famille précédente" : "Famille suivante"} · {pad(i + 1)}
                  </span>
                  <span className="mt-1 block truncate text-[1.25rem] font-extrabold tracking-[-0.02em] text-mp-ink">{item.name}</span>
                </span>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-mp-paper text-mp-ink transition group-hover:bg-mp-red group-hover:text-white">
                  {dir === "prev" ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}