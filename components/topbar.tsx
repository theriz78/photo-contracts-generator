"use client";

import Link from "next/link";
import { FileText, Globe2, Trash2, Save } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import type { ContractDraft } from "@/lib/types";

export function TopBar({
  draft,
  onResetDraft,
  onSwitchLang,
}: {
  draft: ContractDraft;
  onResetDraft: () => void;
  onSwitchLang: () => void;
}) {
  const stepLabel = {
    b2b: "Prestation B2B",
    b2c: "Prestation B2C",
    tfp: "Collaboration TFP",
  }[draft.type];

  return (
    <header
      className="no-print sticky top-0 z-30"
      style={{ background: "color-mix(in oklab, var(--bg-base) 88%, transparent)", backdropFilter: "blur(14px)" }}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="flex items-center gap-4" style={{ animation: "cp-fade-in 400ms ease both" }}>
          <Link href="/" className="flex items-center gap-3" data-cursor="hover">
            <div
              className="grid place-items-center"
              style={{ width: 36, height: 36, background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 10 }}
            >
              <FileText size={18} className="text-accent" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="editorial" style={{ fontSize: 18, fontWeight: 380, letterSpacing: "-0.01em" }}>Contrats Photo</span>
              <span className="label-tag" style={{ fontSize: 9, color: "var(--text-mute)" }}>Générateur FR · Studio Lucius</span>
            </div>
          </Link>

          <span className="pill ml-2 hidden sm:inline-flex">
            <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--accent)" }} />
            {stepLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onSwitchLang} className="btn btn-ghost" title="Langue contrat">
            <Globe2 size={14} />
            {draft.language.toUpperCase()}
          </button>
          <button
            onClick={() => {
              try {
                const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `contrat-draft-${draft.id.slice(0, 8)}.json`;
                a.click();
                URL.revokeObjectURL(url);
              } catch {}
            }}
            className="btn btn-ghost"
            title="Exporter le brouillon JSON"
          >
            <Save size={14} />
            Brouillon
          </button>
          <button onClick={onResetDraft} className="btn btn-ghost" title="Réinitialiser">
            <Trash2 size={14} />
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
