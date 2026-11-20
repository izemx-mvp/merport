import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Plus } from "lucide-react";
import type { Product } from "@/data/products";
import { categoryBySlug } from "@/data/categories";
import { addToQuote } from "./quote-actions";

/** Technical-sheet cell: products sit in a shared-border grid rather than floating cards. */
export function ProductCard({ product, index }: { product: Product; index?: number }) {
  const category = categoryBySlug(product.category);
  const params = { category: product.category, product: product.slug };
  return (
    <article className="product-card" style={index !== undefined ? { animationDelay: `${Math.min(index, 11) * 45}ms` } : undefined}>
      <Link to="/produits/$category/$product" params={params} className="product-card-image" aria-label={`Voir ${product.name}`}>
        <img src={product.image} alt={`${product.name} — ${category?.name ?? "matériel électrique"}`} width={1200} height={1200} loading="lazy" decoding="async" />
        <span className="product-card-tag">{product.reference}</span>
        <span className="product-open-icon" aria-hidden="true"><ArrowUpRight size={17} /></span>
      </Link>
      <div className="product-card-content">
        <div className="product-card-category">{category?.shortName} <span>/</span> {product.brand}</div>
        <Link to="/produits/$category/$product" params={params} className="product-card-name">{product.name}</Link>
        <dl className="product-card-specs">
          <div><dt>Gamme</dt><dd>{product.section}</dd></div>
          {product.voltage !== "—" && <div><dt>Tension</dt><dd>{product.voltage}</dd></div>}
        </dl>
        <div className="product-card-bottom">
          <span className="quote-only">Sur devis</span>
          <button type="button" className="add-quote-button" onClick={() => addToQuote(product)} aria-label={`Ajouter ${product.name} au devis`}>
            <Plus size={16} aria-hidden="true" /><span>Ajouter au devis</span>
          </button>
        </div>
      </div>
    </article>
  );
}
