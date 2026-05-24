import type { MailTemplate, ContractDraft } from "./types";

export const MAIL_TEMPLATES: MailTemplate[] = [
  {
    id: "devis-envoi",
    label: "Envoi devis / contrat",
    subject: "Votre devis photo — {{shootingTitle}}",
    body: `Bonjour {{clientName}},

Suite à notre échange, je vous transmets le devis ainsi que le contrat de prestation photographique pour {{shootingTitle}}, prévu le {{shootingDate}}.

Vous trouverez en pièce jointe le document détaillant la prestation, les livrables, le prix et les conditions de cession des droits.

Je reste à votre disposition pour tout ajustement.

Cordialement,
{{photographerName}}
{{photographerBrand}}
{{photographerPhone}}`,
  },
  {
    id: "rappel-signature",
    label: "Rappel signature contrat",
    subject: "Rappel — Signature contrat {{shootingTitle}}",
    body: `Bonjour {{clientName}},

Je me permets de revenir vers vous concernant la signature du contrat pour la prestation {{shootingTitle}} du {{shootingDate}}.

Pour confirmer la réservation et bloquer la date, merci de me retourner le document signé accompagné du versement de l'acompte.

Bien cordialement,
{{photographerName}}`,
  },
  {
    id: "livraison",
    label: "Livraison galerie",
    subject: "Vos photos sont disponibles — {{shootingTitle}}",
    body: `Bonjour {{clientName}},

J'ai le plaisir de vous transmettre votre galerie privée pour {{shootingTitle}}.

Lien d'accès : [à compléter]
Code d'accès : [à compléter]

La galerie reste disponible 90 jours. Les fichiers haute définition sont téléchargeables individuellement ou en archive complète.

Au plaisir de vous revoir,
{{photographerName}}`,
  },
  {
    id: "facture",
    label: "Envoi facture solde",
    subject: "Facture — {{shootingTitle}}",
    body: `Bonjour {{clientName}},

Veuillez trouver ci-joint la facture correspondant au solde de la prestation {{shootingTitle}} réalisée le {{shootingDate}}.

Conformément au contrat, le règlement est attendu sous {{balanceDueDays}} jours.

Cordialement,
{{photographerName}}
SIRET : {{siret}}
TVA non applicable, article 293 B du CGI.`,
  },
  {
    id: "remerciements",
    label: "Remerciements post-livraison",
    subject: "Merci pour votre confiance",
    body: `Bonjour {{clientName}},

Merci pour la confiance accordée pour {{shootingTitle}}. Ce fut un plaisir de réaliser cette prestation.

N'hésitez pas à me solliciter pour vos prochains projets, et à recommander mon travail si vous en êtes satisfait.

Très belle continuation,
{{photographerName}}`,
  },
];

export function interpolate(template: string, draft: Partial<ContractDraft>): string {
  const map: Record<string, string> = {
    clientName: draft.client?.fullName ?? "[Nom client]",
    photographerName: draft.photographer?.fullName ?? "[Nom photographe]",
    photographerBrand: draft.photographer?.brandName ?? "",
    photographerPhone: draft.photographer?.phone ?? "",
    shootingTitle: draft.service?.title ?? "[Titre prestation]",
    shootingDate: draft.service?.date
      ? new Date(draft.service.date).toLocaleDateString("fr-FR")
      : "[Date]",
    balanceDueDays: String(draft.pricing?.balanceDueDays ?? 30),
    siret: draft.photographer?.siret ?? "[SIRET]",
  };
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => map[k] ?? `[${k}]`);
}

export function buildMailto(subject: string, body: string, to: string = ""): string {
  const params = new URLSearchParams();
  params.set("subject", subject);
  params.set("body", body);
  return `mailto:${to}?${params.toString().replace(/\+/g, "%20")}`;
}
