"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Eye, ChevronRight, ChevronLeft } from "lucide-react";
import { TopBar } from "@/components/topbar";
import { PreviewPanel } from "@/components/preview-panel";
import { ActionBar } from "@/components/action-bar";
import { StepType, StepParties, StepPrestation, StepTerms, StepClauses } from "@/components/wizard-steps";
import { useDraft } from "@/lib/draft-store";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "type", label: "Type" },
  { id: "parties", label: "Parties" },
  { id: "prestation", label: "Prestation" },
  { id: "terms", label: "Conditions" },
  { id: "clauses", label: "Clauses" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

export default function Home() {
  const { draft, patch, reset, hydrated } = useDraft();
  const [activeStep, setActiveStep] = useState<StepId>("type");
  const [previewOpen, setPreviewOpen] = useState(false);

  const stepNavRef = useRef<HTMLDivElement>(null);
  const stepBtnsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const stepPillRef = useRef<HTMLDivElement>(null);
  const stepContentRef = useRef<HTMLDivElement>(null);

  const currentIdx = STEPS.findIndex((s) => s.id === activeStep);

  useGSAP(
    () => {
      const btn = stepBtnsRef.current[currentIdx];
      if (!btn || !stepPillRef.current) return;
      gsap.to(stepPillRef.current, {
        x: btn.offsetLeft,
        width: btn.offsetWidth,
        duration: 0.42,
        ease: "power3.out",
      });
    },
    { dependencies: [currentIdx], scope: stepNavRef },
  );

  useGSAP(
    () => {
      if (!stepContentRef.current) return;
      gsap.fromTo(
        stepContentRef.current,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.32, ease: "power2.out" },
      );
    },
    { dependencies: [activeStep], scope: stepContentRef },
  );

  const switchLang = () => {
    patch((p) => ({ ...p, language: p.language === "fr" ? "en" : "fr" }));
  };

  const goNext = () => {
    if (currentIdx < STEPS.length - 1) setActiveStep(STEPS[currentIdx + 1].id);
  };
  const goPrev = () => {
    if (currentIdx > 0) setActiveStep(STEPS[currentIdx - 1].id);
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen grid place-items-center text-mute text-sm">
        Chargement…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar draft={draft} onResetDraft={reset} onSwitchLang={switchLang} />

      <main className="flex-1 px-4 sm:px-6 py-6">
        <div className="mx-auto" style={{ maxWidth: 1480 }}>
          <nav className="no-print mb-6">
            <div
              ref={stepNavRef}
              className="relative flex items-center gap-1 p-1 rounded-2xl"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", width: "fit-content" }}
            >
              <div
                ref={stepPillRef}
                aria-hidden
                style={{
                  position: "absolute",
                  top: 4,
                  left: 0,
                  height: "calc(100% - 8px)",
                  background: "var(--accent)",
                  borderRadius: 10,
                  zIndex: 0,
                  width: 0,
                }}
              />
              {STEPS.map((s, i) => {
                const active = activeStep === s.id;
                const done = i < currentIdx;
                return (
                  <button
                    key={s.id}
                    ref={(el) => {
                      stepBtnsRef.current[i] = el;
                    }}
                    onClick={() => setActiveStep(s.id)}
                    className="relative"
                    style={{
                      padding: "8px 14px",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 500,
                      color: active ? "var(--bg-base)" : done ? "var(--text-primary)" : "var(--text-secondary)",
                      transition: "color 240ms",
                      zIndex: 1,
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <span style={{ fontSize: 10, opacity: 0.7 }}>0{i + 1}</span>
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="grid gap-4 lg:grid-cols-[1fr_minmax(0,640px)]">
            <div className="flex flex-col gap-4">
              <div ref={stepContentRef} key={activeStep}>
                {activeStep === "type" && <StepType draft={draft} patch={patch} />}
                {activeStep === "parties" && <StepParties draft={draft} patch={patch} />}
                {activeStep === "prestation" && <StepPrestation draft={draft} patch={patch} />}
                {activeStep === "terms" && <StepTerms draft={draft} patch={patch} />}
                {activeStep === "clauses" && <StepClauses draft={draft} patch={patch} />}
              </div>

              <div className="no-print flex items-center justify-between gap-2 mt-2">
                <button onClick={goPrev} disabled={currentIdx === 0} className="btn btn-ghost" style={{ opacity: currentIdx === 0 ? 0.4 : 1 }}>
                  <ChevronLeft size={14} />
                  Précédent
                </button>
                <button onClick={() => setPreviewOpen((v) => !v)} className="btn btn-ghost lg:hidden">
                  <Eye size={14} />
                  {previewOpen ? "Masquer aperçu" : "Voir aperçu"}
                </button>
                {currentIdx < STEPS.length - 1 ? (
                  <button onClick={goNext} className="btn btn-primary">
                    {STEPS[currentIdx + 1].label}
                    <ChevronRight size={14} />
                  </button>
                ) : (
                  <button onClick={() => window.print()} className="btn btn-primary">
                    Exporter PDF
                  </button>
                )}
              </div>
            </div>

            <aside
              className={cn("no-print", previewOpen ? "block" : "hidden lg:block")}
              style={{ position: "sticky", top: 90, alignSelf: "flex-start", maxHeight: "calc(100vh - 110px)", overflow: "auto" }}
            >
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                  <Eye size={14} className="text-accent" />
                  <span className="label-eyebrow">Aperçu live</span>
                </div>
                <span className="text-xs text-mute">Mis à jour automatiquement</span>
              </div>
              <PreviewPanel draft={draft} />
            </aside>

            <div className="print-only" style={{ display: "none" }}>
              <PreviewPanel draft={draft} />
            </div>
          </div>
        </div>
      </main>

      <ActionBar draft={draft} />

      <footer className="no-print px-6 py-8 mt-12 text-center text-xs text-mute">
        <p>Ce générateur produit des modèles indicatifs. Ne remplace pas un conseil juridique individualisé pour les enjeux importants.</p>
        <p className="mt-1">Conformité Art. L.131-3 CPI · Art. 9 Code civil · Art. L.441-10 Code commerce · Art. L.221-18 Code consommation · Art. 293 B CGI.</p>
      </footer>
    </div>
  );
}
