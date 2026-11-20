export type Brand = { name: string; specialty: string; origin: string; families: string[]; description: string };

// CONTENU EXEMPLE À CONFIRMER — liste des marques distribuées à valider avec MERPORT.
export const brands: Brand[] = [
  { name: "Mekaskablo", specialty: "Câbles et fils électriques", origin: "Turquie", families: ["cables-fils"], description: "Câbles d’énergie basse tension, souples et fils de câblage, fabriqués selon les normes IEC." },
  { name: "Borsan Kablo", specialty: "Câbles électriques", origin: "Turquie", families: ["cables-fils"], description: "Câbles armés, moyenne tension, télécom et fibre optique pour réseaux et infrastructures." },
  { name: "Tense", specialty: "Automatisme et contrôle", origin: "Turquie", families: ["automatisme-regulation", "comptage-mesure"], description: "Relais de contrôle, régulateurs, temporisations, compteurs et analyseurs de réseau." },
  { name: "Phoenix Electric", specialty: "Raccordement et connectique", origin: "Europe", families: ["raccordement-connectique", "outillage"], description: "Cosses, manchons, borniers, kits de terminaison et outillage de sertissage." },
  { name: "Volta", specialty: "Appareillage et éclairage", origin: "Europe", families: ["appareillage-distribution", "eclairage"], description: "Disjoncteurs, différentiels, interrupteurs, prises et éclairage LED technique." },
  { name: "PVC Pano", specialty: "Coffrets et cheminement", origin: "Turquie", families: ["cheminement-cables", "appareillage-distribution"], description: "Coffrets, tableaux, goulottes, gaines et chemins de câbles." },
];
