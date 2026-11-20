import { Link } from "@tanstack/react-router";
import { ArrowRight, Search, X } from "lucide-react";
import { categories } from "@/data/categories";
import { productBrands, searchProducts, type Product } from "@/data/products";
import { ProductCard } from "./product-card";

export type BrowserFilters = { q?: string | undefined; marque?: string | undefined; famille?: string | undefined };

export function ProductBrowser({
  products,
  filters,
  onChange,
  showCategoryFilter = false,
}: {
  products: Product[];
  filters: BrowserFilters;
  onChange: (patch: BrowserFilters) => void;
  showCategoryFilter?: boolean;
}) {
  const brandsHere = productBrands.filter((brand) => products.some((product) => product.brand === brand));
  let filtered = products;
  if (filters.famille) filtered = filtered.filter((product) => product.category === filters.famille);
  if (filters.marque) filtered = filtered.filter((product) => product.brand === filters.marque);
  filtered = searchProducts(filtered, filters.q ?? "");
  const hasFilters = Boolean(filters.q || filters.marque || filters.famille);

  return (
    <div className="product-browser">
      <div className="browser-bar">
      <div className="browser-toolbar">
        <label className="search-field">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">Rechercher un produit</span>
          <input
            type="search"
            placeholder="Désignation, référence, section…"
            value={filters.q ?? ""}
            onChange={(event) => onChange({ q: event.target.value || undefined })}
          />
        </label>
        <label className="select-field">
          <span className="sr-only">Filtrer par marque</span>
          <select value={filters.marque ?? ""} onChange={(event) => onChange({ marque: event.target.value || undefined })}>
            <option value="">Toutes les marques</option>
            {brandsHere.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
          </select>
        </label>
      </div>
      {showCategoryFilter && (
        <div className="filter-chips" role="group" aria-label="Filtrer par famille">
          <button type="button" aria-pressed={!filters.famille} onClick={() => onChange({ famille: undefined })}>Toutes</button>
          {categories.map((category) => (
            <button key={category.slug} type="button" aria-pressed={filters.famille === category.slug} onClick={() => onChange({ famille: filters.famille === category.slug ? undefined : category.slug })}>
              {category.shortName}
            </button>
          ))}
        </div>
      )}
      </div>
      <div className="browser-status" aria-live="polite">
        <span><b>{String(filtered.length).padStart(2, "0")}</b> produit{filtered.length > 1 ? "s" : ""} · prix sur devis</span>
        {hasFilters && <button type="button" className="text-button" onClick={() => onChange({ q: undefined, marque: undefined, famille: undefined })}><X size={14} /> Effacer les filtres</button>}
      </div>
      {filtered.length ? (
        <div className="product-grid">{filtered.map((product, index) => <ProductCard key={product.slug} product={product} index={index} />)}</div>
      ) : (
        <div className="empty-state">
          <span className="empty-state-code" aria-hidden="true">0 réf.</span>
          <p>Aucun produit ne correspond à votre recherche.</p>
          <p>Nous importons bien plus que ce catalogue : envoyez-nous votre référence, nous la chiffrons.</p>
          <Link to="/devis" className="button button-red">Envoyer ma référence <ArrowRight size={15} /></Link>
        </div>
      )}
    </div>
  );
}
