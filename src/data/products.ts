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
  image: string;
  description: string;
  specs: Array<[string, string]>;
};

type Seed = {
  name: string;
  image: string;
  brand: string;
  section: string;
  voltage: string;
  specs: Array<[string, string]>;
};

const img = (name: string) => `/images/prod-${name}.webp`;

const seedsByCategory: Record<string, Seed[]> = {
  "cables-fils": [
    { name: "Câble U1000 R2V", image: img("cable-energie"), brand: "Mekaskablo", section: "3G1,5 à 4×240 mm²", voltage: "0,6/1 kV", specs: [["Conducteur", "Cuivre classe 2"], ["Isolation", "PRC (XLPE)"], ["Gaine", "PVC noir"], ["Pose", "Fixe, enterrée sous fourreau"]] },
    { name: "Câble armé RVFV", image: img("cable-energie"), brand: "Borsan Kablo", section: "3×2,5 à 4×185 mm²", voltage: "0,6/1 kV", specs: [["Conducteur", "Cuivre"], ["Armure", "Feuillards acier"], ["Gaine", "PVC"], ["Pose", "Enterrée directe"]] },
    { name: "Câble moyenne tension RHZ1", image: img("cable-energie"), brand: "Borsan Kablo", section: "1×50 à 1×400 mm²", voltage: "12/20 kV", specs: [["Conducteur", "Aluminium ou cuivre"], ["Isolation", "XLPE"], ["Écran", "Fils de cuivre"], ["Norme", "IEC 60502-2"]] },
    { name: "Câble souple H07RN-F", image: img("cable-souple"), brand: "Mekaskablo", section: "3G1,5 à 5G25 mm²", voltage: "450/750 V", specs: [["Conducteur", "Cuivre souple classe 5"], ["Gaine", "Caoutchouc néoprène"], ["Usage", "Chantier, mobile"], ["Température", "-25 à +60 °C"]] },
    { name: "Fil de câblage H07V-U", image: img("fils"), brand: "Mekaskablo", section: "1,5 à 10 mm²", voltage: "450/750 V", specs: [["Conducteur", "Cuivre rigide"], ["Isolation", "PVC"], ["Couleurs", "Bleu, rouge, noir, vert/jaune"], ["Conditionnement", "Couronne 100 m"]] },
    { name: "Câble fibre optique monomode", image: img("telecom-fibre"), brand: "Borsan Kablo", section: "4 à 48 fibres", voltage: "—", specs: [["Fibre", "OS2 9/125 µm"], ["Structure", "Tubes libres"], ["Gaine", "LSZH"], ["Usage", "Intérieur / extérieur"]] },
  ],
  "raccordement-connectique": [
    { name: "Cosse tubulaire cuivre étamé", image: img("raccordement"), brand: "Phoenix Electric", section: "6 à 400 mm²", voltage: "BT", specs: [["Matière", "Cuivre étamé"], ["Montage", "À sertir"], ["Plage", "M6 à M16"]] },
    { name: "Manchon de jonction", image: img("raccordement"), brand: "Phoenix Electric", section: "10 à 240 mm²", voltage: "Jusqu’à 1 kV", specs: [["Matière", "Cuivre / aluminium"], ["Montage", "À sertir ou à vis fusible"], ["Usage", "Jonction de câbles"]] },
    { name: "Presse-étoupe laiton IP68", image: img("raccordement"), brand: "Phoenix Electric", section: "M16 à M63", voltage: "—", specs: [["Matière", "Laiton nickelé"], ["Étanchéité", "IP68"], ["Filetage", "Métrique"]] },
    { name: "Bornier de raccordement sur rail", image: img("raccordement"), brand: "Phoenix Electric", section: "2,5 à 35 mm²", voltage: "800 V", specs: [["Connexion", "Vis ou ressort"], ["Montage", "Rail DIN"], ["Accessoires", "Repérage, cloisons"]] },
    { name: "Kit de terminaison MT", image: img("raccordement"), brand: "Phoenix Electric", section: "35 à 300 mm²", voltage: "Jusqu’à 36 kV", specs: [["Technologie", "Thermorétractable"], ["Pose", "Intérieure / extérieure"], ["Câble", "Unipolaire synthétique"]] },
  ],
  "cheminement-cables": [
    { name: "Chemin de câbles perforé", image: img("chemin-cable"), brand: "PVC Pano", section: "50 à 600 mm", voltage: "—", specs: [["Finition", "Galvanisé Sendzimir"], ["Hauteur d’aile", "35 à 110 mm"], ["Longueur", "3 m"]] },
    { name: "Chemin de câbles fil", image: img("chemin-cable"), brand: "PVC Pano", section: "50 à 500 mm", voltage: "—", specs: [["Finition", "Électrozingué"], ["Hauteur", "54 à 105 mm"], ["Avantage", "Pose rapide, coupe facile"]] },
    { name: "Échelle à câbles", image: img("chemin-cable"), brand: "PVC Pano", section: "200 à 1000 mm", voltage: "—", specs: [["Finition", "Galvanisé à chaud"], ["Usage", "Fortes charges"], ["Longueur", "3 ou 6 m"]] },
    { name: "Goulotte PVC de distribution", image: img("goulotte-gaine"), brand: "PVC Pano", section: "40×25 à 100×60 mm", voltage: "—", specs: [["Matière", "PVC rigide"], ["Couvercle", "Clipsable"], ["Couleur", "Blanc / gris"]] },
    { name: "Gaine ICTA annelée", image: img("goulotte-gaine"), brand: "PVC Pano", section: "Ø16 à Ø63 mm", voltage: "—", specs: [["Matière", "Polypropylène"], ["Pose", "Encastrée, noyée béton"], ["Conditionnement", "Couronne avec tire-fil"]] },
  ],
  eclairage: [
    { name: "Luminaire LED high-bay", image: img("highbay"), brand: "Volta", section: "100 à 240 W", voltage: "220–240 V", specs: [["Flux", "Jusqu’à 36 000 lm"], ["Protection", "IP65"], ["Hauteur", "6 à 15 m"], ["Application", "Entrepôts, usines"]] },
    { name: "Panneau LED 60×60", image: img("panneau-led"), brand: "Volta", section: "36 à 48 W", voltage: "220–240 V", specs: [["Format", "595×595 mm"], ["Température", "4000 K"], ["UGR", "< 19"], ["Pose", "Faux plafond, saillie"]] },
    { name: "Réglette LED étanche", image: img("reglette-etanche"), brand: "Volta", section: "18 à 60 W", voltage: "220–240 V", specs: [["Longueur", "0,6 / 1,2 / 1,5 m"], ["Protection", "IP65"], ["Application", "Parkings, ateliers"]] },
    { name: "Projecteur LED extérieur", image: img("exterieur"), brand: "Volta", section: "50 à 400 W", voltage: "220–240 V", specs: [["Protection", "IP66"], ["Corps", "Aluminium"], ["Application", "Façades, aires, stades"]] },
    { name: "Luminaire d’éclairage public LED", image: img("exterieur"), brand: "Volta", section: "30 à 200 W", voltage: "220–240 V", specs: [["Protection", "IP66 / IK08"], ["Optique", "Routière"], ["Application", "Voirie, lotissements"]] },
  ],
  "appareillage-distribution": [
    { name: "Disjoncteur modulaire courbe C", image: img("disjoncteurs"), brand: "Volta", section: "1 à 63 A", voltage: "230/400 V", specs: [["Pouvoir de coupure", "6 à 10 kA"], ["Pôles", "1P à 4P"], ["Montage", "Rail DIN"]] },
    { name: "Interrupteur différentiel 30 mA", image: img("disjoncteurs"), brand: "Volta", section: "25 à 100 A", voltage: "230/400 V", specs: [["Sensibilité", "30 / 300 mA"], ["Type", "AC, A"], ["Pôles", "2P / 4P"]] },
    { name: "Disjoncteur boîtier moulé", image: img("disjoncteurs"), brand: "Volta", section: "100 à 630 A", voltage: "400 V", specs: [["Pouvoir de coupure", "Jusqu’à 50 kA"], ["Déclencheur", "Magnétothermique réglable"], ["Pôles", "3P / 4P"]] },
    { name: "Coffret de distribution modulaire", image: img("tableau"), brand: "PVC Pano", section: "4 à 72 modules", voltage: "—", specs: [["Matière", "ABS / polyester"], ["Protection", "IP40 à IP65"], ["Pose", "Saillie ou encastrée"]] },
    { name: "Tableau électrique industriel", image: img("tableau"), brand: "PVC Pano", section: "Sur mesure", voltage: "400 V", specs: [["Enveloppe", "Métallique ou polyester"], ["Protection", "IP55 / IP65"], ["Réalisation", "Selon schéma"]] },
    { name: "Interrupteurs et prises encastrés", image: img("interrupteurs-prises"), brand: "Volta", section: "10 à 16 A", voltage: "250 V", specs: [["Fonctions", "Simple, va-et-vient, double"], ["Prises", "2P+T"], ["Finition", "Blanc / gris"]] },
  ],
  "automatisme-regulation": [
    { name: "Contacteur de puissance", image: img("automatisme"), brand: "Tense", section: "9 à 150 A", voltage: "24–400 V", specs: [["Catégorie", "AC-3"], ["Bobine", "AC ou DC"], ["Contacts auxiliaires", "1 NO + 1 NF"]] },
    { name: "Relais temporisé multifonction", image: img("automatisme"), brand: "Tense", section: "0,1 s à 100 h", voltage: "12–240 V", specs: [["Fonctions", "10 modes"], ["Contact", "1 inverseur 8 A"], ["Montage", "Rail DIN"]] },
    { name: "Régulateur de température", image: img("automatisme"), brand: "Tense", section: "48×48 à 96×96 mm", voltage: "100–240 V", specs: [["Régulation", "PID / tout-ou-rien"], ["Entrées", "PT100, thermocouple"], ["Affichage", "LED double"]] },
    { name: "Relais de contrôle de phases", image: img("automatisme"), brand: "Tense", section: "Triphasé", voltage: "400 V", specs: [["Surveillance", "Ordre, absence, déséquilibre"], ["Contact", "1 inverseur"], ["Montage", "Rail DIN"]] },
    { name: "Variateur de vitesse", image: img("automatisme"), brand: "Tense", section: "0,75 à 22 kW", voltage: "230 / 400 V", specs: [["Commande", "U/f, vectorielle"], ["Communication", "Modbus RTU"], ["Protection", "IP20"]] },
  ],
  "comptage-mesure": [
    { name: "Compteur d’énergie triphasé", image: img("mesure"), brand: "Tense", section: "Direct 100 A ou sur TC", voltage: "3×230/400 V", specs: [["Classe", "1"], ["Affichage", "LCD"], ["Communication", "Modbus selon modèle"]] },
    { name: "Compteur d’énergie monophasé", image: img("mesure"), brand: "Tense", section: "5(45) A", voltage: "230 V", specs: [["Classe", "1"], ["Largeur", "1 module"], ["Montage", "Rail DIN"]] },
    { name: "Transformateur de courant", image: img("mesure"), brand: "Tense", section: "50/5 à 2000/5 A", voltage: "720 V", specs: [["Classe", "0,5 / 1"], ["Montage", "Barre ou câble"], ["Puissance", "2,5 à 15 VA"]] },
    { name: "Analyseur de réseau", image: img("mesure"), brand: "Tense", section: "96×96 mm", voltage: "3×400 V", specs: [["Mesures", "U, I, P, Q, cos φ, THD"], ["Communication", "RS485 Modbus"], ["Montage", "Encastré en façade"]] },
    { name: "Multimètre numérique", image: img("mesure"), brand: "Tense", section: "Portable", voltage: "CAT III 1000 V", specs: [["Mesures", "V, A, Ω, continuité"], ["Valeur", "Efficace vraie (TRMS)"], ["Affichage", "6000 points"]] },
  ],
  outillage: [
    { name: "Pince à sertir hydraulique", image: img("outillage"), brand: "Phoenix Electric", section: "10 à 300 mm²", voltage: "—", specs: [["Force", "12 t"], ["Matrices", "Hexagonales"], ["Livraison", "En coffret"]] },
    { name: "Coupe-câble à cliquet", image: img("outillage"), brand: "Phoenix Electric", section: "Jusqu’à Ø52 mm", voltage: "—", specs: [["Câbles", "Cuivre / aluminium"], ["Mécanisme", "À cliquet"], ["Usage", "Câbles armés exclus"]] },
    { name: "Jeu de tournevis isolés", image: img("outillage"), brand: "Phoenix Electric", section: "7 pièces", voltage: "1000 V", specs: [["Norme", "IEC 60900"], ["Empreintes", "Plat, cruciforme"], ["Manche", "Bi-matière"]] },
    { name: "Dénude-câble automatique", image: img("outillage"), brand: "Phoenix Electric", section: "0,2 à 6 mm²", voltage: "—", specs: [["Réglage", "Automatique"], ["Coupe", "Intégrée"], ["Usage", "Fils souples et rigides"]] },
    { name: "Clés et douilles isolées", image: img("outillage"), brand: "Phoenix Electric", section: "8 à 19 mm", voltage: "1000 V", specs: [["Norme", "IEC 60900"], ["Composition", "Clés, douilles, cliquet"], ["Rangement", "Trousse"]] },
  ],
};

