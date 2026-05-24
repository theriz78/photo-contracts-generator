import type { ContractDraft } from "./types";

export type CheckStatus = "pass" | "fail" | "warn";

export interface ComplianceCheck {
  id: string;
  status: CheckStatus;
  label: string;
  detail: string;
  ref?: string;
}

export function runCompliance(d: ContractDraft): ComplianceCheck[] {
  const checks: ComplianceCheck[] = [];

  const sirenOk = d.photographer.includeSiret && /^\d{9}(\d{5})?$/.test(d.photographer.siret.replace(/\s+/g, ""));
  checks.push({
    id: "siret",
    label: "SIRET valide (14 chiffres)",
    status: d.photographer.includeSiret ? (sirenOk ? "pass" : "fail") : "warn",
    detail: d.photographer.includeSiret
      ? sirenOk
        ? "Format SIRET correct (9 SIREN + 5 NIC)."
        : "SIRET incomplet ou format invalide. Obligatoire pour facturation."
      : "SIRET désactivé. Recommandé pour facturation et mentions légales B2B.",
    ref: "Art. R. 123-237 Code commerce",
  });

  const cessionRights = d.cession.rights.length >= 1;
  const cessionDests = d.cession.destinations.length >= 1;
  const cessionSupports = d.cession.supports.length >= 1;
  const cessionL131_3 = cessionRights && cessionDests && cessionSupports && !!d.cession.territory && !!d.cession.duration;
  checks.push({
    id: "cession-l131-3",
    label: "Cession L.131-3 CPI complète",
    status: cessionL131_3 ? "pass" : "fail",
    detail: cessionL131_3
      ? `${d.cession.rights.length} droits, ${d.cession.destinations.length} destinations, ${d.cession.supports.length} supports, ${d.cession.territory}, ${d.cession.duration}.`
      : "Au moins un élément manquant (droits / destinations / supports / territoire / durée). Clause générique = nulle.",
    ref: "Art. L.131-3 CPI",
  });

  checks.push({
    id: "credit-mention",
    label: "Mention de paternité (crédit photo)",
    status: d.cession.creditMention.trim().length > 2 ? "pass" : "warn",
    detail: d.cession.creditMention.trim().length > 2
      ? `Mention obligatoire spécifiée : "${d.cession.creditMention}".`
      : "Aucun crédit spécifié. Risque d'atteinte au droit moral inaliénable.",
    ref: "Art. L.121-1 CPI",
  });

  checks.push({
    id: "right-to-image",
    label: "Annexe droit à l'image",
    status: d.rightToImageAnnex ? "pass" : "warn",
    detail: d.rightToImageAnnex
      ? "Annexe activée. Consentement écrit personnes photographiées."
      : "Annexe désactivée. Risque si personnes identifiables sur photos.",
    ref: "Art. 9 Code civil + RGPD",
  });

  if (d.type === "b2b") {
    const hasLatePenalties = d.customClauses.some((c) => c.id === "penalites-retard" && c.enabled);
    checks.push({
      id: "b2b-penalties",
      label: "Pénalités B2B L.441-10 activées",
      status: hasLatePenalties ? "pass" : "warn",
      detail: hasLatePenalties
        ? "Pénalités de retard + indemnité 40 € activées."
        : "Recommandé pour B2B. 3x taux intérêt légal + indemnité 40 €.",
      ref: "Art. L.441-10 Code commerce",
    });
  }

  if (d.type === "b2c") {
    const hasRetractation = d.retractationB2C && d.customClauses.some((c) => c.id === "retractation-b2c" && c.enabled);
    checks.push({
      id: "b2c-retractation",
      label: "Rétractation 14 jours B2C",
      status: hasRetractation ? "pass" : "fail",
      detail: hasRetractation
        ? "Clause de rétractation 14 jours activée."
        : "Obligatoire B2C distance. Sans cette clause, rétractation extensible à 12 mois.",
      ref: "Art. L.221-18 Code consommation",
    });

    if (d.service.date && d.signatureDate) {
      const shoot = new Date(d.service.date).getTime();
      const sign = new Date(d.signatureDate).getTime();
      const diffDays = (shoot - sign) / (1000 * 60 * 60 * 24);
      if (diffDays < 14 && diffDays >= 0) {
        checks.push({
          id: "b2c-express-shoot",
          label: "Demande expresse écrite (shoot < 14 jours)",
          status: "warn",
          detail: `Prestation à J+${Math.round(diffDays)} après signature. Le Client doit demander expressément l'exécution anticipée par écrit, sinon il peut shooter puis se rétracter sous 14j.`,
          ref: "Art. L.221-25 Code consommation",
        });
      }
    }
  }

  if (d.type === "tfp") {
    const tfpClauseEnabled = d.customClauses.some((c) => c.id === "tfp-contreparties" && c.enabled);
    const hasCounterparts = (d.tfpCounterparts?.additionalCommitments?.filter(Boolean).length ?? 0) > 0;
    checks.push({
      id: "tfp-counterparts",
      label: "Contreparties TFP exigibles (anti-donation Art. 931)",
      status: tfpClauseEnabled && hasCounterparts ? "pass" : "fail",
      detail: tfpClauseEnabled && hasCounterparts
        ? `${d.tfpCounterparts?.additionalCommitments?.filter(Boolean).length} engagements concrets + crédit + exclusivité.`
        : "Sans contreparties réelles et exigibles, le contrat peut être requalifié en donation = nul sans acte notarié.",
      ref: "Art. 931 Code civil",
    });
  }

  checks.push({
    id: "tva-mention",
    label: "Mention TVA micro-entrepreneur",
    status: d.photographer.tvaExemption ? "pass" : "warn",
    detail: d.photographer.tvaExemption
      ? "Mention 293 B CGI active (bascule L. 223 CIBS au 01/09/2026 à anticiper)."
      : "Si micro-entrepreneur franchise TVA, mention obligatoire sur factures/contrats.",
    ref: "Art. 293 B CGI / L. 223 CIBS",
  });

  const minorRisk = d.niche === "scolaire" || d.niche === "portrait" || d.niche === "mariage";
  if (minorRisk) {
    checks.push({
      id: "rgpd-minor",
      label: "Consentement parental mineurs (RGPD Art. 8)",
      status: d.rgpdMinor ? "pass" : "warn",
      detail: d.rgpdMinor
        ? "Annexe RGPD mineurs activée."
        : `Niche ${d.niche} : forte probabilité mineurs photographiés. Consentement écrit des 2 parents requis.`,
      ref: "Art. 8 RGPD + Art. 9 Code civil",
    });
  }

  const sigFilled = !!d.signaturePlace && !!d.signatureDate;
  checks.push({
    id: "signature-filled",
    label: "Lieu et date de signature renseignés",
    status: sigFilled ? "pass" : "fail",
    detail: sigFilled
      ? `${d.signaturePlace}, ${d.signatureDate}.`
      : "Champs obligatoires pour contrat valide.",
    ref: "Art. 1366 Code civil",
  });

  return checks;
}

export function summary(checks: ComplianceCheck[]) {
  return {
    pass: checks.filter((c) => c.status === "pass").length,
    warn: checks.filter((c) => c.status === "warn").length,
    fail: checks.filter((c) => c.status === "fail").length,
    total: checks.length,
    blockers: checks.filter((c) => c.status === "fail").length === 0,
  };
}
