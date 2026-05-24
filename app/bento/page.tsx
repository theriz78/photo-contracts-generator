"use client";

import { useRef, useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, User, Heart, Check, Globe, Coins, PenTool, Sparkles, FileSignature, Send, Printer } from "lucide-react";
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
      gsap.from(".cp-bento-cell", { opacity: 0, y: 16, duration: 0.55, stagger: 0.07, ease: "power3.out" });
    },
    { scope: wrapRef, dependencies: [hydrated] },
  );

  if (!hydrated) {
    return <div className="h-screen grid place-items-center text-mute text-sm">Chargement…</div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <CustomCursor />

      <header
        className="no-print"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "color-mix(in oklab, var(--bg-base) 85%, transparent)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div className="mx-auto flex items-center justify-between px-6 py-3.5" style={{ maxWidth: 1280 }}>
          <Link
            href="/"
            className="flex items-center gap-2"
            data-cursor="hover"
            style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-secondary)" }}
          >
            <ArrowLeft size={14} />
            Wizard standard
          </Link>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
            }}
          >
            /bento · prototype
          </span>
          <ThemeToggle />
        </div>
      </header>

      <main ref={wrapRef} className="mx-auto px-4 sm:px-6 py-10 pb-20" style={{ maxWidth: 1280 }}>
        <section className="mb-10 text-center">
          <div className="label-eyebrow mb-3" style={{ fontSize: 11 }}>Bento dashboard · Prototype</div>
          <h1
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(2rem, 4.8vw, 3.4rem)",
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              maxWidth: 760,
              margin: "0 auto",
            }}
          >
            Construit ton contrat <span style={{ color: "var(--text-secondary)" }}>par blocs.</span>
          </h1>
          <p className="text-soft mt-4 mx-auto" style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 540 }}>
            Quatre blocs interactifs. Chacun traduit visuellement une partie du contrat. Tout est manipulable en direct.
          </p>
        </section>

        {/* Asymmetric supabase-style 12-col grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3">
          {/* Type contrat — wide */}
          <BentoCell className="md:col-span-7">
            <TypeCard draft={draft} patch={patch} />
          </BentoCell>

          {/* Tarif — narrow */}
          <BentoCell className="md:col-span-5">
            <TarifCard draft={draft} patch={patch} />
          </BentoCell>

          {/* Cession — medium */}
          <BentoCell className="md:col-span-6">
            <CessionCard draft={draft} patch={patch} />
          </BentoCell>

          {/* Signature — medium */}
          <BentoCell className="md:col-span-6">
            <SignatureCard draft={draft} />
          </BentoCell>
        </div>
      </main>
    </div>
  );
}

function BentoCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <article
      className={`cp-bento-cell ${className ?? ""}`}
      data-cursor="hover"
      style={{
        background: "var(--color-snow)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 8,
        padding: 0,
        overflow: "hidden",
        position: "relative",
        transition: "border-color 220ms ease, transform 220ms cubic-bezier(.2,.7,.2,1)",
        minHeight: 360,
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--color-carbon)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-subtle)";
      }}
    >
      {children}
    </article>
  );
}

function CardHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Building2;
  title: string;
  description: string;
}) {
  return (
    <div style={{ padding: "22px 22px 0 22px" }}>
      <div className="flex items-center gap-2.5 mb-3">
        <span
          className="grid place-items-center"
          style={{
            width: 26,
            height: 26,
            borderRadius: 6,
            background: "var(--color-fog)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <Icon size={13} strokeWidth={1.8} />
        </span>
        <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.012em" }}>{title}</span>
      </div>
      <p className="text-soft" style={{ fontSize: 13, lineHeight: 1.55, maxWidth: 360 }}>
        {description}
      </p>
    </div>
  );
}

/* ============================================================
   TYPE CARD — 3 mini cards stacked B2B / B2C / TFP, click select
   ============================================================ */
function TypeCard({ draft, patch }: { draft: ReturnType<typeof useDraft>["draft"]; patch: ReturnType<typeof useDraft>["patch"] }) {
  const TYPES: { id: ContractType; title: string; tag: string; icon: typeof Building2 }[] = [
    { id: "b2b", title: "B2B", tag: "Entreprise", icon: Building2 },
    { id: "b2c", title: "B2C", tag: "Particulier", icon: User },
    { id: "tfp", title: "TFP", tag: "Time For Print", icon: Heart },
  ];

  return (
    <>
      <CardHeader icon={FileSignature} title="Type de contrat" description="Le cadre juridique applicable. Détermine les clauses obligatoires." />
      <div style={{ flex: 1, padding: "20px 22px 22px 22px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div className="flex flex-col gap-2">
          {TYPES.map((t) => {
            const Icon = t.icon;
            const active = draft.type === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => patch((p) => ({ ...p, type: t.id }))}
                data-cursor="hover"
                aria-pressed={active}
                className="cp-lift"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: 6,
                  background: active ? "var(--color-carbon)" : "var(--color-fog)",
                  color: active ? "var(--color-snow)" : "var(--text-primary)",
                  border: `1px solid ${active ? "var(--color-carbon)" : "var(--border-subtle)"}`,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 200ms ease",
                  width: "100%",
                }}
              >
                <Icon size={15} strokeWidth={1.6} style={{ opacity: 0.85 }} />
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontSize: 14, fontWeight: 500, lineHeight: 1.2 }}>{t.title}</span>
                  <span style={{ fontSize: 11, opacity: 0.6, fontFamily: "var(--font-mono)" }}>{t.tag}</span>
                </span>
                {active && <Check size={14} strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ============================================================
   TARIF CARD — circular progress + slider + euros big
   ============================================================ */
function TarifCard({ draft, patch }: { draft: ReturnType<typeof useDraft>["draft"]; patch: ReturnType<typeof useDraft>["patch"] }) {
  const arcRef = useRef<SVGCircleElement>(null);
  const amount = draft.pricing?.amount ?? 0;
  const depositPct = draft.pricing?.deposit.type === "percent" ? draft.pricing.deposit.value : amount > 0 ? ((draft.pricing?.deposit.value ?? 0) / amount) * 100 : 0;
  const circumference = 2 * Math.PI * 38;
  const dashOffset = circumference * (1 - Math.min(100, Math.max(0, depositPct)) / 100);
  const depositEuros = (amount * depositPct) / 100;

  useGSAP(
    () => {
      if (!arcRef.current) return;
      gsap.to(arcRef.current, { strokeDashoffset: dashOffset, duration: 0.6, ease: "power3.out" });
    },
    { dependencies: [dashOffset] },
  );

  return (
    <>
      <CardHeader icon={Coins} title="Tarification" description="Montant total et acompte à la réservation." />
      <div style={{ flex: 1, padding: "16px 22px 22px 22px", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 14 }}>
        <div className="flex items-end gap-4">
          <div style={{ position: "relative", width: 90, height: 90, flexShrink: 0 }}>
            <svg width="90" height="90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="var(--color-fog-deep)" strokeWidth="5" />
              <circle
                ref={arcRef}
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="var(--color-carbon)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
              <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>
                {Math.round(depositPct)}<span style={{ fontSize: 11, fontWeight: 500 }}>%</span>
              </span>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="label-eyebrow mb-1" style={{ fontSize: 10 }}>Montant total</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1 }}>
                {amount.toLocaleString("fr-FR")}
              </span>
              <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)" }}>€</span>
            </div>
            <div className="text-mute mt-1.5" style={{ fontSize: 11, fontFamily: "var(--font-mono)" }}>
              {Math.round(depositEuros).toLocaleString("fr-FR")} € acompte · {Math.round(amount - depositEuros).toLocaleString("fr-FR")} € solde
            </div>
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={10000}
          step={50}
          value={amount}
          onChange={(e) => patch((p) => ({ ...p, pricing: { ...p.pricing!, amount: parseInt(e.target.value, 10) } }))}
          style={{ width: "100%", accentColor: "var(--color-carbon)", cursor: "pointer" }}
        />
        <div className="flex gap-1.5">
          {[20, 30, 40, 50].map((pct) => {
            const active = draft.pricing?.deposit.type === "percent" && draft.pricing?.deposit.value === pct;
            return (
              <button
                key={pct}
                type="button"
                onClick={() => patch((p) => ({ ...p, pricing: { ...p.pricing!, deposit: { type: "percent", value: pct } } }))}
                data-cursor="hover"
                style={{
                  flex: 1,
                  padding: "5px 0",
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
      </div>
    </>
  );
}

/* ============================================================
   CESSION CARD — globe visual + chips territoire/durée
   ============================================================ */
function CessionCard({ draft, patch }: { draft: ReturnType<typeof useDraft>["draft"]; patch: ReturnType<typeof useDraft>["patch"] }) {
  const orbitRef = useRef<SVGGElement>(null);
  const TERRS = ["france", "ue", "monde"] as const;
  const DURS = ["12-mois", "3-ans", "5-ans", "10-ans", "duree-legale"] as const;
  const DUR_LBL: Record<string, string> = {
    "12-mois": "12 mois",
    "3-ans": "3 ans",
    "5-ans": "5 ans",
    "10-ans": "10 ans",
    "duree-legale": "70 ans",
  };
  const TERR_LBL: Record<string, string> = { france: "France", ue: "Europe", monde: "Monde" };

  const tIdx = TERRS.indexOf(draft.cession.territory as typeof TERRS[number]);
  const radius = 22 + tIdx * 12;

  useGSAP(
    () => {
      gsap.to(orbitRef.current, { rotation: 360, duration: 16, repeat: -1, ease: "none", transformOrigin: "50% 50%" });
    },
  );

  return (
    <>
      <CardHeader icon={Globe} title="Cession des droits" description="Art. L.131-3 CPI. Territoire et durée d'exploitation par le client." />
      <div style={{ flex: 1, padding: "16px 22px 22px 22px", display: "flex", gap: 18, alignItems: "stretch" }}>
        <div style={{ flexShrink: 0, position: "relative", width: 140, height: 140 }}>
          <svg width="140" height="140" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="3" fill="var(--color-carbon)" />
            <circle cx="50" cy="50" r="22" fill="none" stroke="var(--color-fog-deep)" strokeWidth="0.6" />
            <circle cx="50" cy="50" r="34" fill="none" stroke="var(--color-fog-deep)" strokeWidth="0.6" />
            <circle cx="50" cy="50" r="46" fill="none" stroke="var(--color-fog-deep)" strokeWidth="0.6" />
            <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--color-carbon)" strokeWidth="1.2" strokeDasharray="2 2" />
            <g ref={orbitRef}>
              <circle cx={50 + radius} cy="50" r="2.5" fill="var(--color-carbon)" />
            </g>
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
            <div style={{ textAlign: "center", lineHeight: 1.1, marginTop: 36 }}>
              <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {TERR_LBL[draft.cession.territory]}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 flex-1 min-w-0 justify-end">
          <div>
            <div className="label-eyebrow mb-1.5" style={{ fontSize: 10 }}>Territoire</div>
            <div className="flex gap-1">
              {TERRS.map((t) => {
                const active = draft.cession.territory === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => patch((p) => ({ ...p, cession: { ...p.cession, territory: t } }))}
                    data-cursor="hover"
                    style={{
                      flex: 1,
                      padding: "5px 8px",
                      fontSize: 11,
                      borderRadius: 999,
                      border: `1px solid ${active ? "var(--color-carbon)" : "var(--border-strong)"}`,
                      background: active ? "var(--color-carbon)" : "transparent",
                      color: active ? "var(--color-snow)" : "var(--text-secondary)",
                      cursor: "pointer",
                      transition: "all 180ms ease",
                      textTransform: "capitalize",
                    }}
                  >
                    {TERR_LBL[t]}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <div className="label-eyebrow mb-1.5" style={{ fontSize: 10 }}>Durée</div>
            <div className="grid grid-cols-3 gap-1">
              {DURS.map((d) => {
                const active = draft.cession.duration === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => patch((p) => ({ ...p, cession: { ...p.cession, duration: d } }))}
                    data-cursor="hover"
                    style={{
                      padding: "5px 6px",
                      fontSize: 11,
                      borderRadius: 999,
                      border: `1px solid ${active ? "var(--color-carbon)" : "var(--border-strong)"}`,
                      background: active ? "var(--color-carbon)" : "transparent",
                      color: active ? "var(--color-snow)" : "var(--text-secondary)",
                      cursor: "pointer",
                      transition: "all 180ms ease",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {DUR_LBL[d]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   SIGNATURE CARD — 2 mini canvases + status badge
   ============================================================ */
function SignatureCard({ draft }: { draft: ReturnType<typeof useDraft>["draft"] }) {
  const [photoSig, setPhotoSig] = useState<string | null>(null);
  const [clientSig, setClientSig] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  const bothSigned = !!photoSig && !!clientSig;

  useMemo(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  const shareUrl = useMemo(
    () => (origin && bothSigned ? buildShareUrl(origin, encodeDraftToHash(draft, `${photoSig}|${clientSig}`)) : ""),
    [origin, bothSigned, photoSig, clientSig, draft],
  );

  return (
    <>
      <CardHeader icon={PenTool} title="Signatures" description="Photographe et client signent au doigt. Stateless, encodé dans l'URL." />
      <div style={{ flex: 1, padding: "16px 22px 22px 22px", display: "flex", flexDirection: "column", gap: 12, justifyContent: "flex-end" }}>
        <div className="grid grid-cols-2 gap-2">
          <SignatureMini label="Photographe" name={draft.photographer.fullName} onChange={setPhotoSig} />
          <SignatureMini label="Client" name={draft.client.fullName} onChange={setClientSig} />
        </div>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: 999,
              background: bothSigned ? "var(--color-carbon)" : "var(--color-fog-deep)",
              color: bothSigned ? "var(--color-snow)" : "var(--text-secondary)",
              fontSize: 11,
              fontFamily: "var(--font-mono)",
            }}
          >
            {bothSigned && <Check size={11} strokeWidth={3} />}
            {bothSigned ? "Signé deux fois" : "0 / 2 signatures"}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => window.print()}
              disabled={!bothSigned}
              className="btn btn-ghost"
              style={{ padding: "6px 12px", fontSize: 12, opacity: bothSigned ? 1 : 0.45 }}
              data-cursor="hover"
            >
              <Printer size={12} />
              PDF
            </button>
            <button
              type="button"
              onClick={() => {
                if (shareUrl) navigator.clipboard?.writeText(shareUrl);
              }}
              disabled={!shareUrl}
              className="btn btn-primary"
              style={{ padding: "6px 12px", fontSize: 12, opacity: shareUrl ? 1 : 0.45 }}
              data-cursor="hover"
            >
              <Send size={12} />
              Lien signé
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function SignatureMini({ label, name, onChange }: { label: string; name: string; onChange: (s: string | null) => void }) {
  return (
    <div>
      <div className="text-mute mb-1.5" style={{ fontSize: 10, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label} {name && `· ${name}`}
      </div>
      <div style={{ height: 78 }}>
        <SignaturePad onChange={onChange} />
      </div>
    </div>
  );
}
