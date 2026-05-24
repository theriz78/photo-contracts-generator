"use client";

import { useMemo } from "react";
import type { ContractDraft } from "@/lib/types";
import { formatDateFR, formatMoney } from "@/lib/utils";

const RIGHTS_LABEL: Record<string, string> = {
  reproduction: "droit de reproduction",
  representation: "droit de représentation",
  adaptation: "droit d'adaptation et de modification",
};
const DEST_LABEL: Record<string, string> = {
  commerciale: "commerciale",
  editoriale: "éditoriale",
  interne: "interne",
  publicitaire: "publicitaire",
  rp: "relations publiques",
  archives: "archives",
};
const SUPPORT_LABEL: Record<string, string> = {
  print: "print",
  web: "web",
  social: "réseaux sociaux",
  tv: "télévision",
  cinema: "cinéma",
  "out-of-home": "affichage extérieur",
};
const TERRITORY_LABEL: Record<string, string> = {
  france: "le territoire français",
  ue: "le territoire de l'Union européenne",
  monde: "le monde entier",
};
const DURATION_LABEL: Record<string, string> = {
  "12-mois": "douze (12) mois",
  "3-ans": "trois (3) ans",
  "5-ans": "cinq (5) ans",
  "10-ans": "dix (10) ans",
  "duree-legale": "la durée légale de protection du droit d'auteur (70 ans post-mortem auctoris)",
};

function Bracket({ children, filled }: { children: React.ReactNode; filled: boolean }) {
  if (filled) {
    return (
      <span style={{ background: "color-mix(in oklab, var(--accent) 22%, transparent)", padding: "0 4px", borderRadius: 3, fontWeight: 500 }}>
        {children}
      </span>
    );
  }
  return (
    <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
      [{children}]
    </span>
  );
}

