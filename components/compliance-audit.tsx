"use client";

import { useState, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Shield, CheckCircle2, AlertTriangle, XCircle, X, ShieldCheck } from "lucide-react";
import type { ContractDraft } from "@/lib/types";
import { runCompliance, summary, type ComplianceCheck, type CheckStatus } from "@/lib/compliance";

const STATUS_META: Record<CheckStatus, { icon: typeof CheckCircle2; color: string; label: string }> = {
  pass: { icon: CheckCircle2, color: "#1c7c54", label: "Conforme" },
  warn: { icon: AlertTriangle, color: "#a36b00", label: "Attention" },
  fail: { icon: XCircle, color: "#a32626", label: "Bloquant" },
};

export function ComplianceAudit({ draft }: { draft: ContractDraft }) {
  const [open, setOpen] = useState(false);
  const checks = useMemo(() => runCompliance(draft), [draft]);
  const sum = useMemo(() => summary(checks), [checks]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn btn-ghost"
        data-cursor="hover"
        style={{ padding: "8px 14px", fontSize: 13, gap: 8 }}
        aria-label="Audit compliance"
      >
        <Shield size={14} />
        <span className="hidden sm:inline">Audit</span>
        <span
          aria-hidden
          style={{
            minWidth: 18,
            height: 18,
            padding: "0 6px",
            borderRadius: 999,
            background: sum.fail > 0 ? "#a32626" : sum.warn > 0 ? "#a36b00" : "#1c7c54",
            color: "var(--color-snow)",
            fontSize: 10,
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-mono)",
          }}
        >
          {sum.fail > 0 ? sum.fail : sum.warn > 0 ? sum.warn : sum.pass}
        </span>
      </button>

      {open && <Modal checks={checks} sum={sum} onClose={() => setOpen(false)} />}
    </>
  );
}

function Modal({
  checks,
  sum,
  onClose,
}: {
  checks: ComplianceCheck[];
  sum: ReturnType<typeof summary>;
  onClose: () => void;
}) {
  const backdrop = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(backdrop.current, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power2.out" });
      gsap.fromTo(panel.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.34, ease: "power3.out" });
    },
    { scope: backdrop },
  );

  return (
    <div
      ref={backdrop}
      onClick={onClose}
      className="fixed inset-0 z-40 grid place-items-center p-4 no-print"
      style={{
        background: "color-mix(in oklab, var(--color-carbon) 50%, transparent)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        ref={panel}
        onClick={(e) => e.stopPropagation()}
        className="bento-card w-full"
        style={{ maxWidth: 720, maxHeight: "90vh", overflow: "auto", padding: 0 }}
      >
        <header
          className="flex items-start justify-between p-5"
          style={{ borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-elevated)" }}
        >
          <div className="flex items-start gap-3">
            <div
              className="grid place-items-center shrink-0"
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: sum.fail > 0 ? "#a32626" : sum.warn > 0 ? "#a36b00" : "#1c7c54",
                color: "var(--color-snow)",
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="display-md" style={{ fontSize: 16, fontWeight: 600 }}>
                Audit de conformité
              </div>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="label-tag" style={{ color: "#1c7c54" }}>
                  ● {sum.pass} conforme{sum.pass > 1 ? "s" : ""}
                </span>
                {sum.warn > 0 && (
                  <span className="label-tag" style={{ color: "#a36b00" }}>
                    ● {sum.warn} attention
                  </span>
                )}
                {sum.fail > 0 && (
                  <span className="label-tag" style={{ color: "#a32626" }}>
                    ● {sum.fail} bloquant{sum.fail > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-icon shrink-0"
            aria-label="Fermer"
            data-cursor="hover"
          >
            <X size={14} />
          </button>
        </header>

        <div style={{ padding: 18 }}>
          {!sum.blockers && (
            <div
              className="bento-card mb-3"
              style={{
                padding: 14,
                background: "color-mix(in oklab, #a32626 6%, var(--bg-elevated))",
                borderColor: "#a32626",
              }}
            >
              <div className="text-sm font-medium" style={{ color: "#a32626" }}>
                Contrat non exportable en l'état.
              </div>
              <p className="text-soft mt-1" style={{ fontSize: 12, lineHeight: 1.5 }}>
                Corrige les points bloquants ci-dessous avant export ou envoi pour signature.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {checks.map((c) => {
              const meta = STATUS_META[c.status];
              const Icon = meta.icon;
              return (
                <article
                  key={c.id}
                  className="bento-card"
                  style={{
                    padding: 12,
                    background: "var(--bg-card)",
                    borderLeft: `3px solid ${meta.color}`,
                    borderRadius: 6,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Icon size={16} style={{ color: meta.color, flexShrink: 0, marginTop: 2 }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-medium" style={{ fontSize: 14 }}>
                          {c.label}
                        </span>
                        {c.ref && (
                          <span className="label-tag" style={{ fontSize: 10, color: "var(--text-muted)" }}>
                            {c.ref}
                          </span>
                        )}
                      </div>
                      <p className="text-soft mt-1" style={{ fontSize: 12, lineHeight: 1.55 }}>
                        {c.detail}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <footer
          className="p-4 flex items-center justify-between gap-2"
          style={{ borderTop: "1px solid var(--border-subtle)", background: "var(--bg-elevated)" }}
        >
          <span className="text-mute" style={{ fontSize: 11, fontFamily: "var(--font-mono)" }}>
            Audit indicatif. Pour enjeux importants, faire relire par avocat.
          </span>
          <button onClick={onClose} className="btn btn-primary" data-cursor="hover">
            Fermer
          </button>
        </footer>
      </div>
    </div>
  );
}
