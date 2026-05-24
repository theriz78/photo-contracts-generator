"use client";

import { useRef, useMemo } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ContractDraft } from "@/lib/types";
import { BentoHeader } from "./type-block";

export function TarifCircleBlock({
  draft,
  patch,
}: {
  draft: ContractDraft;
  patch: (p: (prev: ContractDraft) => ContractDraft) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);

  const amount = draft.pricing?.amount ?? 0;
  const depositType = draft.pricing?.deposit.type ?? "percent";
  const depositValue = draft.pricing?.deposit.value ?? 0;
  const depositPct = useMemo(() => {
    if (depositType === "percent") return Math.min(100, Math.max(0, depositValue));
    if (amount <= 0) return 0;
    return Math.min(100, (depositValue / amount) * 100);
  }, [depositType, depositValue, amount]);

  const depositEuros = depositType === "percent" ? (amount * depositPct) / 100 : depositValue;
  const remaining = Math.max(0, amount - depositEuros);

  const circumference = 2 * Math.PI * 42;
  const dashOffset = circumference * (1 - depositPct / 100);

  useGSAP(
    () => {
      if (!arcRef.current) return;
      gsap.to(arcRef.current, { strokeDashoffset: dashOffset, duration: 0.7, ease: "power3.out" });
    },
    { dependencies: [dashOffset] },
  );

  useGSAP(
    () => {
      gsap.from(".cp-tarif-row", { opacity: 0, y: 10, duration: 0.4, stagger: 0.06, ease: "power2.out" });
    },
    { scope: wrapRef },
  );

  return (
    <div ref={wrapRef} className="flex flex-col gap-4">
      <BentoHeader eyebrow="03 · Prix et acompte" title="Tarification" hint={`${amount.toLocaleString("fr-FR")} €`} />

      <div
        className="bento-card"
        style={{ padding: 22, background: "var(--color-snow)", borderRadius: 6, position: "relative", overflow: "hidden" }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: -80,
            left: -60,
            width: 220,
            height: 220,
            background: "radial-gradient(circle, var(--color-fog-deep) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="grid grid-cols-[110px_1fr] gap-6 items-center mb-5">
          <div className="cp-tarif-row" style={{ position: "relative", width: 110, height: 110 }}>
            <svg width="110" height="110" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-fog-deep)" strokeWidth="6" />
              <circle
                ref={arcRef}
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="var(--color-carbon)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                pointerEvents: "none",
              }}
            >
              <div style={{ textAlign: "center", lineHeight: 1 }}>
                <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>
                  {Math.round(depositPct)}
                  <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)" }}>%</span>
                </div>
                <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-muted)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Acompte
                </div>
              </div>
            </div>
          </div>

          <div className="cp-tarif-row flex flex-col gap-3 min-w-0">
            <div>
              <div className="label-eyebrow mb-1" style={{ fontSize: 10 }}>Montant total</div>
              <div className="flex items-baseline gap-1">
                <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1 }}>
                  {amount.toLocaleString("fr-FR")}
                </span>
                <span style={{ fontSize: 18, fontWeight: 500, color: "var(--text-secondary)" }}>€</span>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={10000}
              step={50}
              value={amount}
              onChange={(e) =>
                patch((p) => ({ ...p, pricing: { ...p.pricing!, amount: parseInt(e.target.value, 10) } }))
              }
              className="cp-range"
              style={{ width: "100%", accentColor: "var(--color-carbon)" }}
            />
            <div className="flex items-center justify-between" style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              <span>0 €</span>
              <span>5 000 €</span>
              <span>10 000 €</span>
            </div>
          </div>
        </div>

        <div
          className="cp-tarif-row grid grid-cols-2 gap-3 pt-4"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span style={{ width: 6, height: 6, borderRadius: 2, background: "var(--color-carbon)" }} />
              <span className="label-tag" style={{ fontSize: 11 }}>Acompte à la réservation</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.015em" }}>
              {depositEuros.toLocaleString("fr-FR")} €
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span style={{ width: 6, height: 6, borderRadius: 2, background: "var(--color-fog-deep)", border: "1px solid var(--color-mist)" }} />
              <span className="label-tag" style={{ fontSize: 11 }}>Solde livraison + {draft.pricing?.balanceDueDays ?? 30}j</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.015em" }}>
              {remaining.toLocaleString("fr-FR")} €
            </div>
          </div>
        </div>

        <div className="cp-tarif-row flex items-center justify-between gap-2 mt-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            {[20, 30, 40, 50].map((pct) => {
              const active = depositType === "percent" && depositPct === pct;
              return (
                <button
                  key={pct}
                  type="button"
                  onClick={() =>
                    patch((p) => ({ ...p, pricing: { ...p.pricing!, deposit: { type: "percent", value: pct } } }))
                  }
                  data-cursor="hover"
                  style={{
                    padding: "4px 10px",
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                    borderRadius: 999,
                    border: `1px solid ${active ? "var(--color-carbon)" : "var(--border-strong)"}`,
                    background: active ? "var(--color-carbon)" : "transparent",
                    color: active ? "var(--color-snow)" : "var(--text-secondary)",
                    cursor: "pointer",
                    transition: "all 180ms ease",
                  }}
                >
                  {pct}%
                </button>
              );
            })}
          </div>
          <span className="label-tag" style={{ fontSize: 10, color: "var(--text-muted)" }}>
            {draft.type === "tfp" ? "TFP : pas d'acompte monétaire" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