// CONTENU EXEMPLE À REMPLACER — références et spécifications de démonstration à confirmer auprès de MERPORT.
export const products: Product[] = categories.flatMap((category, groupIndex) =>
  (seedsByCategory[category.slug] ?? []).map((seed, itemIndex) => ({
    slug: `${category.slug}-${itemIndex + 1}`,
    reference: `MP-${String(groupIndex + 1).padStart(2, "0")}${String(itemIndex + 1).padStart(3, "0")}`,
    name: seed.name,
    category: category.slug,
    brand: seed.brand,
    section: seed.section,
    voltage: seed.voltage,
    availability: "À confirmer" as const,
    image: seed.image,
    description: `${seed.name} de la famille ${category.name.toLowerCase()}. ${category.description} Tarif et délai communiqués sur devis, selon quantités et disponibilité du stock à Casablanca.`,
    specs: seed.specs,
  })),
);

export const productBySlug = (slug: string) => products.find((product) => product.slug === slug);
export const productsInCategory = (slug: string) => products.filter((product) => product.category === slug);
export const productCategoryName = (slug: string) => categories.find((category) => category.slug === slug)?.name ?? "Produits";
export const productBrands = Array.from(new Set(products.map((product) => product.brand))).sort();

export function searchProducts(list: Product[], query: string) {
  const normalize = (value: string) => value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return list;
  return list.filter((product) => {
    const haystack = normalize([product.name, product.reference, product.brand, product.section, product.voltage, ...product.specs.flat()].join(" "));
    return terms.every((term) => haystack.includes(term));
  });
}
