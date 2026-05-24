"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Eye, ChevronRight, ChevronLeft, Check, X } from "lucide-react";
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

interface SectionDef {
  id: string;
  num: string;
  title: string;
  hint: string;
  isComplete: (d: ContractDraft) => boolean;
}

const SECTIONS: SectionDef[] = [
  { id: "preset", num: "00", title: "Démarrage", hint: "Cinq presets one-click", isComplete: () => true },
  { id: "type", num: "01", title: "Type + Niche", hint: "Cadre juridique + métier", isComplete: (d) => !!d.type && !!d.niche },
  {
    id: "parties",
    num: "02",
    title: "Identités",
    hint: "Photographe + client",
    isComplete: (d) =>
      !!d.photographer.fullName && !!d.photographer.email && !!d.client.fullName && !!d.client.email,
  },
  { id: "prestation", num: "03", title: "Prestation", hint: "Date · Lieu · Livrables", isComplete: (d) => !!d.service.title && !!d.service.date && !!d.service.location },
  {
    id: "terms",
    num: "04",
    title: "Conditions",
    hint: "Tarif / TFP · Cession L.131-3",
    isComplete: (d) =>
      (d.type === "tfp" ? !!d.tfpCounterparts?.retouchedCount : !!d.pricing?.amount) && d.cession.rights.length > 0,
  },
  { id: "clauses", num: "05", title: "Clauses · Signature", hint: "Activations + lieu/date", isComplete: (d) => !!d.signaturePlace && !!d.signatureDate },
];

