import type { ContractDraft } from "./types";

export type TipLevel = "info" | "warn";

export interface Tip {
  id: string;
  level: TipLevel;
  title: string;
  message: string;
  ref?: string;
}

export function evalTips(d: ContractDraft): Tip[] {
  const tips: Tip[] = [];
  const occ = d.photographer.status === "occasionnel";

  if (occ && d.type === "b2b") {
    tips.push({
      id: "occ-b2b-conflict",
      level: "warn",
      title: "Statut occasionnel × B2B",
      message: "Le B2B exige un SIRET et inscription URSSAF. Tu ne pourras pas facturer une entreprise sans changer de statut.",
      ref: "Art. R.123-237 Code commerce",
    });
  }

  if (occ && d.pricing && d.pricing.amount > 1500) {
    tips.push({
      id: "occ-plafond",
      level: "warn",
      title: "Plafond occasionnel",
      message: `Cette prestation à ${d.pricing.amount.toLocaleString("fr-FR")} € + autres contrats ne doit pas dépasser 3 000 €/an, sinon inscription URSSAF obligatoire.`,
      ref: "URSSAF artistes-auteurs",
    });
  }

  if (occ && d.cession.destinations.includes("commerciale")) {
    tips.push({
      id: "occ-commercial",
      level: "warn",
      title: "Cession commerciale + occasionnel",
      message: "Vendre des droits commerciaux régulièrement peut être requalifié en activité habituelle. Risque URSSAF rétroactif.",
    });
  }

  if (
    d.cession.scope === "exclusive" &&
    d.cession.territory === "monde" &&
    d.cession.duration === "duree-legale"
  ) {
    tips.push({
      id: "cession-max",
      level: "warn",
      title: "Cession totale et perpétuelle",
      message: "Exclusive + monde + 70 ans = le client peut tout faire sans te recontacter. Vérifie que la rémunération est à la hauteur.",
      ref: "Art. L.131-3 CPI",
    });
  }

  if (d.type === "tfp" && d.cession.destinations.includes("commerciale")) {
    tips.push({
      id: "tfp-commercial",
      level: "warn",
      title: "TFP × usage commercial",
      message: "Un TFP ne peut pas céder de droits commerciaux. Sinon ce n'est plus un TFP, c'est une commande payée (anti-donation Art. 931).",
      ref: "Art. 931 Code civil",
    });
  }

  if (d.type === "b2c" && d.service.date && d.signatureDate) {
    const shoot = new Date(d.service.date).getTime();
    const sign = new Date(d.signatureDate).getTime();
    const diffDays = (shoot - sign) / 86400000;
    if (diffDays >= 0 && diffDays < 14) {
      tips.push({
        id: "b2c-shoot-14d",
        level: "warn",
        title: "Shoot dans 14 jours",
        message: `Prestation J+${Math.round(diffDays)}. Le client doit demander expressément l'exécution avant fin du délai de rétractation, sinon il peut shooter puis se rétracter.`,
        ref: "Art. L.221-25 Code consommation",
      });
    }
  }

  if (d.pricing && d.pricing.deposit.type === "percent" && d.pricing.deposit.value < 20 && d.type !== "tfp") {
    tips.push({
      id: "low-deposit",
      level: "info",
      title: "Acompte faible",
      message: "Un acompte inférieur à 20 % expose au risque d'annulation sans rémunération. Recommandé 30-50 %.",
    });
  }

  if (d.type === "tfp" && (d.tfpCounterparts?.additionalCommitments?.filter(Boolean).length ?? 0) === 0) {
    tips.push({
      id: "tfp-no-counterparts",
      level: "warn",
      title: "TFP sans contreparties",
      message: "Sans engagements concrets du modèle, le contrat peut être requalifié en donation gratuite = nul.",
      ref: "Art. 931 Code civil",
    });
  }

  if (d.cession.duration === "duree-legale" && d.niche !== "artistique") {
    tips.push({
      id: "duree-legale-non-art",
      level: "info",
      title: "Durée légale 70 ans",
      message: `Cession à vie utile pour vente de tirage d'art uniquement. Pour ${d.niche}, 3-5 ans suffisent généralement.`,
    });
  }

  if (!d.photographer.includeSiret && d.photographer.status === "pro") {
    tips.push({
      id: "siret-disabled-pro",
      level: "warn",
      title: "SIRET désactivé en statut pro",
      message: "Mention obligatoire sur facture si tu es micro-entrepreneur ou société. Réactive le chip SIRET dans Identités.",
    });
  }

  if ((d.niche === "scolaire" || d.niche === "mariage") && !d.rgpdMinor) {
    tips.push({
      id: "minors-rgpd",
      level: "info",
      title: "Mineurs probables",
      message: "Pour scolaire/mariage, consentement écrit des 2 parents requis (Art. 8 RGPD). Active l'annexe RGPD mineurs.",
    });
  }

  if (d.niche === "drone") {
    tips.push({
      id: "drone-easa",
      level: "info",
      title: "Drone : nouveau cadre EASA",
      message: "Depuis 01/01/2026, scénarios français S1/S2/S3 caducs. Cadre EASA STS-01/STS-02 + brevet CATT + assurance RC aérienne.",
      ref: "EASA STS-01/STS-02",
    });
  }

  return tips;
}
