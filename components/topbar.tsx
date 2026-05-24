"use client";

import Link from "next/link";
import { Globe2, Trash2, Save, Menu } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import type { ContractDraft } from "@/lib/types";

export function TopBar({
  draft,
  onResetDraft,
  onSwitchLang,
  onMenuToggle,
}: {
  draft: ContractDraft;
  onResetDraft: () => void;
  onSwitchLang: () => void;
  onMenuToggle?: () => void;
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
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-2">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="lg:hidden btn btn-ghost btn-icon"
              aria-label="Menu"
              data-cursor="hover"
              style={{ padding: 7, width: 32, height: 32 }}
            >
              <Menu size={16} />
            </button>
          )}
          <Link href="/" className="flex items-center gap-2" data-cursor="hover" aria-label="Accueil">
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: 15,
                letterSpacing: "-0.01em",
                color: "var(--text-primary)",
              }}
            >
              Contrats Photo
            </span>
            <span
              className="hidden sm:inline-block"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--text-muted)",
                paddingLeft: 8,
                marginLeft: 2,
                borderLeft: "1px solid var(--border-strong)",
              }}
            >
              Studio Lucius
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-1">
          <button
            onClick={onSwitchLang}
            className="hidden sm:inline-flex btn btn-ghost"
            style={{ padding: "6px 10px", fontSize: 12 }}
            data-cursor="hover"
          >
            <Globe2 size={12} />
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
            className="hidden md:inline-flex btn btn-ghost"
            style={{ padding: "6px 10px", fontSize: 12 }}
            data-cursor="hover"
            title="Exporter brouillon"
          >
            <Save size={12} />
            Brouillon
          </button>
          <button
            onClick={() => { if (confirm("Réinitialiser le contrat ?")) onResetDraft(); }}
            className="btn btn-ghost btn-icon"
            data-cursor="hover"
            aria-label="Réinitialiser"
            style={{ padding: 7, width: 32, height: 32 }}
          >
            <Trash2 size={14} />
          </button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
