"use client";

import { useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Eye, ChevronDown, Check } from "lucide-react";
import { TopBar } from "@/components/topbar";
import { PreviewPanel } from "@/components/preview-panel";
import { ActionBar } from "@/components/action-bar";
import { PresetPicker } from "@/components/preset-picker";
import {
  StepType,
  StepParties,
  StepPrestation,
  StepTerms,
  StepClauses,
} from "@/components/wizard-steps";
import { CustomCursor } from "@/components/custom-cursor";
import { useDraft } from "@/lib/draft-store";
import type { ContractDraft } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SectionDef {
  id: string;
  num: string;
  title: string;
  hint: string;
  isComplete: (d: ContractDraft) => boolean;
}

const SECTIONS: SectionDef[] = [
  {
    id: "type",
    num: "01",
    title: "Type et niche",
    hint: "Choix juridique du cadre + métier",
    isComplete: (d) => !!d.type && !!d.niche,
  },
  {
    id: "parties",
    num: "02",
    title: "Identités",
    hint: "Photographe + client",
    isComplete: (d) =>
      !!d.photographer.fullName &&
      !!d.photographer.siret &&
      !!d.photographer.email &&
      !!d.client.fullName &&
      !!d.client.email,
  },
  {
    id: "prestation",
    num: "03",
    title: "Prestation",
    hint: "Date, lieu, livrables",
    isComplete: (d) => !!d.service.title && !!d.service.date && !!d.service.location,
  },
  {
    id: "terms",
    num: "04",
    title: "Conditions et cession",
    hint: "Tarif ou contreparties + droits L.131-3",
    isComplete: (d) =>
      (d.type === "tfp" ? !!d.tfpCounterparts?.retouchedCount : !!d.pricing?.amount) &&
      d.cession.rights.length > 0,
  },
  {
    id: "clauses",
    num: "05",
    title: "Clauses et signature",
    hint: "Activations finales + lieu/date signature",
    isComplete: (d) => !!d.signaturePlace && !!d.signatureDate,
  },
];

export default function Home() {
  const { draft, patch, setDraft, reset, hydrated } = useDraft();
  const [openSection, setOpenSection] = useState<string>("type");
  const [previewOpen, setPreviewOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const completedCount = useMemo(
    () => SECTIONS.filter((s) => s.isComplete(draft)).length,
    [draft],
  );

  const progress = (completedCount / SECTIONS.length) * 100;

  useGSAP(
    () => {
      gsap.from(".cp-section", {
        opacity: 0,
        y: 14,
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
      });
    },
    { scope: wrapRef, dependencies: [hydrated] },
  );

  const switchLang = () => patch((p) => ({ ...p, language: p.language === "fr" ? "en" : "fr" }));

  const applyPreset = (next: ContractDraft) => {
    setDraft(next);
    setOpenSection("parties");
    window.scrollTo({ top: 320, behavior: "smooth" });
  };

  const advanceFromSection = (id: string) => {
    const idx = SECTIONS.findIndex((s) => s.id === id);
    const next = SECTIONS[idx + 1];
    if (next) setOpenSection(next.id);
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen grid place-items-center text-mute text-sm">Chargement…</div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ paddingBottom: 110 }}>
      <CustomCursor />
      <TopBar draft={draft} onResetDraft={reset} onSwitchLang={switchLang} />

      <main className="flex-1 px-4 sm:px-6 py-8">
        <div ref={wrapRef} className="mx-auto" style={{ maxWidth: 1480 }}>
          {/* Heading + progress */}
          <header className="no-print mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span style={{ width: 28, height: 1, background: "var(--accent)" }} />
              <span className="label-eyebrow" style={{ letterSpacing: "0.22em" }}>
                Studio Lucius · Édition 2026
              </span>
            </div>
            <h1
              className="editorial"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontWeight: 380,
                fontSize: "clamp(2.4rem, 6vw, 5.2rem)",
                lineHeight: 0.96,
                letterSpacing: "-0.04em",
                maxWidth: 900,
              }}
            >
              Génère ton contrat photo{" "}
              <em className="editorial-italic" style={{ color: "var(--accent)" }}>en cinq pièces</em>.
            </h1>

            <div className="mt-8 flex items-center gap-5">
              <div className="flex-1 max-w-md" style={{ height: 2, background: "var(--border-subtle)", borderRadius: 999, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: "var(--accent)",
                    transition: "width 600ms cubic-bezier(.2,.7,.2,1)",
                  }}
                />
              </div>
              <span className="label-tag" style={{ color: "var(--text-secondary)" }}>
                {completedCount} / {SECTIONS.length} sections complètes
              </span>
            </div>
          </header>

          {/* Preset bar */}
          <div className="cp-section mb-10">
            <PresetPicker current={draft} onApply={applyPreset} />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,640px)]">
            {/* Sections accordion */}
            <div className="flex flex-col gap-3">
              {SECTIONS.map((sec) => {
                const open = openSection === sec.id;
                const done = sec.isComplete(draft);
                return (
                  <SectionCard
                    key={sec.id}
                    sec={sec}
                    open={open}
                    done={done}
                    onToggle={() => setOpenSection(open ? "" : sec.id)}
                    onContinue={() => advanceFromSection(sec.id)}
                  >
                    {sec.id === "type" && <StepType draft={draft} patch={patch} />}
                    {sec.id === "parties" && <StepParties draft={draft} patch={patch} />}
                    {sec.id === "prestation" && <StepPrestation draft={draft} patch={patch} />}
                    {sec.id === "terms" && <StepTerms draft={draft} patch={patch} />}
                    {sec.id === "clauses" && <StepClauses draft={draft} patch={patch} />}
                  </SectionCard>
                );
              })}
            </div>

            {/* Preview */}
            <aside
              className={cn("no-print", previewOpen ? "block" : "hidden lg:block")}
              style={{
                position: "sticky",
                top: 90,
                alignSelf: "flex-start",
                maxHeight: "calc(100vh - 110px)",
                overflow: "auto",
              }}
            >
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                  <Eye size={14} className="text-accent" />
                  <span className="label-eyebrow">Aperçu live</span>
                </div>
                <span className="text-xs text-mute" style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic" }}>
                  Mis à jour en direct
                </span>
              </div>
              <PreviewPanel draft={draft} />
            </aside>

            <div className="print-only" style={{ display: "none" }}>
              <PreviewPanel draft={draft} />
            </div>
          </div>

          <button
            onClick={() => setPreviewOpen((v) => !v)}
            className="no-print fixed bottom-24 right-4 lg:hidden btn btn-ghost"
            style={{ zIndex: 25, padding: "10px 14px", boxShadow: "0 10px 24px -8px rgba(0,0,0,0.4)", background: "var(--bg-card)" }}
          >
            <Eye size={14} />
            {previewOpen ? "Masquer" : "Aperçu"}
          </button>
        </div>
      </main>

      <ActionBar draft={draft} />

      <footer className="no-print px-6 py-8 mt-12 text-center text-xs text-mute">
        <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic" }}>
          Modèle indicatif, non substituable à un conseil juridique pour les enjeux importants.
        </p>
        <p className="mt-1" style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}>
          L.131-3 CPI · Art. 9 Code civil · L.441-10 Code commerce · L.221-18 Code consommation · 293 B CGI
        </p>
      </footer>
    </div>
  );
}

