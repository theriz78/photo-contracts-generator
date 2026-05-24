"use client";

import { Printer, Mail, Sparkles, Copy, Check, Send, Link2, QrCode } from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import QRCode from "qrcode";
import type { ContractDraft } from "@/lib/types";
import { MAIL_TEMPLATES, interpolate, buildMailto } from "@/lib/mail-templates";
import { encodeDraftToHash, buildShareUrl } from "@/lib/share-encode";
import { cn } from "@/lib/utils";
import { ComplianceAudit } from "./compliance-audit";

export function ActionBar({ draft }: { draft: ContractDraft }) {
  const [mailOpen, setMailOpen] = useState(false);
  const [signOpen, setSignOpen] = useState(false);

  return (
    <>
      <div className="no-print action-dock">
        <div
          className="bento-card flex items-center justify-between gap-2"
          style={{
            padding: "10px 12px",
            background: "color-mix(in oklab, var(--bg-card) 88%, transparent)",
            backdropFilter: "blur(14px)",
            borderColor: "var(--border-strong)",
            boxShadow: "0 10px 40px -10px color-mix(in oklab, var(--bg-base) 80%, transparent)",
          }}
        >
          <div className="flex items-center gap-2 pl-2 shrink-0">
            <Sparkles size={14} className="text-accent" />
            <span className="text-sm text-soft hidden sm:inline">Actions</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <ComplianceAudit draft={draft} />
            <button onClick={() => setMailOpen(true)} className="btn btn-ghost" style={{ padding: "8px 12px", fontSize: 13 }}>
              <Mail size={14} />
              <span className="hidden sm:inline">Email</span>
            </button>
            <button onClick={() => setSignOpen(true)} className="btn btn-ghost" style={{ padding: "8px 12px", fontSize: 13 }}>
              <Send size={14} />
              <span className="hidden sm:inline">Signature</span>
            </button>
            <button onClick={() => window.print()} className="btn btn-primary" style={{ padding: "8px 14px", fontSize: 13 }}>
              <Printer size={14} />
              <span>PDF</span>
            </button>
          </div>
        </div>
      </div>

      {mailOpen && <MailModal draft={draft} onClose={() => setMailOpen(false)} />}
      {signOpen && <SignShareModal draft={draft} onClose={() => setSignOpen(false)} />}
    </>
  );
}

