import type { ContractDraft } from "./types";
import { DEFAULT_CLAUSES } from "./clauses-stub";

export interface Preset {
  id: string;
  title: string;
  tagline: string;
  description: string;
  apply: (current: ContractDraft) => ContractDraft;
}

const baseClauses = () => DEFAULT_CLAUSES.map((c) => ({ ...c }));

export const PRESETS: Preset[] = [
  {
    id: "corporate-b2b",
    title: "Corporate B2B",
    tagline: "Entreprise · Portrait LinkedIn · Équipe",
    description: "B2B, cession commerciale 3 ans monde, pénalités L.441-10, NDA optionnel, livraison J+14.",
    apply: (d) => ({
      ...d,
      type: "b2b",
      niche: "corporate",
      service: {
        ...d.service,
        niche: "corporate",
        deliverables: { ...d.service.deliverables, retouchedCount: 25, deliveryDeadlineDays: 14 },
      },
      cession: {
        rights: ["reproduction", "representation"],
        scope: "non-exclusive",
        destinations: ["commerciale", "rp"],
        territory: "monde",
        duration: "3-ans",
        customDuration: "",
        supports: ["print", "web", "social"],
        creditMention: "© {{photographerName}}",
      },
      pricing: { mode: "demi-jour", amount: 1200, currency: "EUR", deposit: { type: "percent", value: 30 }, balanceDueDays: 30, travelFee: 0, rushFee: 0 },
      penalties: { latePaymentEnabled: true, latePaymentRate: "3 fois le taux d'intérêt légal", recoveryFlatFee: 40, cancellationGraduated: false },
      customClauses: baseClauses().map((c) =>
        c.id === "confidentialite" || c.id === "penalites-retard" ? { ...c, enabled: true } : c,
      ),
    }),
  },
  {
    id: "portrait-b2c",
    title: "Portrait B2C",
    tagline: "Particulier · Famille · Grossesse",
    description: "B2C, rétractation 14 jours, 20 photos retouchées, droit à l'image annexe, livraison J+30.",
    apply: (d) => ({
      ...d,
      type: "b2c",
      niche: "portrait",
      client: { ...d.client, legalForm: "personne-physique" },
      service: {
        ...d.service,
        niche: "portrait",
        deliverables: { ...d.service.deliverables, retouchedCount: 20, deliveryDeadlineDays: 30 },
      },
      cession: {
        rights: ["reproduction"],
        scope: "non-exclusive",
        destinations: ["editoriale"],
        territory: "monde",
        duration: "duree-legale",
        customDuration: "",
        supports: ["print", "web", "social"],
        creditMention: "© {{photographerName}}",
      },
      pricing: { mode: "forfait", amount: 380, currency: "EUR", deposit: { type: "percent", value: 30 }, balanceDueDays: 15, travelFee: 0, rushFee: 0 },
      retractationB2C: true,
      rightToImageAnnex: true,
      customClauses: baseClauses().map((c) =>
        c.id === "retractation-b2c" ? { ...c, enabled: true } : c,
      ),
    }),
  },
  {
    id: "tfp-collab",
    title: "Collaboration TFP",
    tagline: "Modèle · Time For Print · Contreparties",
    description: "Licence anti-donation Art. 931, 15 retouchées, exclusivité 6 mois, crédit obligatoire.",
    apply: (d) => ({
      ...d,
      type: "tfp",
      niche: "mode",
      client: { ...d.client, legalForm: "personne-physique" },
      service: {
        ...d.service,
        niche: "mode",
        deliverables: { ...d.service.deliverables, retouchedCount: 15, deliveryDeadlineDays: 21 },
      },
      tfpCounterparts: {
        retouchedCount: 15,
        modelUsageRights: "Usage non-commercial portfolio personnel + réseaux sociaux personnels.",
        creditMentionRequired: true,
        exclusivityMonths: 6,
        socialTagging: true,
        additionalCommitments: [
          "Disponibilité minimum 4 heures pour la séance",
          "Mise à disposition de tenues personnelles selon brief",
        ],
      },
      cession: {
        rights: ["reproduction", "representation"],
        scope: "non-exclusive",
        destinations: ["editoriale"],
        territory: "monde",
        duration: "duree-legale",
        customDuration: "",
        supports: ["web", "social", "print"],
        creditMention: "© {{photographerName}}",
      },
      customClauses: baseClauses().map((c) =>
        c.id === "tfp-contreparties" ? { ...c, enabled: true } : c,
      ),
    }),
  },
  {
    id: "artistique",
    title: "Artistique",
    tagline: "Vente tirage limité · Collectionneur",
    description: "Tirage limité signé numéroté, droit de suite L.122-8 CPI, certificat d'authenticité.",
    apply: (d) => ({
      ...d,
      type: "b2c",
      niche: "artistique",
      client: { ...d.client, legalForm: "personne-physique" },
      service: {
        ...d.service,
        niche: "artistique",
        title: d.service.title || "Vente tirage d'art limité",
        deliverables: { ...d.service.deliverables, retouchedCount: 1, deliveryDeadlineDays: 30, formats: ["tirages"] },
      },
      cession: {
        rights: ["reproduction"],
        scope: "non-exclusive",
        destinations: ["archives"],
        territory: "monde",
        duration: "duree-legale",
        customDuration: "",
        supports: ["print"],
        creditMention: "© {{photographerName}}, tirage signé numéroté",
      },
      pricing: { mode: "forfait", amount: 850, currency: "EUR", deposit: { type: "percent", value: 50 }, balanceDueDays: 15, travelFee: 0, rushFee: 0 },
      customClauses: baseClauses(),
    }),
  },
  {
    id: "boudoir",
    title: "Boudoir",
    tagline: "B2C particulier · Confidentialité renforcée",
    description: "Séance privée, non-publication portfolio sans accord écrit, archivage sécurisé fichiers.",
    apply: (d) => ({
      ...d,
      type: "b2c",
      niche: "boudoir",
      client: { ...d.client, legalForm: "personne-physique" },
      service: {
        ...d.service,
        niche: "boudoir",
        deliverables: { ...d.service.deliverables, retouchedCount: 15, deliveryDeadlineDays: 21 },
      },
      cession: {
        rights: ["reproduction"],
        scope: "non-exclusive",
        destinations: ["archives"],
        territory: "monde",
        duration: "duree-legale",
        customDuration: "",
        supports: ["print"],
        creditMention: "",
      },
      pricing: { mode: "forfait", amount: 580, currency: "EUR", deposit: { type: "percent", value: 30 }, balanceDueDays: 15, travelFee: 0, rushFee: 0 },
      confidentiality: true,
      rightToImageAnnex: true,
      retractationB2C: true,
      customClauses: baseClauses().map((c) =>
        c.id === "confidentialite" || c.id === "retractation-b2c" ? { ...c, enabled: true } : c,
      ),
    }),
  },
];
