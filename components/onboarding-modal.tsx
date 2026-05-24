"use client";

import { useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Camera, ChevronRight, ChevronLeft, X, Check, Briefcase, User } from "lucide-react";
import type { Photographer, PhotographerStatus } from "@/lib/types";

const STEPS = ["status", "identity", "contact", "confirm"] as const;
type StepId = typeof STEPS[number];

export function OnboardingModal({
  initial,
  onComplete,
  onSkip,
}: {
  initial: Photographer | null;
  onComplete: (p: Photographer) => void;
  onSkip?: () => void;
}) {
  const [step, setStep] = useState<StepId>("status");
  const [p, setP] = useState<Photographer>(
    initial ?? {
      status: "pro",
      fullName: "",
      brandName: "",
      logoDataUrl: "",
      siret: "",
      rcs: "",
      address: "",
      email: "",
      phone: "",
      iban: "",
      bic: "",
      insurance: "",
      microEntrepreneur: true,
      tvaExemption: true,
      includeSiret: true,
      includeRcs: false,
      includeIban: true,
      includeInsurance: false,
    },
  );

  const idx = STEPS.indexOf(step);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo(panelRef.current, { y: 24, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" });
    },
    { scope: backdropRef },
  );

  useGSAP(
    () => {
      if (!contentRef.current) return;
      gsap.fromTo(contentRef.current, { x: 16, opacity: 0 }, { x: 0, opacity: 1, duration: 0.32, ease: "power2.out" });
    },
    { dependencies: [step], scope: contentRef },
  );

  const next = () => {
    const n = STEPS[idx + 1];
    if (n) setStep(n);
    else complete();
  };
  const prev = () => {
    const p = STEPS[idx - 1];
    if (p) setStep(p);
  };

  const complete = () => {
    const final: Photographer = {
      ...p,
      microEntrepreneur: p.status === "pro",
      tvaExemption: p.status === "pro",
      includeSiret: p.status === "pro",
    };
    onComplete(final);
  };

  const canNext = (() => {
    if (step === "status") return !!p.status;
    if (step === "identity") return !!p.fullName && (p.status !== "pro" || !!p.siret);
    if (step === "contact") return !!p.email && !!p.address;
    return true;
  })();

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 grid place-items-center p-4 no-print"
      style={{ background: "color-mix(in oklab, var(--color-carbon) 70%, transparent)", backdropFilter: "blur(10px)" }}
    >
      <div
        ref={panelRef}
        className="bento-card w-full"
        style={{ maxWidth: 560, padding: 0, overflow: "hidden" }}
      >
        <header
          className="flex items-start justify-between gap-3"
          style={{ padding: "20px 22px 14px", borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center gap-3">
            <div className="grid place-items-center" style={{ width: 32, height: 32, borderRadius: 8, background: "var(--color-carbon)", color: "var(--color-snow)" }}>
              <Camera size={16} strokeWidth={1.6} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.012em" }}>Configure ton studio</div>
              <div className="label-tag mt-0.5" style={{ fontSize: 11 }}>
                Étape {idx + 1} sur {STEPS.length}
              </div>
            </div>
          </div>
          {onSkip && (
            <button onClick={onSkip} className="btn btn-ghost btn-icon" aria-label="Passer" data-cursor="hover">
              <X size={14} />
            </button>
          )}
        </header>

        <div className="px-1 pt-2 pb-1">
          <div style={{ display: "flex", gap: 4, padding: "0 22px" }}>
            {STEPS.map((s, i) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: 2,
                  borderRadius: 999,
                  background: i <= idx ? "var(--color-carbon)" : "var(--color-fog-deep)",
                  transition: "background 280ms",
                }}
              />
            ))}
          </div>
        </div>

        <div ref={contentRef} key={step} style={{ padding: "20px 22px 4px", minHeight: 240 }}>
          {step === "status" && <StatusStep p={p} setP={setP} />}
          {step === "identity" && <IdentityStep p={p} setP={setP} />}
          {step === "contact" && <ContactStep p={p} setP={setP} />}
          {step === "confirm" && <ConfirmStep p={p} />}
        </div>

        <footer
          className="flex items-center justify-between gap-2"
          style={{ padding: "14px 22px", borderTop: "1px solid var(--border-subtle)" }}
        >
          <button
            onClick={prev}
            disabled={idx === 0}
            className="btn btn-ghost"
            style={{ opacity: idx === 0 ? 0.4 : 1 }}
            data-cursor="hover"
          >
            <ChevronLeft size={14} />
            Retour
          </button>
          <button
            onClick={next}
            disabled={!canNext}
            className="btn btn-primary"
            style={{ opacity: canNext ? 1 : 0.5 }}
            data-cursor="hover"
          >
            {step === "confirm" ? "Sauvegarder" : "Suivant"}
            {step === "confirm" ? <Check size={14} /> : <ChevronRight size={14} />}
          </button>
        </footer>
      </div>
    </div>
  );
}

