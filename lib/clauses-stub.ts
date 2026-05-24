/**
 * STUB clauses — replaced by deep-research output post-S88.
 * Source : research/CONTRATS-PHOTOGRAPHE-DEEP-S88-2026-05-24.md
 */
import type { ClauseToggle } from "./types";

export const DEFAULT_CLAUSES: ClauseToggle[] = [
  {
    id: "objet",
    label: "Objet du contrat",
    description: "Définit la prestation photo et son cadre.",
    category: "obligatoire",
    enabled: true,
    appliesTo: ["b2b", "b2c", "tfp"],
    body:
      "Le présent contrat a pour objet la réalisation par le Photographe d'une prestation photographique au profit du Client, ainsi que la cession des droits d'exploitation des photographies dans les conditions définies ci-après.",
  },
  {
    id: "prestation",
    label: "Description de la prestation",
    description: "Date, lieu, durée, type de shoot, livrables attendus.",
    category: "obligatoire",
    enabled: true,
    appliesTo: ["b2b", "b2c", "tfp"],
    body:
      "La prestation se déroulera le {{date}} à {{location}}. Elle comprend {{description}}. Le Photographe livrera {{retouchedCount}} photographies retouchées au format numérique haute définition, dans un délai de {{deliveryDeadlineDays}} jours suivant la date de prestation.",
  },
  {
    id: "prix",
    label: "Prix et modalités de paiement",
    description: "Montant, acompte, solde, méthode.",
    category: "obligatoire",
    enabled: true,
    appliesTo: ["b2b", "b2c"],
    body:
      "Le prix de la prestation est fixé à {{amount}}. Un acompte de {{depositValue}} sera versé à la réservation. Le solde sera réglé dans un délai de {{balanceDueDays}} jours suivant la livraison, par virement bancaire (IBAN : {{iban}}).",
  },
  {
    id: "cession-droits",
    label: "Cession des droits d'auteur (Art. L.131-3 CPI)",
    description:
      "Détaille chaque droit cédé, étendue, destination, territoire, durée, supports. Mention distincte obligatoire.",
    category: "obligatoire",
    enabled: true,
    appliesTo: ["b2b", "b2c", "tfp"],
    body:
      "Conformément à l'article L.131-3 du Code de la propriété intellectuelle, le Photographe cède au Client les droits suivants sur les photographies livrées : {{rights}}. Cette cession est {{scope}}, pour les destinations suivantes : {{destinations}}. Elle est consentie pour le territoire : {{territory}}, pour une durée de {{duration}}, sur les supports suivants : {{supports}}. Le droit moral du Photographe reste inaliénable et imprescriptible (Art. L.121-1 CPI). Toute exploitation devra mentionner la signature : {{creditMention}}.",
  },
  {
    id: "droit-image",
    label: "Droit à l'image des personnes photographiées",
    description: "Article 9 Code civil. Annexe d'autorisation jointe.",
    category: "obligatoire",
    enabled: true,
    appliesTo: ["b2b", "b2c", "tfp"],
    body:
      "Le Client garantit que toutes les personnes photographiées ont donné leur consentement préalable, libre, éclairé et écrit à la captation et à l'exploitation de leur image, conformément à l'article 9 du Code civil et au Règlement Général sur la Protection des Données. Pour les mineurs, l'autorisation des deux parents ou du représentant légal est obligatoire. Un modèle d'autorisation est joint en annexe.",
  },
  {
    id: "penalites-retard",
    label: "Pénalités de retard B2B (Art. L.441-10 Code commerce)",
    description: "3x taux d'intérêt légal + indemnité forfaitaire 40 €.",
    category: "obligatoire",
    enabled: true,
    appliesTo: ["b2b"],
    body:
      "En cas de retard de paiement, des pénalités de retard sont applicables de plein droit, calculées au taux égal à trois fois le taux d'intérêt légal en vigueur. Une indemnité forfaitaire pour frais de recouvrement d'un montant de 40 euros sera également due, conformément aux articles L.441-10 et D.441-5 du Code de commerce.",
  },
  {
    id: "retractation-b2c",
    label: "Droit de rétractation 14 jours (B2C distance)",
    description: "Code conso L.221-18. Exception si prestation commencée avec accord exprès.",
    category: "obligatoire",
    enabled: true,
    appliesTo: ["b2c"],
    body:
      "En application des articles L.221-18 et suivants du Code de la consommation, le Client consommateur dispose d'un délai de quatorze (14) jours calendaires à compter de la signature du présent contrat pour exercer son droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités. Toutefois, si le Client demande expressément l'exécution de la prestation avant l'expiration de ce délai, il reconnaît perdre son droit de rétractation une fois la prestation pleinement exécutée.",
  },
  {
    id: "tfp-contreparties",
    label: "Licence d'utilisation contre contreparties (anti-donation Art. 931)",
    description:
      "Contreparties non-financières réelles et exigibles, jamais 'cession gratuite' (parade Art 931 C. civ).",
    category: "obligatoire",
    enabled: true,
    appliesTo: ["tfp"],
    body:
      "Le présent contrat ne constitue pas une cession gratuite de droits d'auteur, mais une licence d'utilisation mutuelle consentie par chacune des parties en contrepartie d'engagements réels et exigibles. Le Modèle s'engage à : {{additionalCommitments}}. En contrepartie, le Photographe livre {{retouchedCount}} photographies retouchées avec droit d'usage non-commercial pour portfolio personnel du Modèle, avec mention obligatoire du crédit photo lors de toute publication, et exclusivité temporaire d'usage portfolio pendant {{exclusivityMonths}} mois.",
  },
  {
    id: "rgpd-mineur",
    label: "RGPD : consentement parental mineur",
    description: "Art 8 RGPD, photos enfants requièrent autorisation parentale écrite.",
    category: "recommandee",
    enabled: false,
    appliesTo: ["b2b", "b2c", "tfp"],
    body:
      "Pour toute personne mineure photographiée, le consentement écrit des deux parents ou du représentant légal exerçant l'autorité parentale est obligatoire (Art. 8 RGPD). Une annexe spécifique sera signée pour chaque mineur identifiable sur les photographies.",
  },
  {
    id: "confidentialite",
    label: "Confidentialité (NDA)",
    description: "Recommandée B2B sensible (mode, corpo dirigeants, événements VIP).",
    category: "recommandee",
    enabled: false,
    appliesTo: ["b2b"],
    body:
      "Les parties s'engagent à conserver strictement confidentielles toutes les informations échangées dans le cadre de l'exécution du présent contrat, et notamment les images non-livrées, brutes ou rejetées. Cette obligation perdure pendant trois (3) ans à compter de la fin de la prestation.",
  },
  {
    id: "force-majeure",
    label: "Force majeure",
    description: "Cas fortuit, maladie photographe, intempéries.",
    category: "recommandee",
    enabled: true,
    appliesTo: ["b2b", "b2c", "tfp"],
    body:
      "En cas de force majeure rendant impossible l'exécution de la prestation (maladie attestée par certificat médical, accident, événement climatique majeur, restriction sanitaire ou administrative), le Photographe s'engage à proposer un report dans un délai raisonnable. À défaut d'accord sur une nouvelle date sous deux (2) mois, les sommes versées seront intégralement remboursées, à l'exclusion de tout autre dédommagement.",
  },
  {
    id: "annulation-graduee",
    label: "Annulation graduée (mariage, événementiel)",
    description: "Échelle 100/50/25/0% selon délai préavis.",
    category: "recommandee",
    enabled: false,
    appliesTo: ["b2b", "b2c"],
    body:
      "En cas d'annulation à l'initiative du Client, l'acompte versé sera conservé selon le barème suivant : annulation plus de 6 mois avant la prestation : remboursement intégral hors frais d'étude (50 €) ; entre 3 et 6 mois : 50 % du montant total dû ; entre 1 et 3 mois : 75 % du montant total dû ; moins d'un mois : 100 % du montant total dû.",
  },
  {
    id: "fichiers-raw",
    label: "Propriété des fichiers RAW",
    description: "Fichiers bruts non cédés sauf accord exprès.",
    category: "recommandee",
    enabled: true,
    appliesTo: ["b2b", "b2c", "tfp"],
    body:
      "Les fichiers RAW (négatifs numériques) demeurent la propriété exclusive du Photographe et ne sont pas remis au Client. Ils sont conservés à des fins d'archivage professionnel pendant une durée de vingt-quatre (24) mois minimum. Toute cession exceptionnelle de fichiers RAW fera l'objet d'un avenant spécifique tarifé séparément.",
  },
  {
    id: "mentions-micro",
    label: "Mentions micro-entrepreneur (TVA franchise Art. 293B CGI)",
    description: "Mention obligatoire sur factures et contrats si franchise TVA.",
    category: "obligatoire",
    enabled: true,
    appliesTo: ["b2b", "b2c", "tfp"],
    body:
      "Le Photographe exerce sous le régime de la micro-entreprise. Mention obligatoire : TVA non applicable, article 293 B du Code général des impôts. SIRET : {{siret}}. Assurance responsabilité civile professionnelle souscrite auprès de : {{insurance}}.",
  },
  {
    id: "loi-juridiction",
    label: "Loi applicable et juridiction compétente",
    description: "Droit français, médiation conso B2C.",
    category: "obligatoire",
    enabled: true,
    appliesTo: ["b2b", "b2c", "tfp"],
    body:
      "Le présent contrat est soumis au droit français. En cas de litige, les parties s'efforceront de trouver une solution amiable. À défaut, pour les contrats avec un consommateur, le Client peut recourir gratuitement à un médiateur de la consommation. À défaut de résolution amiable, le litige sera porté devant les tribunaux compétents.",
  },
  {
    id: "reconnaissance-lecture",
    label: "Reconnaissance de lecture et de compréhension",
    description: "Mention manuscrite obligatoire avant signature, prouve consentement éclairé.",
    category: "recommandee",
    enabled: true,
    appliesTo: ["b2b", "b2c", "tfp"],
    body:
      "Chaque partie reconnaît avoir lu l'intégralité du présent contrat ainsi que ses annexes, en avoir compris la portée juridique, et avoir disposé du temps nécessaire à son examen avant signature. La signature de chaque partie est précédée de la mention manuscrite : « Lu et approuvé, bon pour accord ». Cette mention constitue la preuve d'un consentement libre, éclairé et non vicié au sens des articles 1130 et suivants du Code civil.",
  },
  {
    id: "divisibilite",
    label: "Divisibilité des clauses",
    description: "Si une clause est nulle, les autres restent valables.",
    category: "recommandee",
    enabled: true,
    appliesTo: ["b2b", "b2c", "tfp"],
    body:
      "Si une ou plusieurs stipulations du présent contrat sont tenues pour non valides ou déclarées telles en application d'une loi, d'un règlement ou à la suite d'une décision définitive d'une juridiction compétente, les autres stipulations conserveront leur force et leur portée. Les parties s'efforceront alors de remplacer la stipulation invalide par une stipulation valide produisant un effet économique et juridique aussi proche que possible.",
  },
  {
    id: "anteriorite-ecrit",
    label: "Antériorité de l'écrit sur l'oral",
    description: "Le contrat écrit prime sur tout accord oral antérieur.",
    category: "recommandee",
    enabled: true,
    appliesTo: ["b2b", "b2c", "tfp"],
    body:
      "Le présent contrat exprime l'intégralité des engagements des parties relatifs à son objet et annule et remplace tout accord, négociation, déclaration, échange ou communication antérieur entre elles, écrit ou oral, portant sur le même objet. Toute modification du présent contrat ne pourra résulter que d'un avenant écrit et signé des deux parties.",
  },
  {
    id: "langue-francaise",
    label: "Langue française authentique",
    description: "La version française fait foi en cas de traduction.",
    category: "optionnelle",
    enabled: false,
    appliesTo: ["b2b", "b2c", "tfp"],
    body:
      "Le présent contrat est rédigé en langue française. Toute traduction qui pourrait en être faite ne le sera qu'à titre informatif. En cas de divergence d'interprétation entre la version française et toute traduction, seule la version française fera foi entre les parties.",
  },
  {
    id: "prise-conseil",
    label: "Faculté de prise de conseil juridique",
    description: "Chaque partie a pu se faire conseiller. Empêche contestation pour vice du consentement.",
    category: "recommandee",
    enabled: true,
    appliesTo: ["b2b", "b2c", "tfp"],
    body:
      "Chaque partie reconnaît avoir eu la faculté, avant signature, de prendre conseil auprès de tout professionnel de son choix (avocat, expert-comptable, conseiller juridique) afin d'examiner le présent contrat et d'en mesurer la portée. Le fait de ne pas avoir recouru à un tel conseil ne pourra être invoqué pour contester la validité du présent contrat.",
  },
];

export function filterClausesByType(
  clauses: ClauseToggle[],
  type: "b2b" | "b2c" | "tfp",
) {
  return clauses.filter((c) => c.appliesTo.includes(type));
}
