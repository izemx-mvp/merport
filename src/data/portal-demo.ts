// CONTENU EXEMPLE À REMPLACER — données de démonstration de l’Espace Client.
// Remplacées plus tard par les vraies données (ERP / back-office).

export type OrderStatus = "confirmee" | "preparation" | "expediee" | "livree";
export type QuoteStatus = "chiffrage" | "a_valider" | "accepte" | "refuse" | "expire";

export type Line = {
  name: string;
  reference: string;
  image: string;
  unit: "m" | "u" | "touret";
  qty: number;
  delivered?: number;
  unitPrice: number; // MAD HT
};

export type Order = {
  id: string;
  date: string; // ISO
  clientRef: string;
  status: OrderStatus;
  site: string;
  lines: Line[];
  steps: { status: OrderStatus; date?: string }[];
  documents: string[]; // document ids
};

export type Quote = {
  id: string;
  date: string;
  validUntil: string;
  status: QuoteStatus;
  subject: string;
  lines: Line[];
};

export type DocType = "facture" | "bl" | "devis";
export type PortalDocument = { id: string; type: DocType; label: string; date: string; amount?: number; ref: string };

const img = (n: string) => `/images/${n}.webp`;

export const demoClient = {
  company: "BTP Atlas SARL",
  contact: "Youssef Amrani",
  firstName: "Youssef",
  email: "achats@btpatlas.ma",
  phone: "06 61 00 00 00",
  ice: "001234567000089",
  city: "Casablanca",
  addresses: ["Siège · 45, bd Zerktouni, Casablanca", "Chantier Sidi Maarouf · Lot 12, Casablanca", "Chantier Bouskoura · Zone industrielle Ouled Saleh"],
  rep: { name: "Karim B.", role: "Commercial dédié", phone: "06 08 24 42 44" },
  discount: "Remise pro appliquée",
};

export const demoOrders: Order[] = [
  {
    id: "CMD-2026-0418",
    date: "2026-11-14",
    clientRef: "SIDI-MAAROUF-L12",
    status: "expediee",
    site: "Chantier Sidi Maarouf · Lot 12",
    lines: [
      { name: "Câble U-1000 R2V 3G2,5", reference: "MK-R2V-3G25", image: img("prod-cable-energie"), unit: "m", qty: 1500, delivered: 1500, unitPrice: 9.8 },
      { name: "Câble U-1000 R2V 5G16", reference: "MK-R2V-5G16", image: img("prod-cable-energie"), unit: "m", qty: 300, delivered: 200, unitPrice: 112.5 },
      { name: "Chemin de câbles perforé 200x50", reference: "PP-CDC-200", image: img("prod-chemin-cable"), unit: "m", qty: 120, delivered: 120, unitPrice: 86 },
    ],
    steps: [
      { status: "confirmee", date: "2026-11-14" },
      { status: "preparation", date: "2026-11-15" },
      { status: "expediee", date: "2026-11-18" },
      { status: "livree" },
    ],
    documents: ["BL-2026-0911"],
  },
  {
    id: "CMD-2026-0412",
    date: "2026-11-10",
    clientRef: "BOUSKOURA-TGBT",
    status: "preparation",
    site: "Chantier Bouskoura · ZI Ouled Saleh",
    lines: [
      { name: "Disjoncteur 1P+N 16 A", reference: "TN-1PN16", image: img("prod-disjoncteurs"), unit: "u", qty: 48, unitPrice: 39 },
      { name: "Tableau électrique 2 rangées", reference: "TN-TB2R", image: img("prod-tableau"), unit: "u", qty: 6, unitPrice: 420 },
      { name: "Interrupteur différentiel 40 A 30 mA", reference: "TN-ID40", image: img("prod-disjoncteurs"), unit: "u", qty: 12, unitPrice: 265 },
    ],
    steps: [{ status: "confirmee", date: "2026-11-10" }, { status: "preparation", date: "2026-11-12" }, { status: "expediee" }, { status: "livree" }],
    documents: [],
  },
  {
    id: "CMD-2026-0397",
    date: "2026-10-28",
    clientRef: "SIEGE-ECLAIRAGE",
    status: "livree",
    site: "Siège · Casablanca",
    lines: [
      { name: "Panneau LED 60x60 40 W", reference: "PX-PL40", image: img("prod-panneau-led"), unit: "u", qty: 80, delivered: 80, unitPrice: 185 },
      { name: "Réglette LED étanche IP65 2x36 W", reference: "PX-RE236", image: img("prod-reglette-etanche"), unit: "u", qty: 24, delivered: 24, unitPrice: 210 },
    ],
    steps: [
      { status: "confirmee", date: "2026-10-28" },
      { status: "preparation", date: "2026-10-29" },
      { status: "expediee", date: "2026-10-31" },
      { status: "livree", date: "2026-11-02" },
    ],
    documents: ["BL-2026-0874", "FAC-2026-1192"],
  },
  {
    id: "CMD-2026-0381",
    date: "2026-10-15",
    clientRef: "SIDI-MAAROUF-L12",
    status: "livree",
    site: "Chantier Sidi Maarouf · Lot 12",
    lines: [
      { name: "Fil H07V-U 1,5 mm² bleu", reference: "MK-H07V-15", image: img("prod-fils"), unit: "touret", qty: 20, delivered: 20, unitPrice: 245 },
      { name: "Goulotte PVC 60x40", reference: "PP-GT-6040", image: img("prod-goulotte-gaine"), unit: "m", qty: 200, delivered: 200, unitPrice: 24 },
      { name: "Boîte de dérivation étanche IP65", reference: "VL-BD-IP65", image: img("prod-raccordement"), unit: "u", qty: 60, delivered: 60, unitPrice: 32 },
    ],
    steps: [
      { status: "confirmee", date: "2026-10-15" },
      { status: "preparation", date: "2026-10-16" },
      { status: "expediee", date: "2026-10-18" },
      { status: "livree", date: "2026-10-19" },
    ],
    documents: ["BL-2026-0841", "FAC-2026-1150"],
  },
  {
    id: "CMD-2026-0420",
    date: "2026-11-18",
    clientRef: "SIEGE-OUTILLAGE",
    status: "confirmee",
    site: "Siège · Casablanca",
    lines: [
      { name: "Pince isolée 1000 V", reference: "VL-PI1000", image: img("prod-outillage"), unit: "u", qty: 15, unitPrice: 145 },
      { name: "Compteur d’énergie modulaire", reference: "TN-CE-MOD", image: img("prod-mesure"), unit: "u", qty: 10, unitPrice: 390 },
    ],
    steps: [{ status: "confirmee", date: "2026-11-18" }, { status: "preparation" }, { status: "expediee" }, { status: "livree" }],
    documents: [],
  },
];

