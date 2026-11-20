export type Category = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  intro: string;
  icon: string;
  image: string;
  imageAlt: string;
};

export const categories: Category[] = [
  {
    slug: "cables-fils",
    name: "Câbles & fils",
    shortName: "Câbles",
    description: "Conducteurs et câbles BT, MT, souples, armés, télécom et fibre optique.",
    intro: "Câbles d’énergie U1000 R2V, armés, souples, fils de câblage, câbles moyenne tension, télécom et fibre optique : importés en direct et stockés à Casablanca.",
    icon: "cable",
    image: "/images/family-cables.webp",
    imageAlt: "Câble électrique armé dénudé montrant ses conducteurs en cuivre, à côté d’une bobine de câble",
  },
  {
    slug: "raccordement-connectique",
    name: "Raccordement & connectique",
    shortName: "Raccordement",
    description: "Cosses, bornes, manchons, presse-étoupes et kits de terminaison.",
    intro: "Toute la connectique pour raccorder, jonctionner et terminer vos câbles en basse et moyenne tension, en cuivre comme en aluminium.",
    icon: "connect",
    image: "/images/family-raccordement.webp",
    imageAlt: "Cosses, bornes et presse-étoupes de raccordement électrique",
  },
  {
    slug: "cheminement-cables",
    name: "Cheminement de câbles",
    shortName: "Cheminement",
    description: "Chemins de câbles, échelles, goulottes, gaines et supports.",
    intro: "Chemins de câbles perforés, fil et échelles, goulottes et gaines : de quoi guider et protéger vos réseaux sur chantier comme en usine.",
    icon: "path",
    image: "/images/family-cheminement.webp",
    imageAlt: "Chemins de câbles galvanisés perforés et en fil installés en hauteur",
  },
  {
    slug: "eclairage",
    name: "Éclairage",
    shortName: "Éclairage",
    description: "High-bay, panneaux LED, réglettes étanches et projecteurs.",
    intro: "Éclairage LED technique pour entrepôts, usines, bureaux, parkings et voirie : high-bay, panneaux, réglettes étanches et projecteurs.",
    icon: "light",
    image: "/images/family-eclairage.webp",
    imageAlt: "Luminaires LED industriels et projecteurs allumés",
  },
  {
    slug: "appareillage-distribution",
    name: "Appareillage & distribution",
    shortName: "Distribution",
    description: "Disjoncteurs, différentiels, tableaux, coffrets, interrupteurs et prises.",
    intro: "Protection, commande et distribution : disjoncteurs modulaires et boîtiers moulés, différentiels, tableaux, coffrets, interrupteurs et prises.",
    icon: "switch",
    image: "/images/family-appareillage.webp",
    imageAlt: "Disjoncteurs modulaires montés sur rail DIN dans un tableau électrique",
  },
  {
    slug: "automatisme-regulation",
    name: "Automatisme & régulation",
    shortName: "Automatisme",
    description: "Relais, contacteurs, régulateurs, temporisations et variateurs.",
    intro: "Relais, contacteurs, régulateurs, temporisations, automates et variateurs pour commander et réguler vos installations.",
    icon: "automation",
    image: "/images/family-automatisme.webp",
    imageAlt: "Relais, contacteurs et modules d’automatisme sur rail DIN",
  },
  {
    slug: "comptage-mesure",
    name: "Comptage & mesure",
    shortName: "Mesure",
    description: "Compteurs d’énergie, transformateurs de courant, analyseurs et multimètres.",
    intro: "Compteurs d’énergie, transformateurs de courant, analyseurs de réseau et appareils de mesure pour suivre vos consommations.",
    icon: "measure",
    image: "/images/family-comptage.webp",
    imageAlt: "Compteurs d’énergie numériques et appareils de mesure électrique",
  },
  {
    slug: "outillage",
    name: "Outillage",
    shortName: "Outillage",
    description: "Pinces à sertir, coupe-câbles, tournevis et outils isolés 1000 V.",
    intro: "Outillage professionnel pour électriciens : sertissage, coupe, dénudage et outils isolés 1000 V.",
    icon: "tools",
    image: "/images/family-outillage.webp",
    imageAlt: "Outils d’électricien isolés : pinces, tournevis et coupe-câble",
  },
];

export const categoryBySlug = (slug: string) => categories.find((category) => category.slug === slug);
