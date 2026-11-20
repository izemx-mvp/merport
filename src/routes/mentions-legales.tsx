import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { site } from "@/config/site";
import { PageHero } from "@/components/merport/page-hero";

export const Route = createFileRoute("/mentions-legales")({
  head: () => seo({ title: "Mentions légales", description: "Mentions légales du site MERPORT SARL, importateur de matériel électrique à Casablanca." }),
  component: LegalPage,
});

function LegalPage() {
  return (
    <>
      <PageHero word="LÉGAL" eyebrow="INFORMATIONS LÉGALES" title="Mentions légales" crumbs={[{ label: "Mentions légales" }]} />
      <section className="section section-tight">
        <div className="container prose legal-prose">
          <h2>Éditeur du site</h2>
          <p>{site.name}, société à responsabilité limitée au capital de 2 000 000 DH.<br />Siège social : {site.address}.<br />Registre du commerce : Casablanca 53339 — ICE : 000084219000058.<br />Téléphone : {site.phones.join(" / ")} — E-mail : <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
          <h2>Hébergement</h2>
          <p>Le site est hébergé par un prestataire d’hébergement cloud. Les coordonnées de l’hébergeur sont communiquées sur simple demande.</p>
          <h2>Propriété intellectuelle</h2>
          <p>L’ensemble des contenus de ce site (textes, visuels, logo, mise en page) est la propriété de {site.name} ou de ses partenaires. Toute reproduction sans autorisation écrite préalable est interdite. Les marques citées appartiennent à leurs titulaires respectifs.</p>
          <h2>Informations produits et prix</h2>
          <p>Les produits présentés le sont à titre indicatif. Les caractéristiques, disponibilités et prix sont confirmés uniquement par une offre écrite de {site.name}. Aucune vente n’est conclue en ligne.</p>
          <h2>Responsabilité</h2>
          <p>{site.name} s’efforce d’assurer l’exactitude des informations publiées, sans pouvoir garantir l’absence d’erreur. Les liens vers des sites tiers n’engagent pas sa responsabilité.</p>
        </div>
      </section>
    </>
  );
}
