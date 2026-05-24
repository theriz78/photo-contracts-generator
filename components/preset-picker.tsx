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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {PRESETS.map((p, i) => {
          const Icon = ICONS[p.id] ?? Heart;
          return (
            <button
              key={p.id}
              onClick={() => onApply(p.apply(current))}
              className="cp-preset-card bento-card bento-card-dark cp-lift text-left"
              data-cursor="hover"
              style={{ padding: 22, minHeight: 220, position: "relative" }}
            >
              <div className="flex items-start justify-between mb-8">
                <div className="arrow-eyebrow" style={{ color: "color-mix(in oklab, var(--bg-base) 50%, transparent)" }}>
                  N° 0{i + 1}
                </div>
                <ArrowRight size={16} style={{ opacity: 0.5, transition: "transform 280ms, opacity 280ms" }} />
              </div>
              <h3
                className="editorial"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.5rem", fontWeight: 540, lineHeight: 1.05, letterSpacing: "-0.018em", textTransform: "uppercase" }}
              >
                {p.title}
              </h3>
              <p className="label-tag mt-2" style={{ fontSize: 9, letterSpacing: "0.12em" }}>
                {p.tagline}
              </p>
              <p className="text-soft mt-3" style={{ fontSize: 12, lineHeight: 1.55, opacity: 0.8 }}>
                {p.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
