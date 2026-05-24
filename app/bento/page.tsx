"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, User, Heart, Check, Camera, PenTool, Send, Printer } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { CustomCursor } from "@/components/custom-cursor";
import { SignaturePad } from "@/components/signature-pad";
import { useDraft } from "@/lib/draft-store";
import { encodeDraftToHash, buildShareUrl } from "@/lib/share-encode";
import type { ContractType } from "@/lib/types";

export default function BentoPage() {
  const { draft, patch, hydrated } = useDraft();
  const wrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".cp-bento-cell", { opacity: 0, y: 18, duration: 0.6, stagger: 0.08, ease: "power3.out" });
    },
    { scope: wrapRef, dependencies: [hydrated] },
  );

  if (!hydrated) return <div className="h-screen grid place-items-center text-mute text-sm">Chargement…</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#e8e0cf" }}>
      <CustomCursor />

      <header
        className="no-print"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "color-mix(in oklab, #e8e0cf 88%, transparent)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid #c8bea5",
        }}
      >
        <div className="mx-auto flex items-center justify-between px-6 py-3.5" style={{ maxWidth: 1280 }}>
          <Link href="/" data-cursor="hover" className="flex items-center gap-2" style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#5d4f30" }}>
            <ArrowLeft size={14} />
            Wizard standard
          </Link>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#7d6f50", textTransform: "uppercase", letterSpacing: "0.14em" }}>
            /bento · Camera shop
          </span>
          <ThemeToggle />
        </div>
      </header>

      <main ref={wrapRef} className="mx-auto px-4 sm:px-6 py-10 pb-20" style={{ maxWidth: 1320 }}>
        <section className="mb-10 text-center">
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#7d6f50", textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: 12 }}>
            Bento dashboard · Photo equipment
          </div>
          <h1
            className="skeumo-engraved"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(2rem, 4.8vw, 3.4rem)",
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              maxWidth: 800,
              margin: "0 auto",
            }}
          >
            Compose ton contrat <em style={{ fontStyle: "italic", color: "#6b4a18" }}>comme un boîtier argentique</em>.
          </h1>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4">
          {/* Identité Photographe — camera nameplate */}
          <div className="cp-bento-cell md:col-span-6">
            <NameplateCard
              role="Photographe"
              tag="EMETTEUR · MICRO-ENTREPRISE"
              name={draft.photographer.fullName}
              line2={draft.photographer.brandName}
              line3={draft.photographer.includeSiret ? `SIRET ${draft.photographer.siret || "____ ____ ___ __"}` : ""}
              line4={draft.photographer.email}
              onChangeName={(v) => patch((p) => ({ ...p, photographer: { ...p.photographer, fullName: v } }))}
              onChangeLine2={(v) => patch((p) => ({ ...p, photographer: { ...p.photographer, brandName: v } }))}
              onChangeLine4={(v) => patch((p) => ({ ...p, photographer: { ...p.photographer, email: v } }))}
            />
          </div>

          {/* Identité Client — matching plate */}
          <div className="cp-bento-cell md:col-span-6">
            <NameplateCard
              role="Client"
              tag={draft.client.legalForm === "personne-morale" ? "BÉNÉFICIAIRE · ENTREPRISE" : "BÉNÉFICIAIRE · PARTICULIER"}
              name={draft.client.fullName}
              line2={draft.client.representative}
              line3={draft.client.siret ? `SIRET ${draft.client.siret}` : ""}
              line4={draft.client.email}
              onChangeName={(v) => patch((p) => ({ ...p, client: { ...p.client, fullName: v } }))}
              onChangeLine2={(v) => patch((p) => ({ ...p, client: { ...p.client, representative: v } }))}
              onChangeLine4={(v) => patch((p) => ({ ...p, client: { ...p.client, email: v } }))}
              alt
            />
          </div>

          {/* Type contrat — film canister stack */}
          <div className="cp-bento-cell md:col-span-4">
            <TypeStackCard draft={draft} patch={patch} />
          </div>

          {/* Tarif — odometer + ISO dial */}
          <div className="cp-bento-cell md:col-span-4">
            <TarifOdoCard draft={draft} patch={patch} />
          </div>

          {/* Cession — compass + atlas */}
          <div className="cp-bento-cell md:col-span-4">
            <CessionCompassCard draft={draft} patch={patch} />
          </div>

          {/* Signature — leather + ink */}
          <div className="cp-bento-cell md:col-span-12">
            <SignatureLeatherCard draft={draft} />
          </div>
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   NAMEPLATE CARD — like camera/lens nameplate engraved brass
   ============================================================ */
