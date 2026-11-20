import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronRight, Copy, FileText, Plus, Truck, Clock } from "lucide-react";
import { categoryBySlug } from "@/data/categories";
import { productBySlug, productsInCategory } from "@/data/products";
import { site } from "@/config/site";
import { seo } from "@/lib/seo";
import { addToQuote } from "@/components/merport/quote-actions";
import { WhatsAppIcon } from "@/components/merport/site-shell";
import { Label, ProductTile, QtyStepper, cx } from "@/components/merport/catalog";
// Tailwind tokens/utilities: src/home.css

export const Route = createFileRoute("/produits/$category/$product")({
  loader: ({ params }) => {
    const category = categoryBySlug(params.category);
    const product = productBySlug(params.product);
    if (!category || !product || product.category !== category.slug) throw notFound();
    return { category, product };
  },
  head: ({ loaderData }) =>
    loaderData
      ? seo({
          title: `${loaderData.product.name} — Réf. ${loaderData.product.reference}`,
          description: `${loaderData.product.name} (${loaderData.product.brand}) : ${loaderData.product.section}, ${loaderData.product.voltage}. Prix sur devis chez MERPORT, Casablanca.`,
        })
      : seo({ title: "Produit introuvable", description: "Ce produit n’existe pas.", noindex: true }),
  component: ProductPage,
});

function Screw({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "absolute size-3 rounded-full bg-[radial-gradient(circle_at_35%_35%,#f2f3f6,#8d929c)] after:absolute after:inset-x-[2px] after:top-1/2 after:h-px after:-translate-y-1/2 after:bg-black/40 after:content-['']",
        className,
      )}
    />
  );
}

