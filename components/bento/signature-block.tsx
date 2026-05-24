"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Eraser, Check, Send, Printer } from "lucide-react";
import { SignaturePad } from "../signature-pad";
import { BentoHeader } from "./type-block";
import { encodeDraftToHash, buildShareUrl } from "@/lib/share-encode";
import type { ContractDraft } from "@/lib/types";

export function SignatureBlock({ draft }: { draft: ContractDraft }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [photoSig, setPhotoSig] = useState<string | null>(null);
  const [clientSig, setClientSig] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useGSAP(
    () => {
      gsap.from(".cp-sig-row", { opacity: 0, y: 10, duration: 0.4, stagger: 0.08, ease: "power2.out" });
    },
    { scope: wrapRef },
  );

  const signedShareUrl = origin && photoSig && clientSig
    ? buildShareUrl(origin, encodeDraftToHash(draft, `${photoSig}|${clientSig}`))
    : "";

  const bothSigned = !!photoSig && !!clientSig;

  return (
    <div ref={wrapRef} className="flex flex-col gap-4">
      <BentoHeader eyebrow="04 · Signatures" title="Signer en direct" hint={bothSigned ? "✓ Prêt à exporter" : "En attente"} />

      <div
        className="bento-card"
        style={{ padding: 22, background: "var(--color-snow)", borderRadius: 6, position: "relative", overflow: "hidden" }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: -80,
            right: -60,
            width: 220,
            height: 220,
            background: "radial-gradient(circle, var(--color-fog-deep) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="cp-sig-row">
            <div className="label-eyebrow mb-2" style={{ fontSize: 10 }}>
              Le Photographe — {draft.photographer.fullName || "[Nom photographe]"}
            </div>
            <SignaturePad onChange={setPhotoSig} />
          </div>
          <div className="cp-sig-row">
            <div className="label-eyebrow mb-2" style={{ fontSize: 10 }}>
              Le Client — {draft.client.fullName || "[Nom client]"}
            </div>
            <SignaturePad onChange={setClientSig} />
          </div>
        </div>

        <div className="cp-sig-row flex items-center justify-between gap-3 mt-5 pt-4 flex-wrap" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <div className="flex items-center gap-3">
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
            <p style={{ fontSize: 11, color: "var(--text-muted)", fontStyle: "italic", margin: 0 }}>
              Preuve simple Art. 1366 C. civ
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              disabled={!bothSigned}
              className="btn btn-ghost"
              style={{ opacity: bothSigned ? 1 : 0.5 }}
              data-cursor="hover"
            >
              <Printer size={13} />
              Télécharger PDF
            </button>
            <button
              type="button"
              onClick={() => {
                if (signedShareUrl) navigator.clipboard?.writeText(signedShareUrl);
              }}
              disabled={!signedShareUrl}
              className="btn btn-primary"
              style={{ opacity: signedShareUrl ? 1 : 0.5 }}
              data-cursor="hover"
            >
              <Send size={13} />
              Partager lien signé
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