function NameplateCard({
  role,
  tag,
  name,
  line2,
  line3,
  line4,
  alt,
  onChangeName,
  onChangeLine2,
  onChangeLine4,
}: {
  role: string;
  tag: string;
  name: string;
  line2?: string;
  line3?: string;
  line4?: string;
  alt?: boolean;
  onChangeName: (v: string) => void;
  onChangeLine2: (v: string) => void;
  onChangeLine4: (v: string) => void;
}) {
  return (
    <div
      style={{
        position: "relative",
        padding: 22,
        borderRadius: 12,
        minHeight: 240,
        background: alt
          ? "linear-gradient(135deg, #d8d8d8 0%, #f4f4f4 25%, #b0b0b0 50%, #f4f4f4 75%, #d8d8d8 100%)"
          : "linear-gradient(135deg, #b8a07a 0%, #d4bf95 25%, #8b734b 50%, #d4bf95 75%, #b8a07a 100%)",
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.6), inset 0 -1px 1px rgba(0,0,0,0.3), 0 4px 14px rgba(0,0,0,0.25)",
        overflow: "hidden",
      }}
    >
      {/* Corner screws */}
      {[
        { top: 10, left: 10 },
        { top: 10, right: 10 },
        { bottom: 10, left: 10 },
        { bottom: 10, right: 10 },
      ].map((pos, i) => (
        <span key={i} className="skeumo-screw" style={{ position: "absolute", ...pos }} />
      ))}

      <div style={{ paddingLeft: 14, paddingRight: 14 }}>
        <div className="flex items-center gap-2 mb-3">
          <Camera size={14} className="skeumo-engraved" />
          <span className="skeumo-engraved" style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            {tag}
          </span>
        </div>

        <div className="skeumo-engraved mb-1" style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", opacity: 0.7 }}>
          {role}
        </div>

        <input
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder="Nom et prénom"
          className="skeumo-engraved"
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: "-0.018em",
            color: "#1a1208",
            padding: "2px 0",
            marginBottom: 12,
            width: "100%",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <input
            value={line2 ?? ""}
            onChange={(e) => onChangeLine2(e.target.value)}
            placeholder={alt ? "Représentant légal" : "Nom commercial"}
            className="skeumo-engraved"
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.06em",
              color: "#3a2a18",
              padding: "1px 0",
              width: "100%",
            }}
          />
          {line3 && (
            <div className="skeumo-engraved" style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.04em", color: "#5d4f30" }}>
              {line3}
            </div>
          )}
          <input
            value={line4 ?? ""}
            onChange={(e) => onChangeLine4(e.target.value)}
            placeholder="contact@studio.fr"
            type="email"
            className="skeumo-engraved"
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.04em",
              color: "#5d4f30",
              padding: "1px 0",
              width: "100%",
            }}
          />
        </div>

        <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${alt ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0.25)"}` }}>
          <div className="skeumo-engraved" style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.55 }}>
            ⌖ Made in France · Édition 2026
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TYPE STACK — 3 polaroid/film canister cards 3D tilted
   ============================================================ */
