import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";
import { categoryBySlug } from "@/data/categories";
import { ProductIllustration } from "./product-illustration";
import { addToQuote } from "./quote-actions";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const category = categoryBySlug(product.category);
  return (
    <article className="product-card">
      <Link to="/produits/$category/$product" params={{ category: product.category, product: product.slug }} className="product-card-image" aria-label={`Voir ${product.name}`}>
        <ProductIllustration category={product.category} tone={String(index % 4)} />
        <span className="availability-tag"><span/>{product.availability}</span>
        <span className="product-open-icon"><ArrowUpRight size={17}/></span>
      </Link>
      <div className="product-card-content">
        <div className="product-card-category">{category?.shortName} <span>·</span> {product.brand}</div>
        <Link to="/produits/$category/$product" params={{ category: product.category, product: product.slug }} className="product-card-name">{product.name}</Link>
        <div className="product-reference">Réf. {product.reference}</div>
        <div className="product-card-meta"><span>{product.section}</span><span>{product.voltage}</span></div>
        <div className="product-card-bottom"><span className="quote-only">Sur devis</span><Button variant="outline" size="sm" className="add-quote-button" onClick={() => addToQuote(product)} aria-label={`Ajouter ${product.name} au devis`}><Plus size={16}/><span>Ajouter au devis</span><ArrowRight size={13}/></Button></div>
      </div>
    </article>
  );
}