function MailModal({ draft, onClose }: { draft: ContractDraft; onClose: () => void }) {
  const [templateId, setTemplateId] = useState<typeof MAIL_TEMPLATES[number]["id"]>("devis-envoi");
  const template = MAIL_TEMPLATES.find((t) => t.id === templateId)!;
  const [subject, setSubject] = useState(interpolate(template.subject, draft));
  const [body, setBody] = useState(interpolate(template.body, draft));
  const [copied, setCopied] = useState(false);

  const switchTemplate = (id: typeof templateId) => {
    setTemplateId(id);
    const t = MAIL_TEMPLATES.find((x) => x.id === id)!;
    setSubject(interpolate(t.subject, draft));
    setBody(interpolate(t.body, draft));
  };

  const openMailto = () => {
    const url = buildMailto(subject, body, draft.client.email ?? "");
    window.location.href = url;
  };

  const copyToClipboard = async () => {
    const text = `À : ${draft.client.email}\nObjet : ${subject}\n\n${body}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <ModalShell onClose={onClose} title="Email préparé" eyebrow="Mailto natif">
      <p className="text-sm text-mute mt-1 mb-4">Modifie objet et corps avant ouverture. Aucun envoi côté serveur.</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {MAIL_TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => switchTemplate(t.id)}
            className={cn("btn", templateId === t.id ? "btn-primary" : "btn-ghost")}
            style={{ padding: "6px 12px", fontSize: 12 }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="label-eyebrow">Destinataire</span>
          <input value={draft.client.email} readOnly className="field-input" style={{ color: "var(--text-mute)" }} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="label-eyebrow">Objet</span>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} className="field-input" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="label-eyebrow">Corps</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={12}
            className="field-input"
            style={{ resize: "vertical", lineHeight: 1.55 }}
          />
          <span className="text-xs text-mute mt-1">
            {body.length} caractères {body.length > 1800 && <span style={{ color: "var(--accent)" }}>(certains clients mail limitent à 2000)</span>}
          </span>
        </label>
      </div>

      <div className="flex gap-2 mt-4">
        <button onClick={copyToClipboard} className="btn btn-ghost flex-1">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copié !" : "Copier"}
        </button>
        <button onClick={openMailto} className="btn btn-primary flex-1">
          <Mail size={14} />
          Ouvrir l'app mail
        </button>
      </div>
    </ModalShell>
  );
}

function SignShareModal({ draft, onClose }: { draft: ContractDraft; onClose: () => void }) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const shareUrl = useMemo(() => {
    if (!origin) return "";
    return buildShareUrl(origin, encodeDraftToHash(draft));
  }, [draft, origin]);

  const ready =
    draft.client.fullName && draft.client.email && draft.photographer.fullName && draft.service.title;

  useEffect(() => {
    if (!shareUrl || !ready) {
      setQrDataUrl("");
      return;
    }
    let cancelled = false;
    QRCode.toDataURL(shareUrl, {
      errorCorrectionLevel: "L",
      margin: 2,
      width: 240,
      color: { dark: "#0a0908", light: "#ffffff" },
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl("");
      });
    return () => {
      cancelled = true;
    };
  }, [shareUrl, ready]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const sendByEmail = () => {
    const subject = `Contrat à signer — ${draft.service.title}`;
    const body = `Bonjour ${draft.client.fullName},

Voici le lien sécurisé vers votre contrat de prestation photographique. Tout est encodé dans le lien lui-même, aucune donnée n'est stockée sur un serveur tiers. Vous pouvez ouvrir ce lien sur votre téléphone, relire le contrat, signer du doigt et le retourner signé.

${shareUrl}

Si vous avez la moindre question avant signature, n'hésitez pas à me joindre directement.

Cordialement,
${draft.photographer.fullName}
${draft.photographer.brandName ?? ""}
${draft.photographer.phone}`;
    window.location.href = buildMailto(subject, body, draft.client.email);
  };

  return (
    <ModalShell onClose={onClose} title="Envoyer pour signature" eyebrow="Lien stateless · zéro serveur">
      <p className="text-sm text-soft mt-1 mb-4">
        Le contrat complet est encodé directement dans l'URL (hash). Le destinataire ouvre le lien sur son téléphone, signe au doigt, télécharge le PDF signé ou renvoie un lien signé par email.
      </p>

      {!ready && (
        <div
          className="bento-card mb-4"
          style={{ padding: 12, background: "color-mix(in oklab, var(--color-rose-ink) 30%, var(--bg-card))", borderColor: "var(--color-rose-ink)" }}
        >
          <div className="text-sm">
            Avant d'envoyer, remplis au minimum : <strong>nom du photographe</strong>, <strong>nom du client</strong>, <strong>email du client</strong>, <strong>titre prestation</strong>.
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-[1fr_240px] gap-4">
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="label-eyebrow flex items-center gap-2"><Link2 size={12} /> Lien de signature</span>
            <textarea
              value={shareUrl}
              readOnly
              rows={5}
              className="field-input"
              style={{ fontFamily: "ui-monospace, SFMono-Regular, monospace", fontSize: 11, lineHeight: 1.5, wordBreak: "break-all" }}
              onFocus={(e) => e.currentTarget.select()}
            />
            <span className="text-xs text-mute mt-1">
              Longueur : {shareUrl.length} caractères. Compatible mailto si &lt; 2000.
            </span>
          </label>

          <div className="flex gap-2">
            <button onClick={copy} disabled={!ready} className="btn btn-ghost flex-1">
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Lien copié" : "Copier le lien"}
            </button>
            <button onClick={sendByEmail} disabled={!ready} className="btn btn-primary flex-1">
              <Mail size={14} />
              Envoyer par email
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="label-eyebrow flex items-center gap-2"><QrCode size={12} /> QR code</div>
          {qrDataUrl && ready ? (
            <img src={qrDataUrl} alt="QR code lien signature" style={{ width: 200, height: 200, borderRadius: 12, background: "white", padding: 6 }} />
          ) : (
            <div
              className="grid place-items-center"
              style={{ width: 200, height: 200, borderRadius: 12, background: "var(--bg-elevated)", border: "1px dashed var(--border-strong)", color: "var(--text-muted)", fontSize: 11, textAlign: "center", padding: 12 }}
            >
              {ready ? "Génération…" : "Lien indisponible (champs requis manquants)"}
            </div>
          )}
          <p className="text-xs text-mute text-center">Scan depuis le téléphone du client</p>
        </div>
      </div>

      <div className="text-xs text-mute mt-4 pt-4 border-t leading-relaxed" style={{ borderColor: "var(--border-subtle)" }}>
        Note : la signature manuscrite scannée a valeur de preuve simple (Art. 1366 Code civil). Pour les enjeux importants (cession exclusive longue durée, contrats &gt; 5 000 €), envisage une plateforme à valeur probante qualifiée eIDAS.
      </div>
    </ModalShell>
  );
}

function ModalShell({
  onClose,
  title,
  eyebrow,
  children,
}: {
  onClose: () => void;
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!backdropRef.current || !panelRef.current) return;
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power2.out" });
      gsap.fromTo(
        panelRef.current,
        { y: 24, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.36, ease: "power3.out" },
      );
    },
    { scope: backdropRef },
  );

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-40 grid place-items-center p-4"
      style={{ background: "color-mix(in oklab, var(--bg-base) 70%, transparent)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className="bento-card w-full"
        style={{ maxWidth: 760, maxHeight: "90vh", overflow: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="label-eyebrow">{eyebrow}</div>
            <div className="display-md mt-1">{title}</div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon" aria-label="Fermer">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
