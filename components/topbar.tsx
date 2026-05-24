"use client";

import Link from "next/link";
import { Globe2, Trash2, Save } from "lucide-react";
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
  return (
    <header
      className="no-print"
      style={{
        background: "var(--bg-base)",
        borderBottom: "1px solid var(--border-subtle)",
        position: "relative",
        zIndex: 30,
      }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3" data-cursor="hover" aria-label="Accueil">
          <span
            className="editorial"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontWeight: 720,
              fontSize: 28,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: "var(--text-primary)",
            }}
          >
            c.
          </span>
          <span className="hidden sm:flex flex-col leading-tight ml-1">
            <span style={{ fontSize: 12, fontFamily: "var(--font-body)", fontWeight: 500, color: "var(--text-primary)" }}>Contrats Photo</span>
            <span className="label-tag" style={{ fontSize: 9, color: "var(--text-muted)" }}>Studio Lucius · 2026</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <button onClick={onSwitchLang} className="hidden sm:inline-flex items-center gap-1.5" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)", padding: "8px 12px", textTransform: "uppercase", letterSpacing: "0.08em" }} data-cursor="hover">
            <Globe2 size={12} />
            {draft.language}
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
            className="hidden md:inline-flex items-center gap-1.5"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)", padding: "8px 12px", textTransform: "uppercase", letterSpacing: "0.08em" }}
            data-cursor="hover"
            title="Exporter brouillon"
          >
            <Save size={12} />
            Brouillon
          </button>
          <button
            onClick={() => { if (confirm("Réinitialiser le contrat ?")) onResetDraft(); }}
            className="inline-flex items-center"
            style={{ padding: 8, color: "var(--text-muted)" }}
            data-cursor="hover"
            aria-label="Réinitialiser"
          >
            <Trash2 size={14} />
          </button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
