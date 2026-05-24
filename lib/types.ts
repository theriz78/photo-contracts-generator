export type ContractType = "b2b" | "b2c" | "tfp";

export type ContractNiche =
  | "mariage"
  | "corporate"
  | "mode"
  | "immobilier"
  | "drone"
  | "evenementiel"
  | "portrait"
  | "boudoir"
  | "scolaire"
  | "sport"
  | "produit"
  | "animalier"
  | "artistique"
  | "autre";

export type CessionScope = "exclusive" | "non-exclusive";
export type CessionDestination =
  | "commerciale"
  | "editoriale"
  | "interne"
  | "publicitaire"
  | "rp"
  | "archives";
export type CessionTerritory = "france" | "ue" | "monde";
export type CessionDuration =
  | "12-mois"
  | "3-ans"
  | "5-ans"
  | "10-ans"
  | "duree-legale";
export type CessionSupport =
  | "print"
  | "web"
  | "social"
  | "tv"
  | "cinema"
  | "out-of-home";

export type PhotographerStatus = "pro" | "occasionnel";

export interface Photographer {
  status: PhotographerStatus;
  fullName: string;
  brandName?: string;
  logoDataUrl?: string;
  siret: string;
  rcs?: string;
  address: string;
  email: string;
  phone: string;
  iban?: string;
  bic?: string;
  insurance?: string;
  microEntrepreneur: boolean;
  tvaExemption: boolean;
  includeSiret: boolean;
  includeRcs: boolean;
  includeIban: boolean;
  includeInsurance: boolean;
}

export interface Client {
  legalForm: "personne-morale" | "personne-physique";
  fullName: string;
  representative?: string;
  siret?: string;
  birthDate?: string;
  address: string;
  email: string;
  phone?: string;
}

export interface Cession {
  rights: ("reproduction" | "representation" | "adaptation")[];
  scope: CessionScope;
  destinations: CessionDestination[];
  territory: CessionTerritory;
  duration: CessionDuration;
  customDuration?: string;
  supports: CessionSupport[];
  creditMention: string;
}

export interface ServiceDetails {
  niche: ContractNiche;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location: string;
  description: string;
  deliverables: {
    rawCount?: number;
    retouchedCount?: number;
    formats: ("hd-jpg" | "raw" | "tirages" | "album" | "video" | "galerie-online")[];
    deliveryDeadlineDays: number;
    deliveryMethod: "galerie-privee" | "transfert" | "support-physique";
  };
}

export interface Pricing {
  mode: "forfait" | "horaire" | "demi-jour" | "jour";
  amount: number;
  currency: "EUR";
  deposit: { type: "percent" | "fixed"; value: number };
  balanceDueDays: number;
  travelFee?: number;
  rushFee?: number;
}

export interface Penalties {
  latePaymentEnabled: boolean;
  latePaymentRate: string;
  recoveryFlatFee: number;
  cancellationGraduated: boolean;
  cancellationSchedule?: {
    moreThan6Months: number;
    between3And6Months: number;
    between1And3Months: number;
    lessThan1Month: number;
  };
}

export interface TFPCounterparts {
  retouchedCount: number;
  modelUsageRights: string;
  creditMentionRequired: boolean;
  exclusivityMonths: number;
  socialTagging: boolean;
  additionalCommitments: string[];
}

export interface ClauseToggle {
  id: string;
  label: string;
  description: string;
  category: "obligatoire" | "recommandee" | "optionnelle";
  enabled: boolean;
  body: string;
  appliesTo: ContractType[];
}

export interface ContractDraft {
  id: string;
  type: ContractType;
  niche: ContractNiche;
  language: "fr" | "en";
  photographer: Photographer;
  client: Client;
  service: ServiceDetails;
  pricing?: Pricing;
  tfpCounterparts?: TFPCounterparts;
  cession: Cession;
  penalties: Penalties;
  rightToImageAnnex: boolean;
  confidentiality: boolean;
  rgpdMinor: boolean;
  retractationB2C: boolean;
  forceMajeure: boolean;
  customClauses: ClauseToggle[];
  signaturePlace: string;
  signatureDate: string;
  createdAt: number;
  updatedAt: number;
}

export interface MailTemplate {
  id: "devis-envoi" | "rappel-signature" | "livraison" | "facture" | "remerciements";
  label: string;
  subject: string;
  body: string;
}
