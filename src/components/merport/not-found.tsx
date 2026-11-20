import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/categories";

export function NotFoundPage() {
  return (
    <section className="not-found">
      <img className="not-found-bg" src="/images/404-cable-cut.webp" alt="Câble électrique sectionné, conducteurs en cuivre apparents" width={1600} height={893} decoding="async" />
      <div className="not-found-code" aria-hidden="true">404</div>
      <div className="container not-found-inner">
        <span className="eyebrow eyebrow-light"><i /> ERREUR 404</span>
        <h1>Le courant ne passe plus.</h1>
        <p>Cette page n’existe pas ou a été déplacée. Reprenez le fil depuis l’accueil ou le catalogue.</p>
        <div className="button-row">
          <Link to="/" className="button button-red">Retour à l’accueil <ArrowRight size={15} /></Link>
          <Link to="/produits" className="button button-ghost-light">Voir le catalogue</Link>
        </div>
        <ul className="not-found-links" aria-label="Familles de produits">
          {categories.map((category) => (
            <li key={category.slug}><Link to="/produits/$category" params={{ category: category.slug }}>{category.name}</Link></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
