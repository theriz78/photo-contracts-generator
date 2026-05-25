"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Info, AlertTriangle, X } from "lucide-react";
import type { ContractDraft } from "@/lib/types";
import { evalTips, type Tip } from "@/lib/tips";

interface ToastEntry extends Tip {
  show: boolean;
}

const SEEN_KEY = "cp-tips-seen-v1";

function loadSeen(): Set<string> {
  try {
    const s = sessionStorage.getItem(SEEN_KEY);
    return new Set(s ? (JSON.parse(s) as string[]) : []);
  } catch {
    return new Set();
  }
}

function saveSeen(seen: Set<string>) {
  try {
    sessionStorage.setItem(SEEN_KEY, JSON.stringify(Array.from(seen)));
  } catch {}
}

export function TipsToaster({ draft }: { draft: ContractDraft }) {
  const [queue, setQueue] = useState<ToastEntry[]>([]);
  const seenRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    seenRef.current = loadSeen();
  }, []);

  useEffect(() => {
    const tips = evalTips(draft);
    const newOnes = tips.filter((t) => !seenRef.current.has(t.id));
    if (newOnes.length === 0) return;
    newOnes.forEach((t) => seenRef.current.add(t.id));
    saveSeen(seenRef.current);
    setQueue((q) => [...q, ...newOnes.map((t) => ({ ...t, show: true }))]);
  }, [draft]);

  const dismiss = (id: string) => {
    setQueue((q) => q.map((t) => (t.id === id ? { ...t, show: false } : t)));
    setTimeout(() => setQueue((q) => q.filter((t) => t.id !== id)), 350);
  };

  if (queue.length === 0) return null;

  return (
    <div
      className="no-print"
      style={{
        position: "fixed",
        top: 70,
        right: 12,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        maxWidth: 360,
        pointerEvents: "none",
      }}
    >
      {queue.map((t) => (
        <ToastCard key={t.id} tip={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastCard({ tip, onDismiss }: { tip: ToastEntry; onDismiss: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (tip.show) {
      gsap.fromTo(
        ref.current,
        { x: 380, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.42, ease: "power3.out" },
      );
      const id = setTimeout(() => onDismiss(), 7200);
      return () => clearTimeout(id);
    } else {
      gsap.to(ref.current, { x: 380, opacity: 0, duration: 0.32, ease: "power2.in" });
    }
  }, [tip.show, onDismiss]);

  const Icon = tip.level === "warn" ? AlertTriangle : Info;
  const accentColor = tip.level === "warn" ? "#a36b00" : "var(--color-pewter)";

  return (
    <div
      ref={ref}
      role="alert"
      style={{
        background: "var(--color-snow)",
        border: "1px solid var(--border-strong)",
        borderRadius: 6,
        padding: "12px 14px",
        boxShadow: "0 8px 24px -8px rgba(0,0,0,0.18)",
        display: "flex",
        gap: 10,
        pointerEvents: "auto",
        borderLeftColor: accentColor,
        borderLeftWidth: 3,
      }}
    >
      <Icon size={15} style={{ color: accentColor, flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, marginBottom: 2 }}>
          {tip.title}
        </div>
        <p style={{ fontSize: 12, lineHeight: 1.5, color: "var(--text-secondary)", margin: 0 }}>
          {tip.message}
        </p>
        {tip.ref && (
          <p
            style={{
              fontSize: 10,
              lineHeight: 1.3,
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              marginTop: 4,
              marginBottom: 0,
            }}
          >
            {tip.ref}
          </p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="btn btn-ghost btn-icon shrink-0"
        aria-label="Fermer"
        style={{ width: 24, height: 24, padding: 4, border: "none" }}
      >
        <X size={12} />
      </button>
    </div>
  );
}