function ProductPage() {
  const { category, product } = Route.useLoaderData();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);
  const related = productsInCategory(category.slug)
    .filter((item) => item.slug !== product.slug)
    .slice(0, 4);
  const whatsappText = encodeURIComponent(
    `Bonjour MERPORT, je souhaite un prix pour : ${product.name} (Réf. ${product.reference}), quantité ${quantity}.`,
  );
  const hasVoltage = product.voltage && product.voltage !== "—";

  const copyRef = async () => {
    try {
      await navigator.clipboard.writeText(product.reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const rows: [string, string][] = [
    ["Référence", product.reference],
    ["Marque", product.brand],
    ["Gamme / section", product.section],
    ["Tension", product.voltage],
    ...product.specs.map(([l, v]) => [l, v] as [string, string]),
  ];

  return (
    <div className="produit overflow-x-clip">
      <section className="bg-mp-paper bg-blueprint pb-16 pt-8 md:pb-24 md:pt-10">
        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="Fil d’Ariane" className="mb-8">
            <ol className="m-0 flex list-none flex-wrap items-center gap-1.5 p-0 text-[0.84rem] text-mp-muted">
              <li>
                <Link to="/" className="transition-colors hover:text-mp-red">
                  Accueil
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={14} />
              </li>
              <li>
                <Link to="/produits" className="transition-colors hover:text-mp-red">
                  Produits
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={14} />
              </li>
              <li>
                <Link to="/produits/$category" params={{ category: category.slug }} className="transition-colors hover:text-mp-red">
                  {category.name}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={14} />
              </li>
              <li aria-current="page" className="max-w-[24ch] truncate text-mp-ink">
                {product.name}
              </li>
            </ol>
          </nav>

          <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            {/* Stage */}
            <div className="relative lg:sticky lg:top-[calc(var(--header-h,72px)+24px)]">
              <div className="relative aspect-square overflow-hidden rounded-[28px] border border-mp-line bg-[linear-gradient(180deg,#f6f7fa,#e4e7ee)]">
                <span aria-hidden="true" className="absolute inset-0 bg-blueprint" />
                <img
                  src={product.image}
                  alt={`${product.name} — ${category.name}, marque ${product.brand}`}
                  width={1200}
                  height={1200}
                  decoding="async"
                  fetchPriority="high"
                  className="relative size-full object-contain p-8 animate-fade-up"
                />
                {/* corner brackets */}
                <span aria-hidden="true" className="absolute left-5 top-5 size-8 border-2 border-b-0 border-r-0 border-mp-red" />
                <span aria-hidden="true" className="absolute bottom-5 right-5 size-8 border-2 border-l-0 border-t-0 border-mp-red" />
                {/* labels */}
                <span className="absolute left-16 top-5 rounded-md bg-mp-ink px-2.5 py-1 font-mono text-[0.7rem] text-white">{product.reference}</span>
                <span className="absolute right-5 top-5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-mp-muted">{product.brand}</span>
                {/* dimension line */}
                <span aria-hidden="true" className="absolute bottom-6 left-6 right-20 flex items-center gap-2">
                  <span className="h-3 w-px bg-mp-ink/50" />
                  <span className="h-px flex-1 bg-mp-ink/40" />
                  <span className="rounded bg-white px-2 py-0.5 font-mono text-[0.68rem] text-mp-ink shadow-sm">{product.section}</span>
                  <span className="h-px flex-1 bg-mp-ink/40" />
                  <span className="h-3 w-px bg-mp-ink/50" />
                </span>
              </div>
            </div>

            {/* Info */}
            <div>
              <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-mp-muted">
                {category.name} <span className="text-mp-red">·</span> {product.brand}
              </span>
              <h1 className="m-0 mt-3 text-[clamp(2rem,3.8vw,3.2rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-mp-ink">{product.name}</h1>

              <button
                type="button"
                onClick={copyRef}
                className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-mp-line bg-white py-1.5 pl-3.5 pr-2 font-mono text-[0.84rem] text-mp-ink transition hover:border-mp-ink"
                aria-label={`Copier la référence ${product.reference}`}
              >
                Réf. {product.reference}
                <span className={cx("grid size-6 place-items-center rounded-full transition", copied ? "bg-green-600 text-white" : "bg-mp-paper text-mp-muted")}>
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                </span>
              </button>

              <ul className="m-0 mt-5 flex list-none flex-wrap gap-2 p-0" aria-label="Caractéristiques principales">
                {[product.section, hasVoltage ? product.voltage : null, ...product.specs.slice(0, 2).map(([, v]) => v)]
                  .filter((v): v is string => !!v)
                  .map((v) => (
                    <li key={v} className="rounded-lg border border-mp-line bg-white px-3 py-1.5 font-mono text-[0.8rem] text-mp-ink">
                      {v}
                    </li>
                  ))}
              </ul>

              <p className="m-0 mt-6 max-w-[56ch] text-[1.02rem] leading-relaxed text-mp-muted">{product.description}</p>

              {/* Quote box */}
              <div className="mt-8 overflow-hidden rounded-[24px] border border-mp-line bg-white shadow-[0_30px_60px_-40px_rgba(11,24,56,0.55)]">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-dashed border-mp-line p-5 sm:p-6">
                  <div>
                    <span className="block font-mono text-[0.66rem] uppercase tracking-[0.16em] text-mp-muted">Prix professionnel</span>
                    <span className="text-[1.6rem] font-extrabold tracking-[-0.02em] text-mp-red">Sur devis</span>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-2 text-[0.9rem] font-semibold text-mp-ink">
                      <span className="size-2 rounded-full bg-[#f0a020] shadow-[0_0_0_4px_rgba(240,160,32,0.18)]" /> {product.availability}
                    </span>
                    <span className="mt-1 flex items-center justify-end gap-1.5 text-[0.8rem] text-mp-muted">
                      <Clock size={12} /> Selon quantités · réponse sous 24 h
                    </span>
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap gap-3">
                    <QtyStepper value={quantity} onChange={setQuantity} />
                    <button
                      type="button"
                      onClick={() => {
                        addToQuote(product, quantity);
                        setAdded(true);
                      }}
                      className={cx(
                        "inline-flex h-[52px] min-w-[220px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-full px-6 font-semibold text-white transition",
                        added ? "bg-green-600 hover:bg-green-700" : "bg-mp-red shadow-[0_8px_20px_-10px_rgba(215,31,43,0.8)] hover:-translate-y-px hover:bg-mp-red-dark",
                      )}
                    >
                      {added ? <Check size={17} /> : <Plus size={17} />} {added ? "Ajouté — ajouter encore" : "Ajouter au devis"}
                    </button>
                  </div>
                  {added && (
                    <Link to="/devis" className="mt-3 inline-flex items-center gap-1.5 text-[0.88rem] font-semibold text-mp-ink transition-all hover:gap-2.5 animate-fade-up [animation-duration:400ms]">
                      Finaliser ma demande de devis <ArrowRight size={15} className="text-mp-red" />
                    </Link>
                  )}
                  <a
                    href={`https://wa.me/${site.whatsappDigits}?text=${whatsappText}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full border-[1.5px] border-mp-line font-semibold text-mp-ink transition hover:border-[#25d366] hover:text-[#1a9e4c]"
                  >
                    <span className="inline-flex size-4 [&_svg]:size-full">
                      <WhatsAppIcon />
                    </span>
                    Demander le prix sur WhatsApp
                  </a>
                </div>
              </div>

              <ul className="m-0 mt-6 grid list-none gap-2.5 p-0 text-[0.9rem] text-mp-muted sm:grid-cols-2">
                <li className="flex items-center gap-2.5">
                  <FileText size={16} className="shrink-0 text-mp-red" aria-hidden="true" /> Fiche technique sur demande
                </li>
                <li className="flex items-center gap-2.5">
                  <Truck size={16} className="shrink-0 text-mp-red" aria-hidden="true" /> Livraison au Maroc, export sur devis
                </li>
              </ul>
            </div>
          </div>

          {/* Rating plate (technical sheet) */}
          <div className="mt-16 md:mt-24">
            <Label>Fiche technique</Label>
            <h2 className="m-0 text-[clamp(1.8rem,3.4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-mp-ink">Caractéristiques techniques</h2>

            <div className="relative mt-8 max-w-[880px] rounded-[18px] bg-[linear-gradient(160deg,#eceef3_0%,#c9ced8_55%,#e4e7ed_100%)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_30px_60px_-35px_rgba(11,24,56,0.6)] sm:p-9">
              <Screw className="left-3 top-3" />
              <Screw className="right-3 top-3" />
              <Screw className="bottom-3 left-3" />
              <Screw className="bottom-3 right-3" />
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-mp-ink/25 pb-3">
                <span className="text-[1.15rem] font-extrabold tracking-[-0.01em] text-mp-ink">MERPORT · {product.brand}</span>
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-mp-ink/60">Plaque signalétique</span>
              </div>
              <dl className="m-0 mt-2 grid sm:grid-cols-2 sm:gap-x-10">
                {rows.map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between gap-4 border-b border-mp-ink/15 py-3">
                    <dt className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-mp-ink/60">{label}</dt>
                    <dd className="m-0 text-right font-mono text-[0.9rem] font-medium text-mp-ink">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="m-0 mt-4 font-mono text-[0.7rem] text-mp-ink/60">Caractéristiques indicatives, à confirmer sur devis selon le modèle exact.</p>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-white py-16 md:py-24">
          <div className="container">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <Label>Même famille</Label>
                <h2 className="m-0 text-[clamp(1.8rem,3.4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-mp-ink">
                  Complétez <span className="text-mp-red">votre devis.</span>
                </h2>
              </div>
              <Link
                to="/produits/$category"
                params={{ category: category.slug }}
                className="inline-flex h-12 items-center gap-2 rounded-full border-[1.5px] border-mp-ink px-5 font-semibold text-mp-ink transition hover:bg-mp-ink hover:text-white"
              >
                {category.name} <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {related.map((item, index) => (
                <ProductTile key={item.slug} product={item} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}