function TypeStackCard({ draft, patch }: { draft: ReturnType<typeof useDraft>["draft"]; patch: ReturnType<typeof useDraft>["patch"] }) {
  const TYPES: { id: ContractType; title: string; tag: string; icon: typeof Building2 }[] = [
    { id: "b2b", title: "B2B", tag: "Entreprise", icon: Building2 },
    { id: "b2c", title: "B2C", tag: "Particulier", icon: User },
    { id: "tfp", title: "TFP", tag: "Modèle TFP", icon: Heart },
  ];

  const wrapRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(".cp-type-stack-card", { opacity: 0, y: 24, duration: 0.6, stagger: 0.1, ease: "power3.out" });
  }, { scope: wrapRef });

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        padding: 22,
        paddingBottom: 28,
        borderRadius: 12,
        minHeight: 280,
        background: "linear-gradient(180deg, #ede2c4 0%, #d4c8a0 100%)",
        boxShadow: "inset 0 1px 2px rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.15), 0 4px 14px rgba(0,0,0,0.18)",
        overflow: "hidden",
      }}
    >
      <div className="mb-3 flex items-center gap-2">
        <PenTool size={14} className="skeumo-engraved" />
        <span className="skeumo-engraved" style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}>
          Boîtier · Type juridique
        </span>
      </div>

      <div className="skeumo-card-stack" style={{ position: "relative", height: 200 }}>
        {TYPES.map((t, i) => {
          const Icon = t.icon;
          const active = draft.type === t.id;
          const stackIdx = TYPES.findIndex((x) => x.id === draft.type);
          const offset = i === stackIdx ? 0 : (i - stackIdx) * 28;
          const rotate = i === stackIdx ? 0 : (i - stackIdx) * -3;
          const z = i === stackIdx ? 10 : 3 - Math.abs(i - stackIdx);

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => patch((p) => ({ ...p, type: t.id }))}
              data-cursor="hover"
              className="cp-type-stack-card skeumo-card-3d"
              style={{
                position: "absolute",
                inset: 0,
                transform: `translateY(${offset}px) rotate(${rotate}deg) ${active ? "translateZ(20px)" : ""}`,
                zIndex: z,
                padding: 16,
                borderRadius: 6,
                background: active
                  ? "linear-gradient(135deg, #1a1208 0%, #3a2a18 100%)"
                  : "linear-gradient(135deg, #f4ecd8 0%, #d4c8a0 100%)",
                color: active ? "#f4ecd8" : "#1a1208",
                border: `1px solid ${active ? "#0a0604" : "rgba(0,0,0,0.2)"}`,
                cursor: "pointer",
                textAlign: "left",
                boxShadow: active
                  ? "0 12px 24px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.1)"
                  : "0 4px 8px rgba(0,0,0,0.18), inset 0 1px 1px rgba(255,255,255,0.4)",
                transition: "all 320ms cubic-bezier(.2,.7,.2,1)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon size={18} strokeWidth={1.6} />
                {active && (
                  <span
                    className="grid place-items-center"
                    style={{ width: 22, height: 22, borderRadius: 999, background: "#f4ecd8", color: "#1a1208" }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1, fontFamily: "var(--font-fraunces), Georgia, serif" }}>
                {t.title}
              </div>
              <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.7, marginTop: 3 }}>
                {t.tag}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   TARIF ODOMETER + ISO DIAL — cranted brass dial + odometer reel
   ============================================================ */
function TarifOdoCard({ draft, patch }: { draft: ReturnType<typeof useDraft>["draft"]; patch: ReturnType<typeof useDraft>["patch"] }) {
  const amount = draft.pricing?.amount ?? 0;
  const depositPct = draft.pricing?.deposit.type === "percent" ? draft.pricing.deposit.value : amount > 0 ? ((draft.pricing?.deposit.value ?? 0) / amount) * 100 : 0;

  const dialRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!dialRef.current) return;
      const angle = -135 + (depositPct / 100) * 270;
      gsap.to(dialRef.current, { rotation: angle, duration: 0.5, ease: "power3.out", transformOrigin: "50% 50%" });
    },
    { dependencies: [depositPct] },
  );

  const digits = useMemo(() => {
    const s = Math.max(0, Math.min(99999, Math.round(amount))).toString().padStart(5, "0");
    return s.split("");
  }, [amount]);

  const setAmount = (n: number) => patch((p) => ({ ...p, pricing: { ...p.pricing!, amount: Math.max(0, Math.min(99999, n)) } }));

  return (
    <div
      style={{
        position: "relative",
        padding: 18,
        borderRadius: 12,
        minHeight: 280,
        background: "linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)",
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.12), inset 0 -2px 4px rgba(0,0,0,0.6), 0 4px 14px rgba(0,0,0,0.3)",
        color: "#f4ecd8",
      }}
    >
      <div className="mb-3 flex items-center gap-2">
        <span style={{ width: 8, height: 8, borderRadius: 999, background: "#ff4444", boxShadow: "0 0 6px #ff4444, inset 0 1px 0 rgba(255,255,255,0.4)" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#f4ecd8" }}>
          Tarif · Boîtier
        </span>
      </div>

      <div className="mb-3 flex items-center justify-center">
        <div className="skeumo-odometer">
          {digits.map((d, i) => (
            <OdometerDigit key={i} value={parseInt(d, 10)} />
          ))}
          <span style={{ display: "grid", placeItems: "center", padding: "0 8px", fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, color: "#d4af37" }}>€</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mb-2">
        <input
          type="number"
          min={0}
          max={99999}
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value, 10) || 0)}
          style={{
            flex: 1,
            background: "rgba(0,0,0,0.4)",
            border: "1px solid #0a0604",
            borderRadius: 4,
            padding: "6px 10px",
            color: "#f4ecd8",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            outline: "none",
            boxShadow: "inset 0 2px 3px rgba(0,0,0,0.5)",
          }}
        />
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setAmount(amount - 50)}
            data-cursor="hover"
            className="skeumo-steel"
            style={{ width: 26, height: 26, borderRadius: 4, color: "#1a1208", fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, cursor: "pointer", border: "none" }}
          >
            −
          </button>
          <button
            type="button"
            onClick={() => setAmount(amount + 50)}
            data-cursor="hover"
            className="skeumo-steel"
            style={{ width: 26, height: 26, borderRadius: 4, color: "#1a1208", fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, cursor: "pointer", border: "none" }}
          >
            +
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3">
        <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
          <div className="skeumo-knurled" style={{ position: "absolute", inset: 0, borderRadius: 999 }} />
          <div
            ref={dialRef}
            style={{
              position: "absolute",
              inset: 12,
              borderRadius: 999,
              background: "radial-gradient(circle at 30% 30%, #f0e9d6 0%, #b8a07a 60%, #6b5535 100%)",
              boxShadow: "inset 0 2px 2px rgba(255,255,255,0.5), inset 0 -2px 3px rgba(0,0,0,0.4)",
              transformOrigin: "50% 50%",
            }}
          >
            <span style={{ position: "absolute", top: 4, left: "50%", transform: "translateX(-50%)", width: 3, height: 14, background: "#1a1208", borderRadius: 999 }} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.6, marginBottom: 4 }}>
            Acompte
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.018em", fontFamily: "var(--font-fraunces), Georgia, serif", lineHeight: 1, color: "#d4af37" }}>
            {Math.round(depositPct)}%
          </div>
          <div className="flex gap-1 mt-2">
            {[20, 30, 40, 50].map((pct) => {
              const active = depositPct === pct && draft.pricing?.deposit.type === "percent";
              return (
                <button
                  key={pct}
                  type="button"
                  data-cursor="hover"
                  onClick={() => patch((p) => ({ ...p, pricing: { ...p.pricing!, deposit: { type: "percent", value: pct } } }))}
                  style={{
                    flex: 1,
                    padding: "3px 0",
                    fontSize: 10,
                    fontFamily: "var(--font-mono)",
                    borderRadius: 999,
                    border: `1px solid ${active ? "#d4af37" : "rgba(244,236,216,0.25)"}`,
                    background: active ? "#d4af37" : "transparent",
                    color: active ? "#1a1208" : "#f4ecd8",
                    cursor: "pointer",
                    transition: "all 180ms ease",
                    fontWeight: 600,
                  }}
                >
                  {pct}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function OdometerDigit({ value }: { value: number }) {
  const stripRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!stripRef.current) return;
      gsap.to(stripRef.current, { y: -value * 44, duration: 0.5, ease: "back.out(1.4)" });
    },
    { dependencies: [value] },
  );

  return (
    <div className="skeumo-odometer-digit">
      <div ref={stripRef} className="skeumo-odometer-strip">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   CESSION COMPASS — old compass needle + paper map
   ============================================================ */
function CessionCompassCard({ draft, patch }: { draft: ReturnType<typeof useDraft>["draft"]; patch: ReturnType<typeof useDraft>["patch"] }) {
  const TERRS: { id: "france" | "ue" | "monde"; label: string; deg: number }[] = [
    { id: "france", label: "France", deg: -30 },
    { id: "ue", label: "Europe", deg: 60 },
    { id: "monde", label: "Monde", deg: 150 },
  ];
  const DURS = ["12-mois", "3-ans", "5-ans", "10-ans", "duree-legale"] as const;
  const DUR_LBL: Record<string, string> = {
    "12-mois": "12 m",
    "3-ans": "3 a",
    "5-ans": "5 a",
    "10-ans": "10 a",
    "duree-legale": "70 a",
  };

  const needleRef = useRef<SVGGElement>(null);
  const tCfg = TERRS.find((t) => t.id === draft.cession.territory) ?? TERRS[0];

  useGSAP(
    () => {
      gsap.to(needleRef.current, { rotation: tCfg.deg, duration: 0.6, ease: "elastic.out(1, 0.5)", transformOrigin: "50% 50%" });
    },
    { dependencies: [tCfg.deg] },
  );

  return (
    <div
      className="skeumo-paper"
      style={{ position: "relative", padding: 18, borderRadius: 12, minHeight: 280, overflow: "hidden" }}
    >
      <div className="mb-3 flex items-center gap-2">
        <Camera size={14} className="skeumo-engraved" />
        <span className="skeumo-engraved" style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}>
          Cession · Atlas L.131-3
        </span>
      </div>

      <div className="flex items-center justify-center mb-4">
        <div style={{ position: "relative", width: 140, height: 140 }}>
          <svg width="140" height="140" viewBox="0 0 100 100">
            <defs>
              <radialGradient id="brassDisk" cx="30%" cy="30%">
                <stop offset="0%" stopColor="#f0e9d6" />
                <stop offset="50%" stopColor="#b8a07a" />
                <stop offset="100%" stopColor="#6b5535" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="url(#brassDisk)" stroke="#3a2a15" strokeWidth="1" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="#3a2a15" strokeWidth="0.4" strokeDasharray="1 3" />
            {[0, 90, 180, 270].map((deg, i) => {
              const lbl = ["N", "E", "S", "O"][i];
              const rad = ((deg - 90) * Math.PI) / 180;
              const x = 50 + Math.cos(rad) * 36;
              const y = 50 + Math.sin(rad) * 36;
              return (
                <text key={deg} x={x} y={y + 2} textAnchor="middle" fontSize="6" fontFamily="var(--font-mono)" fill="#1a1208" fontWeight={700}>
                  {lbl}
                </text>
              );
            })}
            <g ref={needleRef}>
              <polygon points="50,12 47,50 53,50" fill="#a32626" />
              <polygon points="50,88 47,50 53,50" fill="#1a1208" />
            </g>
            <circle cx="50" cy="50" r="4" fill="#1a1208" stroke="#f4ecd8" strokeWidth="0.5" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 mb-2">
        {TERRS.map((t) => {
          const active = draft.cession.territory === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => patch((p) => ({ ...p, cession: { ...p.cession, territory: t.id } }))}
              data-cursor="hover"
              style={{
                padding: "5px 6px",
                fontSize: 11,
                borderRadius: 999,
                border: `1px solid ${active ? "#1a1208" : "rgba(58,42,21,0.4)"}`,
                background: active ? "#1a1208" : "transparent",
                color: active ? "#f4ecd8" : "#3a2a18",
                cursor: "pointer",
                transition: "all 180ms ease",
                fontFamily: "var(--font-mono)",
                fontWeight: 500,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-5 gap-1">
        {DURS.map((d) => {
          const active = draft.cession.duration === d;
          return (
            <button
              key={d}
              type="button"
              onClick={() => patch((p) => ({ ...p, cession: { ...p.cession, duration: d } }))}
              data-cursor="hover"
              style={{
                padding: "4px 0",
                fontSize: 10,
                borderRadius: 999,
                border: `1px solid ${active ? "#1a1208" : "rgba(58,42,21,0.4)"}`,
                background: active ? "#1a1208" : "transparent",
                color: active ? "#f4ecd8" : "#3a2a18",
                cursor: "pointer",
                transition: "all 180ms ease",
                fontFamily: "var(--font-mono)",
                fontWeight: 500,
              }}
            >
              {DUR_LBL[d]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   SIGNATURE LEATHER PAD
   ============================================================ */
function SignatureLeatherCard({ draft }: { draft: ReturnType<typeof useDraft>["draft"] }) {
  const [photoSig, setPhotoSig] = useState<string | null>(null);
  const [clientSig, setClientSig] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  const bothSigned = !!photoSig && !!clientSig;

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const shareUrl = useMemo(
    () => (origin && bothSigned ? buildShareUrl(origin, encodeDraftToHash(draft, `${photoSig}|${clientSig}`)) : ""),
    [origin, bothSigned, photoSig, clientSig, draft],
  );

  return (
    <div
      className="skeumo-leather"
      style={{ position: "relative", padding: 24, borderRadius: 14, minHeight: 280, overflow: "hidden" }}
    >
      {/* Brass plate top */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "5px 14px",
          borderRadius: 4,
          background: "linear-gradient(135deg, #b8a07a 0%, #d4bf95 25%, #8b734b 50%, #d4bf95 75%, #b8a07a 100%)",
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.6), inset 0 -1px 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.3)",
        }}
      >
        <span className="skeumo-engraved" style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>
          Signatures · Art. 1366 C. civ
        </span>
      </div>

      <div style={{ marginTop: 36, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <SigPanel label="Photographe" name={draft.photographer.fullName} onChange={setPhotoSig} />
        <SigPanel label="Client" name={draft.client.fullName} onChange={setClientSig} />
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 flex-wrap gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 12px",
            borderRadius: 999,
            background: bothSigned ? "#d4af37" : "rgba(244,236,216,0.15)",
            color: bothSigned ? "#1a1208" : "#f4ecd8",
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {bothSigned && <Check size={11} strokeWidth={3} />}
          {bothSigned ? "Signé deux fois" : "0 / 2"}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            disabled={!bothSigned}
            data-cursor="hover"
            style={{
              padding: "7px 14px",
              borderRadius: 999,
              border: "1px solid rgba(244,236,216,0.3)",
              background: "transparent",
              color: "#f4ecd8",
              fontSize: 12,
              cursor: "pointer",
              opacity: bothSigned ? 1 : 0.4,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--font-body)",
              fontWeight: 500,
            }}
          >
            <Printer size={12} />
            PDF
          </button>
          <button
            type="button"
            onClick={() => { if (shareUrl) navigator.clipboard?.writeText(shareUrl); }}
            disabled={!shareUrl}
            data-cursor="hover"
            style={{
              padding: "7px 14px",
              borderRadius: 999,
              border: "1px solid #d4af37",
              background: "#d4af37",
              color: "#1a1208",
              fontSize: 12,
              cursor: "pointer",
              opacity: shareUrl ? 1 : 0.4,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--font-body)",
              fontWeight: 600,
            }}
          >
            <Send size={12} />
            Lien signé
          </button>
        </div>
      </div>
    </div>
  );
}

function SigPanel({ label, name, onChange }: { label: string; name: string; onChange: (s: string | null) => void }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(244,236,216,0.7)", marginBottom: 6 }}>
        {label} {name && `· ${name}`}
      </div>
      <div
        style={{
          background: "linear-gradient(180deg, #f4ecd8 0%, #ede2c4 100%)",
          borderRadius: 4,
          padding: 0,
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)",
          overflow: "hidden",
        }}
      >
        <SignaturePad onChange={onChange} />
      </div>
    </div>
  );
}
