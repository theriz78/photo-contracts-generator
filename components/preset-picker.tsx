"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Briefcase, User, Heart, Palette, Flame, ArrowRight } from "lucide-react";
import type { ContractDraft } from "@/lib/types";
import { PRESETS } from "@/lib/presets";

const ICONS: Record<string, typeof Briefcase> = {
  "corporate-b2b": Briefcase,
  "portrait-b2c": User,
  "tfp-collab": Heart,
  artistique: Palette,
  boudoir: Flame,
};

export function PresetPicker({
  onApply,
  current,
}: {
  onApply: (next: ContractDraft) => void;
  current: ContractDraft;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".cp-preset-card", {
        opacity: 0,
        y: 18,
        duration: 0.55,
        stagger: 0.06,
        ease: "power3.out",
      });
    },
    { scope: wrapRef },
  );

  return (
    <section ref={wrapRef} className="no-print" aria-label="Presets">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span style={{ width: 28, height: 1, background: "var(--accent)" }} />
          <span className="label-eyebrow" style={{ letterSpacing: "0.22em" }}>Démarrage rapide · 5 presets</span>
        </div>
        <span className="text-mute" style={{ fontSize: 12, fontFamily: "var(--font-fraunces)", fontStyle: "italic" }}>
          Pré-remplit type, niche, cession, tarif, clauses.
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {PRESETS.map((p) => {
          const Icon = ICONS[p.id] ?? Heart;
          return (
            <button
              key={p.id}
              onClick={() => onApply(p.apply(current))}
              className="cp-preset-card bento-card cp-lift glow-ring text-left"
              data-cursor="hover"
              style={{ padding: 18, minHeight: 168, position: "relative" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="grid place-items-center"
                  style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
                >
                  <Icon size={16} className="text-accent" />
                </div>
                <ArrowRight size={14} className="text-mute" style={{ transition: "transform 280ms" }} />
              </div>
              <h3
                className="editorial"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.25rem", fontWeight: 380, lineHeight: 1.1, letterSpacing: "-0.012em" }}
              >
                {p.title}
              </h3>
              <p className="label-tag mt-1.5" style={{ fontSize: 10, color: "var(--text-mute)" }}>
                {p.tagline}
              </p>
              <p className="text-soft mt-3" style={{ fontSize: 11.5, lineHeight: 1.5 }}>
                {p.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
