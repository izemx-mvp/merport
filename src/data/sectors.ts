export type Sector = {
  slug: string;
  name: string;
  summary: string;
  needs: string[];
  image: string;
  imageAlt: string;
};

export const sectors: Sector[] = [
  {
    slug: "industrie",
    name: "Industrie",
    summary: "Usines, agroalimentaire, process : du câble de puissance à l’automatisme, livrés pour tenir vos arrêts programmés.",
    needs: ["Câbles armés et souples", "Tableaux et protection", "Automatisme et régulation"],
    image: "/images/sector-industrie.webp",
    imageAlt: "Armoires électriques et chemins de câbles dans un atelier industriel",
  },
  {
    slug: "btp",
    name: "BTP & promotion immobilière",
    summary: "Résidentiel, tertiaire, équipements publics : des volumes importants, livrés par phase selon l’avancement du chantier.",
    needs: ["Fils et câbles U1000 R2V", "Gaines, goulottes, appareillage", "Coffrets de distribution"],
    image: "/images/sector-btp.webp",
    imageAlt: "Tableau électrique et tourets de câbles sur un chantier de bâtiment",
  },
  {
    slug: "energie",
    name: "Énergie & infrastructures",
    summary: "Postes, réseaux, solaire, voirie : câbles MT, terminaisons, comptage et éclairage public.",
    needs: ["Câbles moyenne tension", "Kits de terminaison MT", "Comptage et mesure"],
    image: "/images/sector-energie.webp",
    imageAlt: "Poste de transformation électrique de nuit",
  },
  {
    slug: "logistique",
    name: "Logistique & entrepôts",
    summary: "Grandes hauteurs, longues distances : éclairage LED high-bay, cheminement et distribution.",
    needs: ["High-bay et réglettes étanches", "Chemins de câbles", "Tableaux divisionnaires"],
    image: "/images/sector-logistique.webp",
    imageAlt: "Entrepôt éclairé par des luminaires LED avec chemins de câbles",
  },
  {
    slug: "installateurs",
    name: "Installateurs & tableautiers",
    summary: "Un fournisseur unique pour vos chantiers : références suivies, conseil technique et retrait rapide à Casablanca.",
    needs: ["Appareillage modulaire", "Raccordement et borniers", "Outillage isolé"],
    image: "/images/sector-installateurs.webp",
    imageAlt: "Tableau de distribution câblé avec outillage d'électricien",
  },
  {
    slug: "export",
    name: "Export Afrique",
    summary: "Groupage, documentation et expédition vers l’Afrique de l’Ouest et centrale depuis le port de Casablanca.",
    needs: ["Conteneurs complets ou groupés", "Documents export", "Suivi logistique"],
    image: "/images/sector-export.webp",
    imageAlt: "Tourets de câbles prêts à l'expédition sur un quai portuaire",
  },
];
