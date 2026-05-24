"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { TypeBlock } from "@/components/bento/type-block";
import { CessionDialBlock } from "@/components/bento/cession-dial";
import { TarifCircleBlock } from "@/components/bento/tarif-circle";
import { SignatureBlock } from "@/components/bento/signature-block";
import { ThemeToggle } from "@/components/theme-toggle";
import { CustomCursor } from "@/components/custom-cursor";
import { useDraft } from "@/lib/draft-store";

export default function BentoPage() {
  const { draft, patch, hydrated } = useDraft();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".cp-bento-cell", { opacity: 0, y: 24, duration: 0.6, stagger: 0.1, ease: "power3.out" });
    },
    { scope: ref, dependencies: [hydrated] },
  );

  if (!hydrated) {
    return <div className="h-screen grid place-items-center text-mute text-sm">Chargement…</div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <CustomCursor />

      <header
        className="no-print"
        style={{ position: "sticky", top: 0, zIndex: 30, background: "color-mix(in oklab, var(--bg-base) 85%, transparent)", backdropFilter: "blur(14px)", borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div className="mx-auto flex items-center justify-between px-6 py-3.5" style={{ maxWidth: 1280 }}>
          <Link href="/" className="flex items-center gap-2" data-cursor="hover" style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-secondary)" }}>
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

      <main ref={ref} className="mx-auto px-4 sm:px-6 py-8 pb-20" style={{ maxWidth: 1280 }}>
        <section className="mb-10">
          <div className="label-eyebrow mb-3">Bento dashboard · Prototype</div>
          <h1
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              maxWidth: 880,
            }}
          >
            Le contrat se construit{" "}
            <span style={{ color: "var(--color-pewter)" }}>en quatre blocs interactifs</span>.
          </h1>
          <p className="text-soft mt-4" style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 620 }}>
            Chaque bloc traduit visuellement l'action. Tu manipules directement les paramètres : type juridique, cession granulaire, tarif, signature. L'aperçu se met à jour en direct.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="cp-bento-cell">
            <TypeBlock draft={draft} patch={patch} />
          </div>
          <div className="cp-bento-cell">
            <TarifCircleBlock draft={draft} patch={patch} />
          </div>
          <div className="cp-bento-cell lg:col-span-2">
            <CessionDialBlock draft={draft} patch={patch} />
          </div>
          <div className="cp-bento-cell lg:col-span-2">
            <SignatureBlock draft={draft} />
          </div>
        </div>
      </main>
    </div>
  );
}
