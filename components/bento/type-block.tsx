"use client";

import { Building2, User, Heart, Check } from "lucide-react";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ContractDraft, ContractType } from "@/lib/types";

const TYPES: { id: ContractType; title: string; tag: string; bullets: string[]; icon: typeof Building2 }[] = [
  { id: "b2b", title: "B2B", tag: "Entreprise · SARL · SAS", icon: Building2, bullets: ["K-bis vérifié", "LME 60j net", "Pénalités L.441-10", "Cession commerciale"] },
  { id: "b2c", title: "B2C", tag: "Particulier · Consommateur", icon: User, bullets: ["Rétractation 14j", "Code conso L.221-18", "Médiation gratuite", "Acompte plafonné"] },
  { id: "tfp", title: "TFP", tag: "Time For Print · Modèle", icon: Heart, bullets: ["Licence mutuelle", "Anti-donation 931", "Crédit obligatoire", "Exclusivité temps"] },
];

export function TypeBlock({
  draft,
  patch,
}: {
  draft: ContractDraft;
  patch: (p: (prev: ContractDraft) => ContractDraft) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".cp-type-card", { opacity: 0, y: 12, duration: 0.45, stagger: 0.06, ease: "power2.out" });
    },
    { scope: wrapRef },
  );

  return (
    <div ref={wrapRef} className="flex flex-col gap-4">
      <BentoHeader eyebrow="01 · Cadre juridique" title="Choisis le type de contrat" hint={`Actif : ${draft.type.toUpperCase()}`} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {TYPES.map((t) => {
          const Icon = t.icon;
          const active = draft.type === t.id;
          return (
            <button
              key={t.id}
              onClick={() => patch((p) => ({ ...p, type: t.id }))}
              className="cp-type-card cp-lift text-left"
              data-cursor="hover"
              aria-pressed={active}
              style={{
                position: "relative",
                padding: 18,
                borderRadius: 6,
                background: active ? "var(--color-carbon)" : "var(--color-snow)",
                color: active ? "var(--color-snow)" : "var(--text-primary)",
                border: `1px solid ${active ? "var(--color-carbon)" : "var(--border-subtle)"}`,
                transition: "all 220ms cubic-bezier(.2,.7,.2,1)",
                cursor: "pointer",
                overflow: "hidden",
                minHeight: 200,
              }}
            >
              {active && (
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    background: "var(--color-snow)",
                    color: "var(--color-carbon)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Check size={12} strokeWidth={3} />
                </span>
              )}
              <Icon size={28} strokeWidth={1.4} style={{ marginBottom: 18, opacity: 0.9 }} />
              <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, letterSpacing: "-0.02em", marginBottom: 4 }}>
                {t.title}
              </div>
              <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", opacity: active ? 0.7 : 0.6, marginBottom: 16 }}>
                {t.tag}
              </div>
              <ul style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {t.bullets.map((b) => (
                  <li
                    key={b}
                    style={{
                      fontSize: 12,
                      lineHeight: 1.4,
                      opacity: active ? 0.85 : 0.7,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span style={{ width: 3, height: 3, borderRadius: 999, background: "currentColor", opacity: 0.5 }} />
                    {b}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function BentoHeader({ eyebrow, title, hint }: { eyebrow: string; title: string; hint?: string }) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-3 mb-1">
      <div>
        <div className="label-eyebrow" style={{ fontSize: 11, color: "var(--text-muted)" }}>
          {eyebrow}
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.018em", lineHeight: 1.2, marginTop: 4 }}>
          {title}
        </h2>
      </div>
      {hint && (
        <span className="label-tag" style={{ fontSize: 11, color: "var(--text-secondary)" }}>
          {hint}
        </span>
      )}
    </div>
  );
}
