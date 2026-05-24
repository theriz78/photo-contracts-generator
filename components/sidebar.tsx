"use client";

import { Check, Sparkles, Briefcase, User, Heart, Palette, Flame } from "lucide-react";
import type { ContractDraft } from "@/lib/types";
import { PRESETS } from "@/lib/presets";

const ICONS: Record<string, typeof Briefcase> = {
  "corporate-b2b": Briefcase,
  "portrait-b2c": User,
  "tfp-collab": Heart,
  artistique: Palette,
  boudoir: Flame,
};

export interface SidebarSection {
  id: string;
  num: string;
  title: string;
  hint: string;
}

export function Sidebar({
  sections,
  activeIdx,
  onSelect,
  draft,
  isComplete,
  onApplyPreset,
}: {
  sections: SidebarSection[];
  activeIdx: number;
  onSelect: (i: number) => void;
  draft: ContractDraft;
  isComplete: (i: number) => boolean;
  onApplyPreset: (next: ContractDraft) => void;
}) {
  return (
    <aside
      className="no-print hidden lg:flex flex-col"
      style={{
        width: 260,
        minWidth: 260,
        background: "var(--bg-base)",
        borderRight: "1px solid var(--border-subtle)",
        height: "100%",
      }}
    >
      <div style={{ padding: "16px 14px 8px", borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="label-eyebrow" style={{ fontSize: 11, padding: "6px 8px" }}>
          Sections
        </div>
      </div>

      <nav className="flex-1 overflow-auto" style={{ padding: "6px 8px" }}>
        {sections.map((s, i) => {
          const active = i === activeIdx;
          const done = isComplete(i) && i > 0;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(i)}
              className="cp-sidebar-item"
              data-cursor="hover"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "9px 10px",
                marginBottom: 1,
                borderRadius: 6,
                background: active ? "var(--bg-card-hover)" : "transparent",
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                cursor: "pointer",
                textAlign: "left",
                transition: "background 160ms ease, color 160ms ease",
                fontSize: 14,
                fontWeight: active ? 500 : 400,
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "var(--bg-card-hover)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              <span
                className="grid place-items-center shrink-0"
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: done ? "var(--color-snow)" : active ? "var(--text-primary)" : "var(--text-muted)",
                  background: done ? "var(--color-carbon)" : "transparent",
                  border: done ? "1px solid var(--color-carbon)" : "1px solid var(--border-strong)",
                  fontWeight: 500,
                }}
              >
                {done ? <Check size={11} /> : s.num}
              </span>
              <span className="truncate flex-1">{s.title}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ padding: "8px 12px 14px", borderTop: "1px solid var(--border-subtle)" }}>
        <div className="flex items-center gap-2 mb-2 px-1">
          <Sparkles size={11} className="text-mute" />
          <span className="label-eyebrow" style={{ fontSize: 10 }}>Presets</span>
        </div>
        <div className="flex flex-col gap-1">
          {PRESETS.map((p) => {
            const Icon = ICONS[p.id] ?? Heart;
            return (
              <button
                key={p.id}
                onClick={() => onApplyPreset(p.apply(draft))}
                className="cp-sidebar-preset"
                data-cursor="hover"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "7px 10px",
                  borderRadius: 6,
                  background: "transparent",
                  color: "var(--text-secondary)",
                  textAlign: "left",
                  fontSize: 13,
                  transition: "background 160ms ease, color 160ms ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--bg-card-hover)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                <Icon size={13} style={{ opacity: 0.7 }} />
                <span className="truncate">{p.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
