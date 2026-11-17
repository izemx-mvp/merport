import { categories } from "./categories";

export type Product = {
  slug: string;
  reference: string;
  name: string;
  category: string;
  brand: string;
  section: string;
  voltage: string;
  availability: "À confirmer";
  description: string;
  specs: Array<[string, string]>;
};

const samples: Array<{ names: string[]; brand: string; section: string; voltage: string; specs: Array<[string, string]> }> = [
  { names: ["Câble U1000 R2V", "Câble souple H07RN-F", "Câble armé RVFV", "Fil H07V-U", "Câble moyenne tension RHZ1"], brand: "Mekaskablo", section: "3G2,5 à 4×240 mm²", voltage: "0,6/1 kV", specs: [["Conducteur", "Cuivre"], ["Isolation", "XLPE / PVC"], ["Usage", "Installation fixe"]] },
  { names: ["Presse-étoupe laiton", "Cosse tubulaire cuivre", "Manchon de jonction", "Borne de raccordement", "Kit de terminaison MT"], brand: "Phoenix Electric", section: "1,5 à 240 mm²", voltage: "Jusqu’à 36 kV", specs: [["Matière", "Cuivre / laiton"], ["Montage", "À sertir ou visser"], ["Usage", "Raccordement"]] },
  { names: ["Chemin de câbles perforé", "Chemin de câbles fil", "Goulotte PVC", "Échelle à câbles", "Console de support"], brand: "PVC Pano", section: "50 à 600 mm", voltage: "—", specs: [["Finition", "Galvanisée"], ["Largeur", "50–600 mm"], ["Accessoires", "Disponibles"]] },
  { names: ["Projecteur LED industriel", "Réglette LED étanche", "Hublot LED", "Luminaire de grande hauteur", "Projecteur extérieur LED"], brand: "Volta", section: "20 à 240 W", voltage: "220–240 V", specs: [["Source", "LED"], ["Protection", "IP65 selon modèle"], ["Application", "Industrie / tertiaire"]] },
  { names: ["Disjoncteur modulaire", "Interrupteur-sectionneur", "Coffret de distribution", "Disjoncteur boîtier moulé", "Tableau électrique"], brand: "Volta", section: "1 à 630 A", voltage: "230/400 V", specs: [["Fonction", "Protection / commande"], ["Montage", "Rail DIN / coffret"], ["Pôles", "1 à 4P selon modèle"]] },
  { names: ["Régulateur de température", "Relais temporisé", "Automate programmable", "Capteur de présence", "Variateur de vitesse"], brand: "Tense", section: "Selon application", voltage: "24–400 V", specs: [["Commande", "Automatisée"], ["Réglage", "Paramétrable"], ["Usage", "Contrôle / régulation"]] },
  { names: ["Compteur d’énergie triphasé", "Multimètre numérique", "Transformateur de courant", "Analyseur réseau", "Compteur monophasé"], brand: "Tense", section: "Selon modèle", voltage: "230/400 V", specs: [["Mesure", "Énergie / paramètres réseau"], ["Affichage", "Numérique"], ["Montage", "Rail DIN / panneau"]] },
  { names: ["Pince à sertir", "Coupe-câble professionnel", "Tournevis isolé", "Dénude-câble automatique", "Jeu de clés isolées"], brand: "Phoenix Electric", section: "Selon outil", voltage: "1000 V selon modèle", specs: [["Usage", "Installation électrique"], ["Prise en main", "Professionnelle"], ["Gamme", "Plusieurs formats"]] },
];

// CONTENU EXEMPLE À REMPLACER — références et spécifications de démonstration à confirmer auprès de MERPORT.
export const products: Product[] = categories.flatMap((category, groupIndex) => {
  const sample = samples[groupIndex];
  if (!sample) return [];
  return sample.names.map((name, itemIndex) => ({
    slug: `${category.slug}-${itemIndex + 1}`,
    reference: `MP-${String(groupIndex + 1).padStart(2, "0")}${String(itemIndex + 1).padStart(3, "0")}`,
    name,
    category: category.slug,
    brand: sample.brand,
    section: sample.section,
    voltage: sample.voltage,
    availability: "À confirmer" as const,
    description: `${name} de la gamme ${category.name.toLowerCase()}. ${category.description}`,
    specs: sample.specs,
  }));
});

export const productBySlug = (slug: string) => products.find((product) => product.slug === slug);
export const productCategoryName = (slug: string) => categories.find((category) => category.slug === slug)?.name ?? "Produits";
