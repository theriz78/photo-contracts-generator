"use client";

import { useRef } from "react";
import { Building2, User, Heart, Briefcase, Camera, Plane, Home, Sparkles, Baby, Trophy, Package, PawPrint, Palette, MoreHorizontal, Image as ImageIcon, Upload, Check, X, Flame } from "lucide-react";
import type { ContractDraft, ContractType, ContractNiche, ClauseToggle } from "@/lib/types";
import { cn } from "@/lib/utils";

const TYPES: { id: ContractType; title: string; tag: string; description: string; icon: typeof Building2 }[] = [
  { id: "b2b", title: "Prestation B2B", tag: "Entreprise / SARL", description: "Société cliente, K-bis, paiement LME 60j net, pénalités L.441-10, cession commerciale.", icon: Building2 },
  { id: "b2c", title: "Prestation B2C", tag: "Particulier", description: "Consommateur, rétractation 14 jours, mentions Code conso, médiation.", icon: User },
  { id: "tfp", title: "Collaboration TFP", tag: "Time For Print", description: "Licence mutuelle avec contreparties non-financières (anti-donation Art. 931).", icon: Heart },
];

const NICHES: { id: ContractNiche; label: string; icon: typeof Heart }[] = [
  { id: "mariage", label: "Mariage", icon: Heart },
  { id: "corporate", label: "Corporate", icon: Briefcase },
  { id: "portrait", label: "Portrait / Famille", icon: User },
  { id: "boudoir", label: "Boudoir", icon: Flame },
  { id: "mode", label: "Mode / Édito", icon: Sparkles },
  { id: "immobilier", label: "Immobilier", icon: Home },
  { id: "drone", label: "Drone / Aérien", icon: Plane },
  { id: "evenementiel", label: "Événementiel", icon: Camera },
  { id: "scolaire", label: "Scolaire / Crèche", icon: Baby },
  { id: "sport", label: "Sport", icon: Trophy },
  { id: "produit", label: "Produit / Packshot", icon: Package },
  { id: "animalier", label: "Animalier", icon: PawPrint },
  { id: "artistique", label: "Artistique / Auteur", icon: Palette },
  { id: "autre", label: "Autre", icon: MoreHorizontal },
];

