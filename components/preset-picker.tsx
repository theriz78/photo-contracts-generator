"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Briefcase, User, Heart, Palette, Flame, ArrowUpRight } from "lucide-react";
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
        y: 12,
        duration: 0.4,
        stagger: 0.04,
        ease: "power2.out",
      });
    },
    { scope: wrapRef },
  );

  return (
    <section ref={wrapRef} className="no-print" aria-label="Presets">
      <div className="mb-6">
        <h2 className="display-lg" style={{ marginBottom: 6 }}>Commence rapidement</h2>
        <p className="text-soft" style={{ fontSize: 14, lineHeight: 1.55, maxWidth: 540 }}>
          Choisis un preset. Tout le contrat est pré-rempli avec les bonnes clauses pour ton métier, tu n'as plus qu'à compléter les identités et la date.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {PRESETS.map((p) => {
          const Icon = ICONS[p.id] ?? Heart;
          return (
            <button
              key={p.id}
              onClick={() => onApply(p.apply(current))}
              className="cp-preset-card bento-card cp-lift text-left group"
              data-cursor="hover"
              style={{ padding: 18, position: "relative" }}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div
                  className="grid place-items-center"
                  style={{ width: 34, height: 34, borderRadius: 8, background: "var(--bg-base)", border: "1px solid var(--border-subtle)" }}
                >
                  <Icon size={15} />
                </div>
                <ArrowUpRight size={15} className="text-mute group-hover:text-accent" style={{ transition: "all 200ms" }} />
              </div>
              <h3 className="display-md" style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.25 }}>
                {p.title}
              </h3>
              <p className="text-mute mt-1" style={{ fontSize: 12, lineHeight: 1.4 }}>
                {p.tagline}
              </p>
              <p className="text-soft mt-3" style={{ fontSize: 12, lineHeight: 1.5 }}>
                {p.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