function inlineList(items: string[]): string {
  if (items.length === 0) return "(aucun)";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} et ${items[1]}`;
  return items.slice(0, -1).join(", ") + " et " + items[items.length - 1];
}

export function PreviewPanel({ draft }: { draft: ContractDraft }) {
  const enabledClauses = useMemo(
    () => draft.customClauses.filter((c) => c.enabled && c.appliesTo.includes(draft.type)),
    [draft.customClauses, draft.type],
  );

  const titleByType = {
    b2b: "Contrat de prestation photographique B2B",
    b2c: "Contrat de prestation photographique",
    tfp: "Contrat de collaboration photographique (Time For Print)",
  }[draft.type];

  return (
    <div className="contract-print" style={{ background: "var(--bg-elevated)", borderRadius: 12, padding: "40px 36px", fontFamily: "var(--font-serif)", fontSize: 13, lineHeight: 1.65, color: "var(--text-primary)" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, paddingBottom: 16, borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            Modèle de contrat — micro-entrepreneur FR
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em", lineHeight: 1.1 }}>{titleByType}</h1>
          {draft.service.title && <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{draft.service.title}</div>}
        </div>
        {draft.photographer.logoDataUrl && (
          <img src={draft.photographer.logoDataUrl} alt="Logo" style={{ maxWidth: 90, maxHeight: 80, objectFit: "contain" }} />
        )}
      </header>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>Entre les soussignés</h2>

        <div style={{ marginBottom: 14 }}>
          <strong>Le Photographe</strong> : <Bracket filled={!!draft.photographer.fullName}>{draft.photographer.fullName || "Nom et prénom du photographe"}</Bracket>
          {draft.photographer.brandName && (<> exerçant sous le nom commercial <Bracket filled>{draft.photographer.brandName}</Bracket></>)}
          {draft.photographer.microEntrepreneur && <>, micro-entrepreneur</>}
          {draft.photographer.includeSiret && (<>, SIRET <Bracket filled={!!draft.photographer.siret}>{draft.photographer.siret || "SIRET"}</Bracket></>)}
          {draft.photographer.includeRcs && draft.photographer.rcs && (<>, {draft.photographer.rcs}</>)}
          , domicilié <Bracket filled={!!draft.photographer.address}>{draft.photographer.address || "Adresse complète"}</Bracket>, email <Bracket filled={!!draft.photographer.email}>{draft.photographer.email || "email"}</Bracket>, téléphone <Bracket filled={!!draft.photographer.phone}>{draft.photographer.phone || "téléphone"}</Bracket>.
          {draft.photographer.tvaExemption && (
            <> TVA non applicable, article 293 B du Code général des impôts.</>
          )}
          {draft.photographer.includeInsurance && draft.photographer.insurance && (
            <> Assurance RC professionnelle : <Bracket filled>{draft.photographer.insurance}</Bracket>.</>
          )}
          {draft.photographer.includeIban && draft.photographer.iban && (
            <> Coordonnées bancaires : <Bracket filled>{draft.photographer.iban}</Bracket>.</>
          )}
        </div>

        <div>
          <strong>Le Client</strong>
          {draft.client.legalForm === "personne-morale" ? (
            <>
              {" "}: <Bracket filled={!!draft.client.fullName}>{draft.client.fullName || "Raison sociale"}</Bracket>, représenté par <Bracket filled={!!draft.client.representative}>{draft.client.representative || "Représentant légal"}</Bracket>, SIRET <Bracket filled={!!draft.client.siret}>{draft.client.siret || "SIRET"}</Bracket>, dont le siège est situé <Bracket filled={!!draft.client.address}>{draft.client.address || "Adresse"}</Bracket>.
            </>
          ) : (
            <>
              {" "}: <Bracket filled={!!draft.client.fullName}>{draft.client.fullName || "Nom et prénom"}</Bracket>
              {draft.client.birthDate && (<>, né(e) le <Bracket filled>{formatDateFR(draft.client.birthDate)}</Bracket></>)}, domicilié <Bracket filled={!!draft.client.address}>{draft.client.address || "Adresse"}</Bracket>, email <Bracket filled={!!draft.client.email}>{draft.client.email || "email"}</Bracket>.
            </>
          )}
        </div>

        <p style={{ marginTop: 14, fontStyle: "italic", color: "var(--text-secondary)" }}>Ci-après désignés ensemble « les Parties ».</p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>Il a été convenu ce qui suit</h2>
      </section>

      {/* Article 1 — Cession granulaire générée dynamiquement */}
      <Article num={1} title="Cession des droits d'auteur">
        <p>
          Conformément à l'<strong>article L.131-3 du Code de la propriété intellectuelle</strong>, le Photographe cède au Client les droits suivants sur les photographies livrées : <Bracket filled={draft.cession.rights.length > 0}>{draft.cession.rights.length > 0 ? inlineList(draft.cession.rights.map((r) => RIGHTS_LABEL[r])) : "droits cédés"}</Bracket>.
        </p>
        <p>
          Cette cession est consentie à titre <Bracket filled>{draft.cession.scope === "exclusive" ? "exclusif" : "non-exclusif"}</Bracket>, pour les destinations suivantes : <Bracket filled={draft.cession.destinations.length > 0}>{draft.cession.destinations.length > 0 ? inlineList(draft.cession.destinations.map((d) => DEST_LABEL[d])) : "destinations"}</Bracket>.
        </p>
        <p>
          Elle est valable pour <Bracket filled>{TERRITORY_LABEL[draft.cession.territory]}</Bracket>, pour une durée de <Bracket filled>{DURATION_LABEL[draft.cession.duration]}</Bracket>, sur les supports suivants : <Bracket filled={draft.cession.supports.length > 0}>{draft.cession.supports.length > 0 ? inlineList(draft.cession.supports.map((s) => SUPPORT_LABEL[s])) : "supports"}</Bracket>.
        </p>
        <p>
          Le droit moral du Photographe demeure inaliénable et imprescriptible (article L.121-1 CPI). Toute exploitation devra obligatoirement faire apparaître la mention de paternité : <Bracket filled={!!draft.cession.creditMention}>{draft.cession.creditMention || "© Nom du photographe"}</Bracket>.
        </p>
      </Article>

      {/* Articles dynamiques selon clauses activées */}
      {enabledClauses
        .filter((c) => c.id !== "cession-droits")
        .map((c, idx) => (
          <Article key={c.id} num={idx + 2} title={c.label}>
            <p style={{ whiteSpace: "pre-wrap" }}>{interpolateClauseBody(c.body, draft)}</p>
          </Article>
        ))}

      {/* Waiver / Déclarations pré-signature */}
      <section
        className="signature-block"
        style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--border-subtle)" }}
      >
        <h3
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--text-secondary)",
            marginBottom: 10,
          }}
        >
          Déclarations et reconnaissances
        </h3>
        <p style={{ marginBottom: 8 }}>
          Chacune des Parties déclare et reconnaît, avant apposition de sa signature :
        </p>
        <ol style={{ paddingLeft: 18, marginBottom: 10 }}>
          <li style={{ marginBottom: 4 }}>avoir lu l'intégralité du présent contrat ainsi que ses annexes ;</li>
          <li style={{ marginBottom: 4 }}>en avoir compris la portée juridique et les implications économiques ;</li>
          <li style={{ marginBottom: 4 }}>avoir disposé du temps nécessaire à son examen ;</li>
          <li style={{ marginBottom: 4 }}>avoir été informée de la possibilité de prendre conseil auprès d'un professionnel de son choix (avocat, expert-comptable) ;</li>
          <li style={{ marginBottom: 4 }}>signer librement, en pleine connaissance de cause, sans vice du consentement au sens des articles 1130 et suivants du Code civil.</li>
        </ol>
      </section>

      {/* Signature block */}
      <div className="signature-block" style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--border-subtle)" }}>
        <p style={{ marginBottom: 16 }}>
          Fait à <Bracket filled={!!draft.signaturePlace}>{draft.signaturePlace || "Lieu"}</Bracket>, le <Bracket filled={!!draft.signatureDate}>{formatDateFR(draft.signatureDate) || "Date"}</Bracket>, en deux (2) exemplaires originaux.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <SignatureBox label="Le Photographe" name={draft.photographer.fullName} />
          <SignatureBox label="Le Client" name={draft.client.fullName} />
        </div>

        <p style={{ marginTop: 16, fontSize: 10, color: "var(--text-muted)", fontStyle: "italic" }}>
          Chaque signature est précédée de la mention manuscrite « Lu et approuvé, bon pour accord ».
        </p>
      </div>
    </div>
  );
}

function Article({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <article style={{ marginBottom: 18 }}>
      <h3 style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-secondary)" }}>
        Article {num} — {title}
      </h3>
      <div>{children}</div>
    </article>
  );
}

function SignatureBox({ label, name }: { label: string; name: string }) {
  return (
    <div style={{ minHeight: 88, padding: 12, border: "1px dashed var(--border-strong)", borderRadius: 6 }}>
      <div style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 6, fontFamily: "var(--font-body)" }}>{label}</div>
      <div style={{ fontWeight: 500 }}>{name || <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>[Nom et signature]</span>}</div>
    </div>
  );
}

function interpolateClauseBody(body: string, draft: ContractDraft): string {
  const map: Record<string, string> = {
    date: draft.service.date ? formatDateFR(draft.service.date) : "[date]",
    location: draft.service.location || "[lieu]",
    description: draft.service.description || "[description prestation]",
    retouchedCount: String(draft.service.deliverables.retouchedCount ?? "[nombre]"),
    deliveryDeadlineDays: String(draft.service.deliverables.deliveryDeadlineDays),
    amount: draft.pricing ? formatMoney(draft.pricing.amount) : "[montant]",
    depositValue:
      draft.pricing?.deposit.type === "percent"
        ? `${draft.pricing.deposit.value}% (${formatMoney((draft.pricing.amount * draft.pricing.deposit.value) / 100)})`
        : draft.pricing
        ? formatMoney(draft.pricing.deposit.value)
        : "[acompte]",
    balanceDueDays: String(draft.pricing?.balanceDueDays ?? 30),
    iban: draft.photographer.iban || "[IBAN]",
    siret: draft.photographer.siret || "[SIRET]",
    insurance: draft.photographer.insurance || "[Assurance RC pro]",
    photographerName: draft.photographer.fullName || "[Photographe]",
    exclusivityMonths: String(draft.tfpCounterparts?.exclusivityMonths ?? 6),
    additionalCommitments: draft.tfpCounterparts
      ? draft.tfpCounterparts.additionalCommitments.filter(Boolean).map((c, i) => `(${i + 1}) ${c}`).join(" ; ")
      : "[engagements]",
  };
  return body.replace(/\{\{(\w+)\}\}/g, (_, k) => map[k] ?? `[${k}]`);
}
