"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Eye, ChevronLeft, ChevronRight, X, Menu } from "lucide-react";
import { TopBar } from "@/components/topbar";
import { PreviewPanel } from "@/components/preview-panel";
import { ActionBar } from "@/components/action-bar";
import { PresetPicker } from "@/components/preset-picker";
import { Sidebar } from "@/components/sidebar";
import { OnboardingModal } from "@/components/onboarding-modal";
import {
  StepType,
  StepParties,
  StepPrestation,
  StepTerms,
  StepClauses,
} from "@/components/wizard-steps";
import { CustomCursor } from "@/components/custom-cursor";
import { useDraft } from "@/lib/draft-store";
import { useStudio, isConfigured } from "@/lib/studio-store";
import type { ContractDraft, Photographer } from "@/lib/types";

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
  const { studio, hydrated: studioHydrated, saveProfile } = useStudio();
  const [activeIdx, setActiveIdx] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches) {
      setPreviewOpen(true);
    }
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const sec = SECTIONS[activeIdx];

  useEffect(() => {
    if (!studioHydrated || !hydrated) return;
    if (!isConfigured(studio)) {
      setOnboardingOpen(true);
    } else if (studio.photographer && !draft.photographer.fullName) {
      patch((p) => ({ ...p, photographer: { ...p.photographer, ...studio.photographer! } }));
    }
  }, [studioHydrated, hydrated, studio, draft.photographer.fullName, patch]);

  const handleOnboardingComplete = (photographer: Photographer) => {
    saveProfile(photographer);
    patch((p) => ({ ...p, photographer: { ...p.photographer, ...photographer } }));
    setOnboardingOpen(false);
  };

  const completedCount = useMemo(() => SECTIONS.slice(1).filter((s) => s.isComplete(draft)).length, [draft]);
  const isComplete = (i: number) => SECTIONS[i].isComplete(draft);

  useGSAP(
    () => {
      if (!stageRef.current) return;
      gsap.fromTo(stageRef.current, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" });
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
      <TopBar draft={draft} onResetDraft={reset} onSwitchLang={switchLang} onMenuToggle={() => setSidebarOpen((v) => !v)} onOpenStudio={() => setOnboardingOpen(true)} />

      <div className="flex-1 min-h-0 flex">
        <Sidebar
          sections={SECTIONS}
          activeIdx={activeIdx}
          onSelect={setActiveIdx}
          draft={draft}
          isComplete={isComplete}
          onApplyPreset={applyPreset}
        />

        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex no-print">
            <div className="flex-1" onClick={() => setSidebarOpen(false)} style={{ background: "color-mix(in oklab, var(--color-carbon) 50%, transparent)" }} />
            <div style={{ width: 280, background: "var(--bg-base)", borderLeft: "1px solid var(--border-subtle)" }}>
              <Sidebar
                sections={SECTIONS}
                activeIdx={activeIdx}
                onSelect={(i) => { setActiveIdx(i); setSidebarOpen(false); }}
                draft={draft}
                isComplete={isComplete}
                onApplyPreset={(d) => { applyPreset(d); setSidebarOpen(false); }}
              />
            </div>
          </div>
        )}

        <main className="flex-1 min-h-0 relative no-print" style={{ background: "var(--bg-base)" }}>
          <div className="flex flex-col h-full">
            <SectionHeader sec={sec} idx={activeIdx} completedCount={completedCount} total={SECTIONS.length - 1} />

            <div className="flex-1 min-h-0 grid lg:grid-cols-[1fr_auto]">
              <div className="flex-1 min-h-0 overflow-auto" ref={stageRef} key={sec.id}>
                <div className="mx-auto px-6 py-8" style={{ maxWidth: 880 }}>
                  {sec.id === "preset" && <PresetPicker current={draft} onApply={applyPreset} />}
                  {sec.id === "type" && <StepType draft={draft} patch={patch} />}
                  {sec.id === "parties" && <StepParties draft={draft} patch={patch} />}
                  {sec.id === "prestation" && <StepPrestation draft={draft} patch={patch} />}
                  {sec.id === "terms" && <StepTerms draft={draft} patch={patch} />}
                  {sec.id === "clauses" && <StepClauses draft={draft} patch={patch} />}
                  <div style={{ height: 160 }} />
                </div>
              </div>

              {previewOpen && (
                <aside
                  className="hidden lg:flex flex-col"
                  style={{
                    width: 500,
                    minWidth: 500,
                    borderLeft: "1px solid var(--border-subtle)",
                    background: "var(--bg-elevated)",
                    minHeight: 0,
                  }}
                >
                  <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <div className="flex items-center gap-2">
                      <Eye size={13} />
                      <span className="label-eyebrow" style={{ fontSize: 11 }}>Aperçu live</span>
                    </div>
                    <button onClick={() => setPreviewOpen(false)} className="btn btn-ghost btn-icon" aria-label="Masquer aperçu" data-cursor="hover">
                      <X size={13} />
                    </button>
                  </div>
                  <div className="flex-1 min-h-0 overflow-auto p-5">
                    <PreviewPanel draft={draft} />
                  </div>
                </aside>
              )}
            </div>
          </div>

          {/* Toggle preview button when hidden (desktop) */}
          {!previewOpen && (
            <button
              onClick={() => setPreviewOpen(true)}
              className="hidden lg:flex no-print btn btn-ghost"
              style={{ position: "absolute", top: 12, right: 12, zIndex: 10 }}
              aria-label="Afficher aperçu"
              data-cursor="hover"
            >
              <Eye size={14} />
              Aperçu
            </button>
          )}

          {/* Mobile preview drawer */}
          <button
            onClick={() => setPreviewOpen(true)}
            className="lg:hidden fixed bottom-24 right-3 btn btn-ghost no-print"
            style={{ zIndex: 25, padding: "9px 14px", background: "var(--bg-elevated)" }}
            aria-label="Voir aperçu"
          >
            <Eye size={13} />
            Aperçu
          </button>

          {previewOpen && (
            <div className="lg:hidden fixed inset-0 z-40 no-print" style={{ background: "color-mix(in oklab, var(--color-carbon) 60%, transparent)" }} onClick={() => setPreviewOpen(false)}>
              <div className="absolute inset-x-3 bottom-3 top-16 bento-card flex flex-col" style={{ padding: 0 }} onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <span className="label-eyebrow">Aperçu live</span>
                  <button onClick={() => setPreviewOpen(false)} className="btn btn-ghost btn-icon" aria-label="Fermer">
                    <X size={13} />
                  </button>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  <PreviewPanel draft={draft} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <ActionBar draft={draft} />

      {onboardingOpen && (
        <OnboardingModal
          initial={studio.photographer}
          onComplete={handleOnboardingComplete}
          onSkip={isConfigured(studio) ? () => setOnboardingOpen(false) : undefined}
        />
      )}

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
  total,
}: {
  sec: SectionDef;
  idx: number;
  completedCount: number;
  total: number;
}) {
  const pct = (completedCount / total) * 100;
  return (
    <div className="no-print" style={{ borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-base)" }}>
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="grid place-items-center shrink-0"
            style={{
              width: 26,
              height: 26,
              borderRadius: 999,
              border: "1px solid var(--border-strong)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--text-secondary)",
              fontWeight: 500,
            }}
          >
            {sec.num}
          </span>
          <div className="min-w-0">
            <h1 className="display-md" style={{ fontWeight: 600, fontSize: 16, lineHeight: 1.2 }}>
              {sec.title}
            </h1>
            <p className="text-mute" style={{ fontSize: 12, marginTop: 1 }}>
              {sec.hint}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div style={{ width: 90, height: 2, background: "var(--border-subtle)", borderRadius: 999, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: "var(--text-primary)",
                transition: "width 600ms cubic-bezier(.2,.7,.2,1)",
              }}
            />
          </div>
          <span className="label-tag" style={{ fontSize: 11 }}>
            {completedCount.toString().padStart(2, "0")} / {total.toString().padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
