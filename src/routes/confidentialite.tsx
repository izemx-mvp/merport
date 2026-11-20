import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { site } from "@/config/site";
import { PageHero } from "@/components/merport/page-hero";

export const Route = createFileRoute("/confidentialite")({
  head: () => seo({ title: "Politique de confidentialité", description: "Comment MERPORT collecte et protège les données transmises via ses formulaires de devis et de contact." }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageHero word="DONNÉES" eyebrow="DONNÉES PERSONNELLES" title="Politique de confidentialité" crumbs={[{ label: "Confidentialité" }]} />
      <section className="section section-tight">
        <div className="container prose legal-prose">
          <p>{site.name} respecte la loi marocaine n° 09-08 relative à la protection des personnes physiques à l’égard du traitement des données à caractère personnel.</p>
          <h2>Données collectées</h2>
          <p>Via les formulaires de devis et de contact : raison sociale, ICE, nom, e-mail, téléphone, ville et adresse de livraison, contenu de votre demande et, le cas échéant, le fichier joint.</p>
          <h2>Finalités</h2>
          <p>Ces données servent uniquement à répondre à vos demandes, établir des offres commerciales et assurer le suivi de la relation client. Elles ne sont ni vendues ni cédées à des tiers.</p>
          <h2>Conservation et sécurité</h2>
          <p>Les demandes et fichiers joints sont stockés dans un espace privé, accessible uniquement à l’équipe {site.name}. Ils sont conservés pendant la durée nécessaire à la relation commerciale, puis supprimés ou archivés conformément aux obligations légales.</p>
          <h2>Stockage local</h2>
          <p>Votre sélection de produits pour le devis est enregistrée dans votre navigateur (stockage local) afin de la retrouver lors de votre prochaine visite. Elle n’est transmise qu’au moment où vous envoyez votre demande.</p>
          <h2>Vos droits</h2>
          <p>Vous disposez d’un droit d’accès, de rectification et d’opposition. Pour l’exercer : <a href={`mailto:${site.email}`}>{site.email}</a> ou par courrier à {site.address}.</p>
        </div>
      </section>
    </>
  );
}