export function StepType({
  draft,
  patch,
}: {
  draft: ContractDraft;
  patch: (p: (prev: ContractDraft) => ContractDraft) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="display-lg mb-1">Type de contrat</h2>
        <p className="text-soft text-sm">Choisis le cadre juridique applicable. Détermine clauses obligatoires et options.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {TYPES.map((t) => {
          const Icon = t.icon;
          const active = draft.type === t.id;
          return (
            <button
              key={t.id}
              onClick={() => patch((prev) => ({ ...prev, type: t.id }))}
              className={cn("bento-card bento-card-interactive cp-lift text-left transition-all", active && "ring-2")}
              style={active ? { borderColor: "var(--accent)", boxShadow: "0 0 0 1px var(--accent)" } : undefined}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="grid place-items-center"
                  style={{ width: 40, height: 40, background: active ? "var(--accent)" : "var(--bg-elevated)", color: active ? "var(--bg-base)" : "var(--text-primary)", borderRadius: 10 }}
                >
                  <Icon size={18} />
                </div>
                {active ? <Check size={18} className="text-accent" /> : null}
              </div>
              <div className="label-eyebrow mb-1">{t.tag}</div>
              <div className="display-md mb-2">{t.title}</div>
              <p className="text-sm text-soft leading-relaxed">{t.description}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-2">
        <div className="label-eyebrow mb-3">Niche métier</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {NICHES.map((n) => {
            const Icon = n.icon;
            const active = draft.niche === n.id;
            return (
              <button
                key={n.id}
                onClick={() => patch((prev) => ({ ...prev, niche: n.id, service: { ...prev.service, niche: n.id } }))}
                className={cn("btn btn-ghost justify-start", active && "border-accent")}
                style={active ? { borderColor: "var(--accent)", color: "var(--accent)" } : undefined}
              >
                <Icon size={14} />
                <span className="truncate">{n.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function StepParties({
  draft,
  patch,
}: {
  draft: ContractDraft;
  patch: (p: (prev: ContractDraft) => ContractDraft) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 800_000) {
      alert("Logo trop volumineux (max 800 Ko). Compresse-le d'abord.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      patch((prev) => ({
        ...prev,
        photographer: { ...prev.photographer, logoDataUrl: reader.result as string },
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-8">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="display-lg">Identité du photographe</h2>
          <span className="pill"><Camera size={12} /> Émetteur</span>
        </div>
        <div className="bento-card">
          <div className="flex gap-4 mb-6">
            <div
              className="grid place-items-center shrink-0"
              style={{ width: 96, height: 96, background: "var(--bg-elevated)", border: "1px dashed var(--border-strong)", borderRadius: 12 }}
            >
              {draft.photographer.logoDataUrl ? (
                <img src={draft.photographer.logoDataUrl} alt="Logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
              ) : (
                <ImageIcon size={28} className="text-mute" />
              )}
            </div>
            <div className="flex-1 flex flex-col justify-between gap-2">
              <div>
                <div className="display-md mb-1">Logo brand</div>
                <p className="text-sm text-mute">Apparaît en en-tête du contrat PDF et dans la signature email. PNG/SVG/JPG, max 800 Ko.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => fileRef.current?.click()} className="btn btn-ghost">
                  <Upload size={14} /> {draft.photographer.logoDataUrl ? "Remplacer" : "Importer"}
                </button>
                {draft.photographer.logoDataUrl && (
                  <button
                    onClick={() => patch((prev) => ({ ...prev, photographer: { ...prev.photographer, logoDataUrl: "" } }))}
                    className="btn btn-ghost"
                  >
                    <X size={14} /> Retirer
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Nom et prénom *" value={draft.photographer.fullName} onChange={(v) => patch((p) => ({ ...p, photographer: { ...p.photographer, fullName: v } }))} placeholder="Lucius Martel" />
            <Field label="Nom commercial" value={draft.photographer.brandName ?? ""} onChange={(v) => patch((p) => ({ ...p, photographer: { ...p.photographer, brandName: v } }))} placeholder="Lucius Studio" />
            <Field label="SIRET *" value={draft.photographer.siret} onChange={(v) => patch((p) => ({ ...p, photographer: { ...p.photographer, siret: v } }))} placeholder="123 456 789 00012" />
            <Field label="RCS / RM (optionnel)" value={draft.photographer.rcs ?? ""} onChange={(v) => patch((p) => ({ ...p, photographer: { ...p.photographer, rcs: v } }))} placeholder="RCS Paris 123 456 789" />
            <Field label="Email *" value={draft.photographer.email} onChange={(v) => patch((p) => ({ ...p, photographer: { ...p.photographer, email: v } }))} placeholder="contact@studio.fr" type="email" />
            <Field label="Téléphone *" value={draft.photographer.phone} onChange={(v) => patch((p) => ({ ...p, photographer: { ...p.photographer, phone: v } }))} placeholder="+33 6 12 34 56 78" />
            <Field label="Adresse complète *" value={draft.photographer.address} onChange={(v) => patch((p) => ({ ...p, photographer: { ...p.photographer, address: v } }))} placeholder="12 rue de l'Image, 75011 Paris" wide />
            <Field label="IBAN" value={draft.photographer.iban ?? ""} onChange={(v) => patch((p) => ({ ...p, photographer: { ...p.photographer, iban: v } }))} placeholder="FR76 ..." />
            <Field label="Assurance RC pro" value={draft.photographer.insurance ?? ""} onChange={(v) => patch((p) => ({ ...p, photographer: { ...p.photographer, insurance: v } }))} placeholder="MAAF Pro n° 12345678" />
          </div>

          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
            <Toggle
              label="Micro-entrepreneur"
              checked={draft.photographer.microEntrepreneur}
              onChange={(v) => patch((p) => ({ ...p, photographer: { ...p.photographer, microEntrepreneur: v } }))}
            />
            <Toggle
              label="Franchise TVA (Art. 293 B CGI)"
              checked={draft.photographer.tvaExemption}
              onChange={(v) => patch((p) => ({ ...p, photographer: { ...p.photographer, tvaExemption: v } }))}
            />
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="display-lg">Identité du client</h2>
          <span className="pill"><User size={12} /> Bénéficiaire</span>
        </div>
        <div className="bento-card">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => patch((p) => ({ ...p, client: { ...p.client, legalForm: "personne-physique" } }))}
              className={cn("btn", draft.client.legalForm === "personne-physique" ? "btn-primary" : "btn-ghost")}
            >
              Particulier
            </button>
            <button
              onClick={() => patch((p) => ({ ...p, client: { ...p.client, legalForm: "personne-morale" } }))}
              className={cn("btn", draft.client.legalForm === "personne-morale" ? "btn-primary" : "btn-ghost")}
            >
              Entreprise
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field
              label={draft.client.legalForm === "personne-morale" ? "Raison sociale *" : "Nom et prénom *"}
              value={draft.client.fullName}
              onChange={(v) => patch((p) => ({ ...p, client: { ...p.client, fullName: v } }))}
            />
            {draft.client.legalForm === "personne-morale" && (
              <>
                <Field label="Représentant légal *" value={draft.client.representative ?? ""} onChange={(v) => patch((p) => ({ ...p, client: { ...p.client, representative: v } }))} />
                <Field label="SIRET / SIREN *" value={draft.client.siret ?? ""} onChange={(v) => patch((p) => ({ ...p, client: { ...p.client, siret: v } }))} />
              </>
            )}
            {draft.client.legalForm === "personne-physique" && (
              <Field label="Né(e) le" value={draft.client.birthDate ?? ""} onChange={(v) => patch((p) => ({ ...p, client: { ...p.client, birthDate: v } }))} type="date" />
            )}
            <Field label="Email *" type="email" value={draft.client.email} onChange={(v) => patch((p) => ({ ...p, client: { ...p.client, email: v } }))} />
            <Field label="Téléphone" value={draft.client.phone ?? ""} onChange={(v) => patch((p) => ({ ...p, client: { ...p.client, phone: v } }))} />
            <Field label="Adresse complète *" wide value={draft.client.address} onChange={(v) => patch((p) => ({ ...p, client: { ...p.client, address: v } }))} />
          </div>
        </div>
      </section>
    </div>
  );
}

export function StepPrestation({
  draft,
  patch,
}: {
  draft: ContractDraft;
  patch: (p: (prev: ContractDraft) => ContractDraft) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="display-lg mb-1">Détails de la prestation</h2>
        <p className="text-soft text-sm">Date, lieu, durée, livrables. Plus précis = moins de litiges.</p>
      </div>

      <div className="bento-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Titre / intitulé *" wide value={draft.service.title} onChange={(v) => patch((p) => ({ ...p, service: { ...p.service, title: v } }))} placeholder="Mariage Léa & Antoine — Château de Lavaur" />
          <Field label="Date prestation *" type="date" value={draft.service.date} onChange={(v) => patch((p) => ({ ...p, service: { ...p.service, date: v } }))} />
          <Field label="Lieu *" value={draft.service.location} onChange={(v) => patch((p) => ({ ...p, service: { ...p.service, location: v } }))} placeholder="Château de Lavaur, 81500" />
          <Field label="Début" type="time" value={draft.service.startTime ?? ""} onChange={(v) => patch((p) => ({ ...p, service: { ...p.service, startTime: v } }))} />
          <Field label="Fin" type="time" value={draft.service.endTime ?? ""} onChange={(v) => patch((p) => ({ ...p, service: { ...p.service, endTime: v } }))} />
          <TextArea label="Description détaillée *" wide value={draft.service.description} onChange={(v) => patch((p) => ({ ...p, service: { ...p.service, description: v } }))} placeholder="Reportage 10h-23h, préparatifs, cérémonie civile et religieuse, vin d'honneur, repas, soirée." rows={3} />
        </div>

        <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-3" style={{ borderColor: "var(--border-subtle)" }}>
          <NumberField label="Photos retouchées livrées" value={draft.service.deliverables.retouchedCount ?? 0} onChange={(v) => patch((p) => ({ ...p, service: { ...p.service, deliverables: { ...p.service.deliverables, retouchedCount: v } } }))} />
          <NumberField label="Délai livraison (jours)" value={draft.service.deliverables.deliveryDeadlineDays} onChange={(v) => patch((p) => ({ ...p, service: { ...p.service, deliverables: { ...p.service.deliverables, deliveryDeadlineDays: v } } }))} />
          <SelectField
            label="Méthode livraison"
            value={draft.service.deliverables.deliveryMethod}
            onChange={(v) => patch((p) => ({ ...p, service: { ...p.service, deliverables: { ...p.service.deliverables, deliveryMethod: v as "galerie-privee" } } }))}
            options={[
              { value: "galerie-privee", label: "Galerie privée en ligne" },
              { value: "transfert", label: "Transfert WeTransfer / Swisstransfer" },
              { value: "support-physique", label: "Support physique (clé USB)" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export function StepTerms({
  draft,
  patch,
}: {
  draft: ContractDraft;
  patch: (p: (prev: ContractDraft) => ContractDraft) => void;
}) {
  const isTFP = draft.type === "tfp";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="display-lg mb-1">{isTFP ? "Contreparties TFP" : "Prix et conditions"}</h2>
        <p className="text-soft text-sm">
          {isTFP
            ? "Engagements non-financiers réels et exigibles. Parade Art. 931 C. civ (anti-donation)."
            : "Acompte, solde, pénalités. Le détail prévient les litiges."}
        </p>
      </div>

      {!isTFP && draft.pricing && (
        <div className="bento-card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <SelectField
              label="Mode tarification"
              value={draft.pricing.mode}
              onChange={(v) => patch((p) => ({ ...p, pricing: { ...p.pricing!, mode: v as "forfait" } }))}
              options={[
                { value: "forfait", label: "Forfait" },
                { value: "horaire", label: "Tarif horaire" },
                { value: "demi-jour", label: "Demi-journée" },
                { value: "jour", label: "Journée" },
              ]}
            />
            <NumberField label="Montant HT (€)" value={draft.pricing.amount} onChange={(v) => patch((p) => ({ ...p, pricing: { ...p.pricing!, amount: v } }))} />
            <NumberField label="Délai solde (jours)" value={draft.pricing.balanceDueDays} onChange={(v) => patch((p) => ({ ...p, pricing: { ...p.pricing!, balanceDueDays: v } }))} />
            <SelectField
              label="Type d'acompte"
              value={draft.pricing.deposit.type}
              onChange={(v) => patch((p) => ({ ...p, pricing: { ...p.pricing!, deposit: { ...p.pricing!.deposit, type: v as "percent" } } }))}
              options={[
                { value: "percent", label: "Pourcentage" },
                { value: "fixed", label: "Montant fixe" },
              ]}
            />
            <NumberField label={draft.pricing.deposit.type === "percent" ? "Acompte (%)" : "Acompte (€)"} value={draft.pricing.deposit.value} onChange={(v) => patch((p) => ({ ...p, pricing: { ...p.pricing!, deposit: { ...p.pricing!.deposit, value: v } } }))} />
            <NumberField label="Frais déplacement (€)" value={draft.pricing.travelFee ?? 0} onChange={(v) => patch((p) => ({ ...p, pricing: { ...p.pricing!, travelFee: v } }))} />
          </div>
        </div>
      )}

      {isTFP && draft.tfpCounterparts && (
        <div className="bento-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <NumberField label="Photos retouchées livrées au modèle" value={draft.tfpCounterparts.retouchedCount} onChange={(v) => patch((p) => ({ ...p, tfpCounterparts: { ...p.tfpCounterparts!, retouchedCount: v } }))} />
            <NumberField label="Exclusivité (mois)" value={draft.tfpCounterparts.exclusivityMonths} onChange={(v) => patch((p) => ({ ...p, tfpCounterparts: { ...p.tfpCounterparts!, exclusivityMonths: v } }))} />
            <TextArea
              label="Droits d'usage accordés au modèle"
              wide
              value={draft.tfpCounterparts.modelUsageRights}
              onChange={(v) => patch((p) => ({ ...p, tfpCounterparts: { ...p.tfpCounterparts!, modelUsageRights: v } }))}
              rows={2}
            />
            <div className="md:col-span-2">
              <div className="label-eyebrow mb-2">Engagements du modèle</div>
              <div className="flex flex-col gap-2">
                {draft.tfpCounterparts.additionalCommitments.map((c, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={c}
                      onChange={(e) => {
                        const next = [...draft.tfpCounterparts!.additionalCommitments];
                        next[i] = e.target.value;
                        patch((p) => ({ ...p, tfpCounterparts: { ...p.tfpCounterparts!, additionalCommitments: next } }));
                      }}
                      className="field-input"
                    />
                    <button
                      onClick={() => {
                        const next = draft.tfpCounterparts!.additionalCommitments.filter((_, j) => j !== i);
                        patch((p) => ({ ...p, tfpCounterparts: { ...p.tfpCounterparts!, additionalCommitments: next } }));
                      }}
                      className="btn btn-ghost btn-icon"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    patch((p) => ({
                      ...p,
                      tfpCounterparts: {
                        ...p.tfpCounterparts!,
                        additionalCommitments: [...p.tfpCounterparts!.additionalCommitments, ""],
                      },
                    }))
                  }
                  className="btn btn-ghost"
                >
                  + Ajouter un engagement
                </button>
              </div>
            </div>
            <Toggle
              label="Crédit photo obligatoire en cas de publication"
              checked={draft.tfpCounterparts.creditMentionRequired}
              onChange={(v) => patch((p) => ({ ...p, tfpCounterparts: { ...p.tfpCounterparts!, creditMentionRequired: v } }))}
            />
            <Toggle
              label="Tag réseaux sociaux obligatoire"
              checked={draft.tfpCounterparts.socialTagging}
              onChange={(v) => patch((p) => ({ ...p, tfpCounterparts: { ...p.tfpCounterparts!, socialTagging: v } }))}
            />
          </div>
        </div>
      )}

      {/* Cession granulaire Art L.131-3 CPI */}
      <div className="bento-card">
        <div className="flex items-center justify-between mb-4">
          <div className="display-md">Cession des droits d'auteur</div>
          <span className="pill">Art. L.131-3 CPI</span>
        </div>
        <p className="text-sm text-soft mb-4">Chaque droit cédé doit être mentionné distinctement, avec étendue, destination, lieu, durée. Clause générique = nulle.</p>

        <div className="flex flex-col gap-4">
          <MultiToggle
            label="Droits cédés"
            options={[
              { value: "reproduction", label: "Reproduction" },
              { value: "representation", label: "Représentation" },
              { value: "adaptation", label: "Adaptation / modification" },
            ]}
            values={draft.cession.rights}
            onChange={(v) => patch((p) => ({ ...p, cession: { ...p.cession, rights: v as ("reproduction" | "representation" | "adaptation")[] } }))}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <SelectField
              label="Étendue"
              value={draft.cession.scope}
              onChange={(v) => patch((p) => ({ ...p, cession: { ...p.cession, scope: v as "exclusive" | "non-exclusive" } }))}
              options={[
                { value: "non-exclusive", label: "Non-exclusive (recommandé)" },
                { value: "exclusive", label: "Exclusive" },
              ]}
            />
            <SelectField
              label="Territoire"
              value={draft.cession.territory}
              onChange={(v) => patch((p) => ({ ...p, cession: { ...p.cession, territory: v as "france" } }))}
              options={[
                { value: "france", label: "France" },
                { value: "ue", label: "Union européenne" },
                { value: "monde", label: "Monde entier" },
              ]}
            />
            <SelectField
              label="Durée"
              value={draft.cession.duration}
              onChange={(v) => patch((p) => ({ ...p, cession: { ...p.cession, duration: v as "3-ans" } }))}
              options={[
                { value: "12-mois", label: "12 mois" },
                { value: "3-ans", label: "3 ans" },
                { value: "5-ans", label: "5 ans" },
                { value: "10-ans", label: "10 ans" },
                { value: "duree-legale", label: "Durée légale (70 ans post-mortem)" },
              ]}
            />
            <Field
              label="Mention crédit obligatoire"
              value={draft.cession.creditMention}
              onChange={(v) => patch((p) => ({ ...p, cession: { ...p.cession, creditMention: v } }))}
            />
          </div>

          <MultiToggle
            label="Destinations autorisées"
            options={[
              { value: "commerciale", label: "Commerciale" },
              { value: "editoriale", label: "Éditoriale" },
              { value: "interne", label: "Interne (intranet, archives)" },
              { value: "publicitaire", label: "Publicitaire" },
              { value: "rp", label: "Relations publiques" },
              { value: "archives", label: "Archives" },
            ]}
            values={draft.cession.destinations}
            onChange={(v) => patch((p) => ({ ...p, cession: { ...p.cession, destinations: v as ("commerciale" | "editoriale")[] } }))}
          />

          <MultiToggle
            label="Supports d'exploitation"
            options={[
              { value: "print", label: "Print" },
              { value: "web", label: "Web" },
              { value: "social", label: "Réseaux sociaux" },
              { value: "tv", label: "TV" },
              { value: "cinema", label: "Cinéma" },
              { value: "out-of-home", label: "Affichage extérieur" },
            ]}
            values={draft.cession.supports}
            onChange={(v) => patch((p) => ({ ...p, cession: { ...p.cession, supports: v as ("print" | "web")[] } }))}
          />
        </div>
      </div>
    </div>
  );
}

export function StepClauses({
  draft,
  patch,
}: {
  draft: ContractDraft;
  patch: (p: (prev: ContractDraft) => ContractDraft) => void;
}) {
  const applicable = draft.customClauses.filter((c) => c.appliesTo.includes(draft.type));

  const toggleClause = (id: string) => {
    patch((p) => ({
      ...p,
      customClauses: p.customClauses.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)),
    }));
  };

  const editClauseBody = (id: string, body: string) => {
    patch((p) => ({
      ...p,
      customClauses: p.customClauses.map((c) => (c.id === id ? { ...c, body } : c)),
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="display-lg mb-1">Clauses additionnelles</h2>
        <p className="text-soft text-sm">Active ou désactive selon ton cas. Les clauses obligatoires sont verrouillées.</p>
      </div>

      <div className="flex flex-col gap-2">
        {applicable.map((c) => {
          const required = c.category === "obligatoire";
          return (
            <ClauseRow
              key={c.id}
              clause={c}
              required={required}
              onToggle={() => !required && toggleClause(c.id)}
              onEditBody={(b) => editClauseBody(c.id, b)}
            />
          );
        })}
      </div>

      <div className="bento-card mt-2">
        <div className="display-md mb-3">Signature</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Lieu signature" value={draft.signaturePlace} onChange={(v) => patch((p) => ({ ...p, signaturePlace: v }))} placeholder="Paris" />
          <Field label="Date signature" type="date" value={draft.signatureDate} onChange={(v) => patch((p) => ({ ...p, signatureDate: v }))} />
        </div>
      </div>
    </div>
  );
}

function ClauseRow({
  clause,
  required,
  onToggle,
  onEditBody,
}: {
  clause: ClauseToggle;
  required: boolean;
  onToggle: () => void;
  onEditBody: (b: string) => void;
}) {
  return (
    <details className="bento-card group" style={{ padding: "16px 20px" }}>
      <summary className="flex items-center justify-between cursor-pointer list-none">
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggle();
            }}
            disabled={required}
            className="shrink-0"
            style={{
              width: 36,
              height: 20,
              borderRadius: 999,
              background: clause.enabled ? "var(--accent)" : "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              position: "relative",
              cursor: required ? "not-allowed" : "pointer",
              opacity: required ? 0.6 : 1,
              transition: "background 200ms",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 2,
                left: clause.enabled ? 18 : 2,
                width: 14,
                height: 14,
                borderRadius: 999,
                background: clause.enabled ? "var(--bg-base)" : "var(--text-muted)",
                transition: "left 200ms",
              }}
            />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{clause.label}</span>
              <span
                className="pill"
                style={{
                  fontSize: 9,
                  padding: "2px 6px",
                  background: required ? "var(--accent)" : "var(--bg-elevated)",
                  color: required ? "var(--bg-base)" : "var(--text-muted)",
                }}
              >
                {clause.category}
              </span>
            </div>
            <p className="text-xs text-mute mt-0.5">{clause.description}</p>
          </div>
        </div>
      </summary>
      <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--border-subtle)" }}>
        <textarea
          value={clause.body}
          onChange={(e) => onEditBody(e.target.value)}
          rows={5}
          className="field-input"
          style={{ fontFamily: "var(--font-serif)", fontSize: 13, lineHeight: 1.6 }}
        />
      </div>
    </details>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  wide,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  wide?: boolean;
}) {
  return (
    <label className={cn("flex flex-col gap-1", wide && "md:col-span-2")}>
      <span className="label-eyebrow">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="field-input" />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="label-eyebrow">{label}</span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : ""}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="field-input"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  wide,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  wide?: boolean;
}) {
  return (
    <label className={cn("flex flex-col gap-1", wide && "md:col-span-2")}>
      <span className="label-eyebrow">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} className="field-input" style={{ resize: "vertical", fontFamily: "var(--font-body)" }} />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="label-eyebrow">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="field-input">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2"
      style={{ padding: "6px 12px", border: "1px solid var(--border-subtle)", borderRadius: 999, background: checked ? "var(--accent)" : "var(--bg-elevated)", color: checked ? "var(--bg-base)" : "var(--text-secondary)", fontSize: 12, fontWeight: 500 }}
    >
      {checked ? <Check size={12} /> : <span style={{ width: 12 }} />}
      {label}
    </button>
  );
}

function MultiToggle({
  label,
  options,
  values,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (v: string) => {
    if (values.includes(v)) onChange(values.filter((x) => x !== v));
    else onChange([...values, v]);
  };
  return (
    <div className="flex flex-col gap-2">
      <span className="label-eyebrow">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <Toggle key={o.value} label={o.label} checked={values.includes(o.value)} onChange={() => toggle(o.value)} />
        ))}
      </div>
    </div>
  );
}