function SectionCard({
  sec,
  open,
  done,
  onToggle,
  onContinue,
  children,
}: {
  sec: SectionDef;
  open: boolean;
  done: boolean;
  onToggle: () => void;
  onContinue: () => void;
  children: React.ReactNode;
}) {
  return (
    <article
      className="cp-section bento-card no-print"
      style={{
        padding: 0,
        overflow: "hidden",
        borderColor: open ? "var(--border-strong)" : "var(--border-subtle)",
        background: open ? "var(--bg-card)" : "var(--bg-elevated)",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4"
        style={{ padding: "20px 24px", textAlign: "left", cursor: "pointer" }}
        data-cursor="hover"
      >
        <div className="flex items-center gap-4 min-w-0">
          <span
            className="grid place-items-center shrink-0"
            style={{
              width: 36,
              height: 36,
              borderRadius: 999,
              background: done ? "var(--accent)" : open ? "var(--bg-elevated)" : "transparent",
              border: done ? "1px solid var(--accent)" : "1px solid var(--border-subtle)",
              color: done ? "var(--color-ink-9)" : "var(--text-secondary)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.04em",
              transition: "all 300ms cubic-bezier(.2,.7,.2,1)",
            }}
          >
            {done ? <Check size={14} /> : sec.num}
          </span>
          <div className="min-w-0">
            <h2
              className="editorial truncate"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontWeight: 380,
                fontSize: "clamp(1.3rem, 2vw, 1.7rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.015em",
              }}
            >
              {sec.title}
            </h2>
            <p
              className="text-mute mt-0.5 truncate"
              style={{ fontSize: 12, fontFamily: "var(--font-mono)" }}
            >
              {sec.hint}
            </p>
          </div>
        </div>
        <ChevronDown
          size={20}
          className="shrink-0"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 280ms cubic-bezier(.2,.7,.2,1)",
            color: "var(--text-secondary)",
          }}
        />
      </button>

      {open && (
        <div style={{ padding: "0 24px 24px 24px", borderTop: "1px solid var(--border-subtle)" }}>
          <div style={{ paddingTop: 20 }}>{children}</div>
          <div className="flex justify-end mt-6">
            <button onClick={onContinue} className="btn btn-primary">
              Section suivante
              <ChevronDown size={14} style={{ transform: "rotate(-90deg)" }} />
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
