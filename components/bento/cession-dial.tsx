"use client";

import { useRef, useMemo } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ContractDraft } from "@/lib/types";
import { BentoHeader } from "./type-block";

const RIGHTS = [
  { id: "reproduction", label: "Reproduction" },
  { id: "representation", label: "Représentation" },
  { id: "adaptation", label: "Adaptation" },
];
const SUPPORTS = [
  { id: "print", label: "Print" },
  { id: "web", label: "Web" },
  { id: "social", label: "Réseaux" },
  { id: "tv", label: "TV" },
  { id: "cinema", label: "Cinéma" },
  { id: "out-of-home", label: "OOH" },
];
const TERRITORIES = [
  { id: "france", label: "France", deg: 0 },
  { id: "ue", label: "UE", deg: 60 },
  { id: "monde", label: "Monde", deg: 120 },
];
const DURATIONS = [
  { id: "12-mois", label: "12 m", deg: 0 },
  { id: "3-ans", label: "3 ans", deg: 45 },
  { id: "5-ans", label: "5 ans", deg: 90 },
  { id: "10-ans", label: "10 ans", deg: 135 },
  { id: "duree-legale", label: "70 ans", deg: 180 },
];

export function CessionDialBlock({
  draft,
  patch,
}: {
  draft: ContractDraft;
  patch: (p: (prev: ContractDraft) => ContractDraft) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const territoryRef = useRef<SVGGElement>(null);
  const durationRef = useRef<SVGGElement>(null);

  const tDeg = TERRITORIES.find((t) => t.id === draft.cession.territory)?.deg ?? 0;
  const dDeg = DURATIONS.find((d) => d.id === draft.cession.duration)?.deg ?? 0;

  useGSAP(
    () => {
      gsap.from(".cp-cession-row", { opacity: 0, y: 10, duration: 0.4, stagger: 0.05, ease: "power2.out" });
    },
    { scope: wrapRef },
  );

  useGSAP(
    () => {
      gsap.to(territoryRef.current, { rotation: tDeg, transformOrigin: "50% 50%", duration: 0.55, ease: "power3.out" });
    },
    { dependencies: [tDeg] },
  );

  useGSAP(
    () => {
      gsap.to(durationRef.current, { rotation: dDeg, transformOrigin: "50% 50%", duration: 0.55, ease: "power3.out" });
    },
    { dependencies: [dDeg] },
  );

  const toggleArr = <T extends string>(arr: T[], v: T): T[] => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const recap = useMemo(() => {
    return `${draft.cession.scope} · ${draft.cession.territory} · ${draft.cession.duration} · ${draft.cession.supports.length} supports`;
  }, [draft.cession]);

  return (
    <div ref={wrapRef} className="flex flex-col gap-4">
      <BentoHeader eyebrow="02 · Art. L.131-3 CPI" title="Cession granulaire" hint={recap} />

      <div
        className="bento-card"
        style={{ padding: 22, background: "var(--color-snow)", borderRadius: 6, position: "relative", overflow: "hidden" }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: -120,
            right: -100,
            width: 280,
            height: 280,
            background: "radial-gradient(circle, var(--color-fog-deep) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="cp-cession-row mb-5">
          <div className="label-eyebrow mb-2" style={{ fontSize: 10 }}>Droits cédés</div>
          <div className="flex flex-wrap gap-1.5">
            {RIGHTS.map((r) => {
              const active = draft.cession.rights.includes(r.id as "reproduction");
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() =>
                    patch((p) => ({ ...p, cession: { ...p.cession, rights: toggleArr(p.cession.rights as string[], r.id) as ("reproduction" | "representation" | "adaptation")[] } }))
                  }
                  className="cp-chip"
                  data-cursor="hover"
                  aria-pressed={active}
                  style={{
                    padding: "5px 11px",
                    fontSize: 12,
                    borderRadius: 999,
                    border: `1px solid ${active ? "var(--color-carbon)" : "var(--border-strong)"}`,
                    background: active ? "var(--color-carbon)" : "transparent",
                    color: active ? "var(--color-snow)" : "var(--text-secondary)",
                    cursor: "pointer",
                    transition: "all 180ms ease",
                  }}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="cp-cession-row grid grid-cols-2 gap-6 mb-5">
          {/* Territory dial */}
          <div>
            <div className="label-eyebrow mb-2" style={{ fontSize: 10 }}>Territoire</div>
            <div className="flex items-center gap-3">
              <svg width="74" height="74" viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border-strong)" strokeWidth="1" />
                <g ref={territoryRef} style={{ transformOrigin: "50% 50%" }}>
                  <line x1="50" y1="50" x2="50" y2="14" stroke="var(--color-carbon)" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="50" cy="14" r="3.5" fill="var(--color-carbon)" />
                </g>
                <circle cx="50" cy="50" r="3" fill="var(--color-carbon)" />
              </svg>
              <div className="flex flex-col gap-1">
                {TERRITORIES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => patch((p) => ({ ...p, cession: { ...p.cession, territory: t.id as "france" } }))}
                    style={{
                      fontSize: 12,
                      padding: "3px 8px",
                      borderRadius: 999,
                      background: draft.cession.territory === t.id ? "var(--color-carbon)" : "transparent",
                      color: draft.cession.territory === t.id ? "var(--color-snow)" : "var(--text-secondary)",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "var(--font-body)",
                      fontWeight: draft.cession.territory === t.id ? 500 : 400,
                    }}
                    data-cursor="hover"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Duration dial */}
          <div>
            <div className="label-eyebrow mb-2" style={{ fontSize: 10 }}>Durée</div>
            <div className="flex items-center gap-3">
              <svg width="74" height="74" viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
                <path
                  d="M 8 50 A 42 42 0 0 1 92 50"
                  fill="none"
                  stroke="var(--border-strong)"
                  strokeWidth="1"
                />
                <g ref={durationRef} style={{ transformOrigin: "50% 50%" }}>
                  <line x1="50" y1="50" x2="14" y2="50" stroke="var(--color-carbon)" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="14" cy="50" r="3.5" fill="var(--color-carbon)" />
                </g>
                <circle cx="50" cy="50" r="3" fill="var(--color-carbon)" />
              </svg>
              <div className="flex flex-col gap-0.5">
                {DURATIONS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => patch((p) => ({ ...p, cession: { ...p.cession, duration: d.id as "3-ans" } }))}
                    style={{
                      fontSize: 11.5,
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: draft.cession.duration === d.id ? "var(--color-carbon)" : "transparent",
                      color: draft.cession.duration === d.id ? "var(--color-snow)" : "var(--text-secondary)",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "var(--font-body)",
                      fontWeight: draft.cession.duration === d.id ? 500 : 400,
                    }}
                    data-cursor="hover"
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="cp-cession-row">
          <div className="label-eyebrow mb-2" style={{ fontSize: 10 }}>Supports d'exploitation</div>
          <div className="flex flex-wrap gap-1.5">
            {SUPPORTS.map((s) => {
              const active = draft.cession.supports.includes(s.id as "print");
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() =>
                    patch((p) => ({ ...p, cession: { ...p.cession, supports: toggleArr(p.cession.supports as string[], s.id) as ("print" | "web")[] } }))
                  }
                  data-cursor="hover"
                  aria-pressed={active}
                  style={{
                    padding: "5px 11px",
                    fontSize: 12,
                    borderRadius: 999,
                    border: `1px solid ${active ? "var(--color-carbon)" : "var(--border-strong)"}`,
                    background: active ? "var(--color-carbon)" : "transparent",
                    color: active ? "var(--color-snow)" : "var(--text-secondary)",
                    cursor: "pointer",
                    transition: "all 180ms ease",
                  }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
