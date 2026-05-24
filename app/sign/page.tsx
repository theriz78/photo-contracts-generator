"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, FileCheck2, Printer, Mail, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { PreviewPanel } from "@/components/preview-panel";
import { SignaturePad } from "@/components/signature-pad";
import type { ContractDraft } from "@/lib/types";
import { decodeDraftFromHash, encodeDraftToHash, buildShareUrl } from "@/lib/share-encode";
import { buildMailto } from "@/lib/mail-templates";

export default function SignPage() {
  const [draft, setDraft] = useState<ContractDraft | null>(null);
  const [photographerSignature, setPhotographerSignature] = useState<string | null>(null);
  const [clientSignature, setClientSignature] = useState<string | null>(null);
  const [decoded, setDecoded] = useState<{ ok: boolean; reason?: string }>({ ok: false });
  const [signedUrl, setSignedUrl] = useState<string>("");

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 5) {
      setDecoded({ ok: false, reason: "Lien invalide. Aucun contrat dans l'URL." });
      return;
    }
    const result = decodeDraftFromHash(hash);
    if (!result) {
      setDecoded({ ok: false, reason: "Lien invalide ou corrompu. Demandez un nouveau lien au photographe." });
      return;
    }
    setDraft(result.draft);
    if (result.signature) {
      const parts = result.signature.split("|");
      if (parts[0]) setPhotographerSignature(parts[0]);
      if (parts[1]) setClientSignature(parts[1]);
    }
    setDecoded({ ok: true });
  }, []);

  useEffect(() => {
    if (!draft) return;
    const sig = `${photographerSignature ?? ""}|${clientSignature ?? ""}`;
    const encoded = encodeDraftToHash(draft, sig);
    setSignedUrl(buildShareUrl(window.location.origin, encoded));
  }, [draft, photographerSignature, clientSignature]);

  if (!decoded.ok) {
    return (
      <div className="min-h-screen grid place-items-center px-6">
        <div className="bento-card text-center" style={{ maxWidth: 480 }}>
          <AlertTriangle size={28} className="mx-auto mb-3" style={{ color: "var(--color-rose-ink)" }} />
          <div className="display-md mb-2">Impossible de charger le contrat</div>
          <p className="text-sm text-soft mb-4">{decoded.reason}</p>
          <Link href="/" className="btn btn-primary">
            <ArrowLeft size={14} />
            Retour au générateur
          </Link>
        </div>
      </div>
    );
  }

  if (!draft) {
    return <div className="min-h-screen grid place-items-center text-mute text-sm">Chargement du contrat…</div>;
  }

  const sendBack = () => {
    const subject = `Contrat signé — ${draft.service.title || "Prestation photo"}`;
    const body = `Bonjour ${draft.photographer.fullName || ""},

J'ai signé le contrat de prestation photographique. Vous pouvez consulter et télécharger la version signée via ce lien sécurisé (les données restent dans l'URL, aucun serveur tiers) :

${signedUrl}

Cordialement,
${draft.client.fullName || ""}`;
    window.location.href = buildMailto(subject, body, draft.photographer.email);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className="no-print sticky top-0 z-30"
        style={{ background: "color-mix(in oklab, var(--bg-base) 88%, transparent)", backdropFilter: "blur(14px)" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center gap-3">
            <div
              className="grid place-items-center"
              style={{ width: 36, height: 36, background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 10 }}
            >
              <ShieldCheck size={18} className="text-accent" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="display-md">Signature en ligne</span>
              <span className="label-eyebrow">Stateless · Aucune base de données</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-6">
        <div className="mx-auto" style={{ maxWidth: 1280 }}>
          <div className="bento-card mb-4" style={{ background: "var(--bg-card-hover)", borderColor: "var(--accent-deep)", animation: "cp-step-in 360ms ease both" }}>
            <div className="flex items-start gap-3">
              <FileCheck2 size={18} className="text-accent shrink-0 mt-0.5" />
              <div className="text-sm text-soft">
                Ce contrat vous a été envoyé pour signature. Relisez attentivement, puis signez ci-dessous. Le contrat peut être téléchargé en PDF à tout moment. Aucune donnée n'est stockée sur un serveur, tout reste dans le lien URL.
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,640px)_1fr]">
            <div>
              <div className="label-eyebrow mb-2 flex items-center gap-2">Aperçu contrat</div>
              <PreviewPanel draft={draft} />
            </div>

            <div className="flex flex-col gap-4">
              <section className="bento-card">
                <div className="display-md mb-1">Signature du photographe</div>
                <p className="text-xs text-mute mb-3">{draft.photographer.fullName}</p>
                <SignaturePad initial={photographerSignature ?? undefined} onChange={setPhotographerSignature} />
              </section>

              <section className="bento-card">
                <div className="display-md mb-1">Signature du client</div>
                <p className="text-xs text-mute mb-3">{draft.client.fullName}</p>
                <SignaturePad initial={clientSignature ?? undefined} onChange={setClientSignature} />
                <p className="text-xs text-mute mt-3 italic">
                  En signant, je reconnais avoir lu et approuvé l'intégralité du présent contrat ainsi que ses annexes.
                </p>
              </section>

              <section className="bento-card" style={{ background: "var(--bg-card-hover)" }}>
                <div className="display-md mb-2">Et après ?</div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => window.print()} className="btn btn-primary justify-center">
                    <Printer size={14} />
                    Télécharger PDF signé
                  </button>
                  <button onClick={sendBack} className="btn btn-ghost justify-center" disabled={!clientSignature}>
                    <Mail size={14} />
                    Renvoyer signé au photographe
                  </button>
                </div>
                <p className="text-xs text-mute mt-3">Le lien renvoyé contient les signatures encodées. Aucun serveur tiers ne voit vos données.</p>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Print-only: contract + signatures stamped */}
      <div className="print-only" style={{ display: "none" }}>
        <PreviewPanelWithSignatures draft={draft} photographerSig={photographerSignature} clientSig={clientSignature} />
      </div>
    </div>
  );
}

function PreviewPanelWithSignatures({
  draft,
  photographerSig,
  clientSig,
}: {
  draft: ContractDraft;
  photographerSig: string | null;
  clientSig: string | null;
}) {
  return (
    <div>
      <PreviewPanel draft={draft} />
      <div style={{ display: "flex", gap: 24, marginTop: 16, padding: "0 36px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "#555" }}>Le Photographe</div>
          <div style={{ fontSize: 11, marginBottom: 4 }}>{draft.photographer.fullName}</div>
          {photographerSig ? (
            <img src={photographerSig} alt="Signature photographe" style={{ maxWidth: 220, maxHeight: 80 }} />
          ) : (
            <div style={{ fontSize: 10, fontStyle: "italic", color: "#999" }}>Non signé</div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "#555" }}>Le Client</div>
          <div style={{ fontSize: 11, marginBottom: 4 }}>{draft.client.fullName}</div>
          {clientSig ? (
            <img src={clientSig} alt="Signature client" style={{ maxWidth: 220, maxHeight: 80 }} />
          ) : (
            <div style={{ fontSize: 10, fontStyle: "italic", color: "#999" }}>Non signé</div>
          )}
        </div>
      </div>
    </div>
  );
}