export const demoQuotes: Quote[] = [
  {
    id: "DV-2026-3629",
    date: "2026-11-17",
    validUntil: "2026-12-01",
    status: "a_valider",
    subject: "Éclairage entrepôt Bouskoura",
    lines: [
      { name: "High-bay LED 150 W", reference: "PX-HB150", image: img("prod-highbay"), unit: "u", qty: 40, unitPrice: 690 },
      { name: "Chemin de câbles perforé 200x50", reference: "PP-CDC-200", image: img("prod-chemin-cable"), unit: "m", qty: 180, unitPrice: 86 },
      { name: "Câble souple H07RN-F 4G6", reference: "MK-H07-4G6", image: img("prod-cable-souple"), unit: "m", qty: 400, unitPrice: 48 },
    ],
  },
  {
    id: "DV-2026-3641",
    date: "2026-11-19",
    validUntil: "2026-12-03",
    status: "chiffrage",
    subject: "Liste chantier Sidi Maarouf — lot 2",
    lines: [
      { name: "Câble U-1000 R2V 5G16", reference: "MK-R2V-5G16", image: img("prod-cable-energie"), unit: "m", qty: 600, unitPrice: 0 },
      { name: "Disjoncteur 1P+N 16 A", reference: "TN-1PN16", image: img("prod-disjoncteurs"), unit: "u", qty: 96, unitPrice: 0 },
    ],
  },
  {
    id: "DV-2026-3587",
    date: "2026-11-08",
    validUntil: "2026-11-22",
    status: "accepte",
    subject: "TGBT Bouskoura",
    lines: [
      { name: "Tableau électrique 2 rangées", reference: "TN-TB2R", image: img("prod-tableau"), unit: "u", qty: 6, unitPrice: 420 },
      { name: "Disjoncteur 1P+N 16 A", reference: "TN-1PN16", image: img("prod-disjoncteurs"), unit: "u", qty: 48, unitPrice: 39 },
    ],
  },
  {
    id: "DV-2026-3502",
    date: "2026-10-12",
    validUntil: "2026-10-26",
    status: "expire",
    subject: "Câbles FTP bureaux",
    lines: [{ name: "Câble FTP Cat6", reference: "BK-FTP6", image: img("prod-telecom-fibre"), unit: "touret", qty: 4, unitPrice: 1450 }],
  },
];

export const demoDocuments: PortalDocument[] = [
  { id: "FAC-2026-1192", type: "facture", label: "Facture", date: "2026-11-02", amount: 19840, ref: "CMD-2026-0397" },
  { id: "BL-2026-0911", type: "bl", label: "Bon de livraison (partiel)", date: "2026-11-18", ref: "CMD-2026-0418" },
  { id: "BL-2026-0874", type: "bl", label: "Bon de livraison", date: "2026-11-02", ref: "CMD-2026-0397" },
  { id: "FAC-2026-1150", type: "facture", label: "Facture", date: "2026-10-19", amount: 11620, ref: "CMD-2026-0381" },
  { id: "BL-2026-0841", type: "bl", label: "Bon de livraison", date: "2026-10-19", ref: "CMD-2026-0381" },
  { id: "DV-2026-3629", type: "devis", label: "Devis", date: "2026-11-17", amount: 62280, ref: "Éclairage entrepôt Bouskoura" },
  { id: "DV-2026-3587", type: "devis", label: "Devis", date: "2026-11-08", amount: 4392, ref: "TGBT Bouskoura" },
];