export default function Home() {
  const { draft, patch, setDraft, reset, hydrated } = useDraft();
  const [activeIdx, setActiveIdx] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sec = SECTIONS[activeIdx];

  const completedCount = useMemo(() => SECTIONS.slice(1).filter((s) => s.isComplete(draft)).length, [draft]);

  useGSAP(
    () => {
      if (!stageRef.current) return;
      gsap.fromTo(
        stageRef.current,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.42, ease: "power3.out" },
      );
    },
    { dependencies: [activeIdx], scope: stageRef },
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight" && activeIdx < SECTIONS.length - 1) setActiveIdx(activeIdx + 1);
      if (e.key === "ArrowLeft" && activeIdx > 0) setActiveIdx(activeIdx - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIdx]);

  const switchLang = () => patch((p) => ({ ...p, language: p.language === "fr" ? "en" : "fr" }));
  const applyPreset = (next: ContractDraft) => {
    setDraft(next);
    setActiveIdx(2);
  };

  if (!hydrated) {
    return <div className="h-screen grid place-items-center text-mute text-sm">Chargement…</div>;
  }

  return (
    <div className="cp-shell" style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <CustomCursor />
      <TopBar draft={draft} onResetDraft={reset} onSwitchLang={switchLang} />

      <main ref={wrapRef} className="flex-1 min-h-0 relative no-print">
        <div className="grid lg:grid-cols-[1fr_minmax(0,540px)] h-full">
          {/* Stage */}
          <div className="flex flex-col min-h-0">
            <SectionHeader sec={sec} idx={activeIdx} completedCount={completedCount} />
            <div className="flex-1 min-h-0 overflow-auto px-6 pb-6 cp-stage-scroll" ref={stageRef} key={sec.id}>
              <div className="mx-auto" style={{ maxWidth: 920 }}>
                {sec.id === "preset" && <PresetPicker current={draft} onApply={applyPreset} />}
                {sec.id === "type" && <StepType draft={draft} patch={patch} />}
                {sec.id === "parties" && <StepParties draft={draft} patch={patch} />}
                {sec.id === "prestation" && <StepPrestation draft={draft} patch={patch} />}
                {sec.id === "terms" && <StepTerms draft={draft} patch={patch} />}
                {sec.id === "clauses" && <StepClauses draft={draft} patch={patch} />}
              </div>
            </div>
          </div>

          {/* Preview pane */}
          <aside
            className="hidden lg:flex flex-col min-h-0"
            style={{ borderLeft: "1px solid var(--border-subtle)", background: "var(--bg-elevated)" }}
          >
            <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <div className="flex items-center gap-2">
                <Eye size={14} className="text-accent" />
                <span className="label-eyebrow">Aperçu</span>
              </div>
              <span className="text-xs text-mute" style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic" }}>
                Live
              </span>
            </div>
            <div className="flex-1 min-h-0 overflow-auto p-5">
              <PreviewPanel draft={draft} />
            </div>
          </aside>
        </div>

        {/* Mobile preview drawer toggle */}
        <button
          onClick={() => setPreviewOpen(true)}
          className="lg:hidden fixed bottom-24 right-3 btn btn-ghost no-print"
          style={{ zIndex: 25, padding: "10px 14px", background: "var(--bg-card)", boxShadow: "0 10px 24px -10px rgba(0,0,0,0.5)" }}
          aria-label="Voir aperçu"
        >
          <Eye size={14} />
          Aperçu
        </button>

        {previewOpen && (
          <div className="lg:hidden fixed inset-0 z-40" style={{ background: "color-mix(in oklab, var(--bg-base) 90%, transparent)", backdropFilter: "blur(12px)" }}>
            <div className="absolute inset-x-3 bottom-3 top-16 bento-card flex flex-col" style={{ padding: 0 }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <span className="label-eyebrow">Aperçu live</span>
                <button onClick={() => setPreviewOpen(false)} className="btn btn-ghost btn-icon" aria-label="Fermer">
                  <X size={14} />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <PreviewPanel draft={draft} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mini-map */}
      <MiniMap sections={SECTIONS} activeIdx={activeIdx} onSelect={setActiveIdx} draft={draft} />

      <ActionBar draft={draft} />

      {/* Print-only full render */}
      <div className="print-only" style={{ display: "none" }}>
        <PreviewPanel draft={draft} />
      </div>
    </div>
  );
}

function SectionHeader({
  sec,
  idx,
  completedCount,
}: {
  sec: SectionDef;
  idx: number;
  completedCount: number;
}) {
  const total = 5;
  const pct = (completedCount / total) * 100;
  return (
    <div className="no-print" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
      <div
        className="px-8 pt-4 pb-2 flex items-center justify-between gap-4"
        style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.14em", textTransform: "uppercase" }}
      >
        <div className="flex items-center gap-2">
          <span style={{ fontWeight: 500 }}>SOTD</span>
          <span style={{ opacity: 0.4 }}>/</span>
          <span>Section {sec.num}</span>
        </div>
        <div className="flex items-center gap-3">
          <div style={{ width: 80, height: 1, background: "var(--border-strong)", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: "var(--text-primary)",
                transition: "width 600ms cubic-bezier(.2,.7,.2,1)",
              }}
            />
          </div>
          <span>{completedCount.toString().padStart(2, "0")} / {total.toString().padStart(2, "0")}</span>
        </div>
      </div>

      <div className="px-8 pb-7 pt-2 text-center">
        <h1
          className="display-massive-serif"
          style={{ color: "var(--text-primary)", display: "block", marginBottom: 12 }}
        >
          {sec.title}
        </h1>
        <div className="arrow-eyebrow" style={{ justifyContent: "center" }}>
          {sec.hint}
        </div>
      </div>
    </div>
  );
}

function MiniMap({
  sections,
  activeIdx,
  onSelect,
  draft,
}: {
  sections: SectionDef[];
  activeIdx: number;
  onSelect: (i: number) => void;
  draft: ContractDraft;
}) {
  return (
    <nav
      className="no-print"
      aria-label="Sections"
      style={{
        position: "fixed",
        left: "50%",
        bottom: 72,
        transform: "translateX(-50%)",
        zIndex: 28,
        display: "flex",
        gap: 6,
        padding: 6,
        borderRadius: 999,
        background: "color-mix(in oklab, var(--bg-card) 88%, transparent)",
        backdropFilter: "blur(14px)",
        border: "1px solid var(--border-subtle)",
        boxShadow: "0 14px 40px -10px color-mix(in oklab, var(--bg-base) 60%, transparent)",
      }}
    >
      <button
        onClick={() => onSelect(Math.max(0, activeIdx - 1))}
        disabled={activeIdx === 0}
        className="btn btn-ghost btn-icon"
        style={{ width: 32, height: 32, padding: 0, opacity: activeIdx === 0 ? 0.35 : 1 }}
        aria-label="Section précédente"
      >
        <ChevronLeft size={14} />
      </button>

      {sections.map((s, i) => {
        const active = i === activeIdx;
        const done = s.isComplete(draft) && i > 0;
        return (
          <button
            key={s.id}
            onClick={() => onSelect(i)}
            title={s.title}
            aria-label={s.title}
            data-cursor="hover"
            style={{
              minWidth: 32,
              height: 32,
              padding: "0 10px",
              borderRadius: 999,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: active ? "var(--accent)" : "transparent",
              color: active ? "var(--color-ink-9)" : done ? "var(--text-primary)" : "var(--text-secondary)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 500,
              border: "1px solid",
              borderColor: active ? "var(--accent)" : "transparent",
              transition: "all 220ms cubic-bezier(.2,.7,.2,1)",
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            {done && !active ? <Check size={11} /> : s.num}
          </button>
        );
      })}

      <button
        onClick={() => onSelect(Math.min(sections.length - 1, activeIdx + 1))}
        disabled={activeIdx === sections.length - 1}
        className="btn btn-ghost btn-icon"
        style={{ width: 32, height: 32, padding: 0, opacity: activeIdx === sections.length - 1 ? 0.35 : 1 }}
        aria-label="Section suivante"
      >
        <ChevronRight size={14} />
      </button>
    </nav>
  );
}