function StatusStep({ p, setP }: { p: Photographer; setP: (p: Photographer) => void }) {
  const opts: { id: PhotographerStatus; icon: typeof Briefcase; title: string; desc: string }[] = [
    {
      id: "pro",
      icon: Briefcase,
      title: "Photographe pro avec SIRET",
      desc: "Micro-entrepreneur, artiste-auteur ou société. Franchise TVA Art. 293 B CGI. Facturation B2B/B2C standard.",
    },
    {
      id: "occasionnel",
      icon: User,
      title: "Photographe occasionnel sans SIRET",
      desc: "Vente ponctuelle, TFP, cadeau, tirage d'art à un proche. Plafond 3 000 €/an avant inscription URSSAF artiste-auteur.",
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <p className="text-soft mb-2" style={{ fontSize: 13, lineHeight: 1.55 }}>
        Choisis ton statut. Cela ajuste les mentions obligatoires et les clauses du contrat.
      </p>
      {opts.map((o) => {
        const Icon = o.icon;
        const active = p.status === o.id;
        return (
          <button
            key={o.id}
            onClick={() => setP({ ...p, status: o.id })}
            className="cp-lift text-left"
            data-cursor="hover"
            aria-pressed={active}
            style={{
              padding: 14,
              borderRadius: 6,
              border: `1px solid ${active ? "var(--color-carbon)" : "var(--border-subtle)"}`,
              background: active ? "var(--bg-card-hover)" : "var(--bg-elevated)",
              cursor: "pointer",
              transition: "all 200ms ease",
            }}
          >
            <div className="flex items-start gap-3">
              <div className="grid place-items-center shrink-0" style={{ width: 32, height: 32, borderRadius: 6, background: "var(--bg-base)", border: "1px solid var(--border-subtle)" }}>
                <Icon size={15} strokeWidth={1.7} />
              </div>
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{o.title}</div>
                <p className="text-soft" style={{ fontSize: 12, lineHeight: 1.5 }}>{o.desc}</p>
              </div>
              {active && <Check size={16} strokeWidth={2.5} className="shrink-0" style={{ color: "var(--color-carbon)" }} />}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function IdentityStep({ p, setP }: { p: Photographer; setP: (p: Photographer) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-soft mb-1" style={{ fontSize: 13, lineHeight: 1.55 }}>
        {p.status === "pro" ? "Identité légale apparaissant sur le contrat." : "Identité personnelle. Pas besoin de SIRET pour vente occasionnelle."}
      </p>
      <Field label="Nom et prénom *" value={p.fullName} onChange={(v) => setP({ ...p, fullName: v })} placeholder="Lucius Martel" />
      <Field label="Nom commercial (optionnel)" value={p.brandName ?? ""} onChange={(v) => setP({ ...p, brandName: v })} placeholder="Lucius Studio" />
      {p.status === "pro" && (
        <Field label="SIRET *" value={p.siret} onChange={(v) => setP({ ...p, siret: v })} placeholder="123 456 789 00012" />
      )}
      {p.status === "occasionnel" && (
        <div
          className="bento-card"
          style={{ padding: 10, fontSize: 11.5, lineHeight: 1.5, color: "var(--text-secondary)", background: "var(--bg-card-hover)" }}
        >
          <strong style={{ color: "var(--text-primary)" }}>Vente occasionnelle.</strong> Au-delà de 3 000 €/an, inscription URSSAF artiste-auteur ou micro-entrepreneur obligatoire (URSSAF guichet unique depuis avril 2026).
        </div>
      )}
    </div>
  );
}

function ContactStep({ p, setP }: { p: Photographer; setP: (p: Photographer) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-soft mb-1" style={{ fontSize: 13, lineHeight: 1.55 }}>
        Coordonnées de contact, utilisées dans le contrat et les emails clients.
      </p>
      <Field label="Email *" type="email" value={p.email} onChange={(v) => setP({ ...p, email: v })} placeholder="contact@studio.fr" />
      <Field label="Téléphone" value={p.phone} onChange={(v) => setP({ ...p, phone: v })} placeholder="+33 6 12 34 56 78" />
      <Field label="Adresse complète *" value={p.address} onChange={(v) => setP({ ...p, address: v })} placeholder="12 rue de l'Image, 75011 Paris" />
      {p.status === "pro" && (
        <Field label="Assurance RC pro" value={p.insurance ?? ""} onChange={(v) => setP({ ...p, insurance: v })} placeholder="MAAF Pro n° 12345678" />
      )}
    </div>
  );
}

function ConfirmStep({ p }: { p: Photographer }) {
  return (
    <div>
      <p className="text-soft mb-3" style={{ fontSize: 13, lineHeight: 1.55 }}>
        Récapitulatif. Ces infos sont sauvegardées 24 mois (cookie + localStorage) et pré-remplissent automatiquement chaque nouveau contrat.
      </p>
      <div
        className="bento-card flex flex-col gap-2"
        style={{ padding: 14, fontSize: 13, background: "var(--bg-card-hover)" }}
      >
        <Row label="Statut" value={p.status === "pro" ? "Photographe pro (SIRET)" : "Photographe occasionnel"} />
        <Row label="Nom" value={p.fullName} />
        {p.brandName && <Row label="Studio" value={p.brandName} />}
        {p.status === "pro" && p.siret && <Row label="SIRET" value={p.siret} />}
        <Row label="Email" value={p.email} />
        {p.phone && <Row label="Téléphone" value={p.phone} />}
        {p.address && <Row label="Adresse" value={p.address} />}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 items-baseline" style={{ fontSize: 13 }}>
      <span className="label-tag" style={{ fontSize: 11 }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="label-eyebrow">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="field-input"
      />
    </label>
  );
}
