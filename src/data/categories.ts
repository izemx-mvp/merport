export type Category = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  count: number;
};

export const categories: Category[] = [
  { slug: "cables-fils", name: "Câbles & fils", shortName: "Câbles", description: "Conducteurs et câbles BT, MT et HT pour installations exigeantes.", icon: "cable", count: 5 },
  { slug: "raccordement-connectique", name: "Raccordement & connectique", shortName: "Raccordement", description: "Solutions de connexion, jonction, terminaison et protection.", icon: "connect", count: 5 },
  { slug: "cheminement-cables", name: "Cheminement de câbles", shortName: "Cheminement", description: "Chemins de câbles et accessoires pour une installation maîtrisée.", icon: "path", count: 5 },
  { slug: "eclairage", name: "Éclairage", shortName: "Éclairage", description: "Éclairage technique adapté aux sites industriels et tertiaires.", icon: "light", count: 5 },
  { slug: "appareillage-distribution", name: "Appareillage & distribution", shortName: "Distribution", description: "Équipements de protection, commande et distribution électrique.", icon: "switch", count: 5 },
  { slug: "automatisme-regulation", name: "Automatisme & régulation", shortName: "Automatisme", description: "Commande, régulation et contrôle pour vos installations.", icon: "automation", count: 5 },
  { slug: "comptage-mesure", name: "Comptage & mesure", shortName: "Mesure", description: "Mesure et comptage pour le suivi de vos réseaux électriques.", icon: "measure", count: 5 },
  { slug: "outillage", name: "Outillage", shortName: "Outillage", description: "Outillage professionnel pour travaux électriques.", icon: "tools", count: 5 },
];

export const categoryBySlug = (slug: string) => categories.find((category) => category.slug === slug);
