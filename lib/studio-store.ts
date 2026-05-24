"use client";

import { useCallback, useEffect, useState } from "react";
import type { Photographer, ContractDraft } from "./types";

const KEY = "cp-studio-v1";
const COOKIE = "cp-studio";
const TTL_DAYS = 730;

export interface StudioProfile {
  photographer: Photographer | null;
  lastPresetId?: string;
  drafts: { id: string; type: string; niche: string; title: string; updatedAt: number }[];
  configuredAt?: number;
}

const EMPTY: StudioProfile = { photographer: null, drafts: [] };

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 86400_000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1] ?? "") : null;
}

function read(): StudioProfile {
  try {
    const ls = localStorage.getItem(KEY);
    if (ls) return JSON.parse(ls) as StudioProfile;
    const ck = getCookie(COOKIE);
    if (ck) {
      const parsed = JSON.parse(ck) as Partial<StudioProfile>;
      return { ...EMPTY, ...parsed, drafts: parsed.drafts ?? [] };
    }
  } catch {}
  return { ...EMPTY };
}

function write(profile: StudioProfile) {
  try {
    localStorage.setItem(KEY, JSON.stringify(profile));
    const tiny = {
      photographer: profile.photographer,
      lastPresetId: profile.lastPresetId,
      configuredAt: profile.configuredAt,
    };
    setCookie(COOKIE, JSON.stringify(tiny), TTL_DAYS);
  } catch {}
}

export function useStudio() {
  const [studio, setStudio] = useState<StudioProfile>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setStudio(read());
    setHydrated(true);
  }, []);

  const saveProfile = useCallback((photographer: Photographer) => {
    setStudio((prev) => {
      const next: StudioProfile = { ...prev, photographer, configuredAt: prev.configuredAt ?? Date.now() };
      write(next);
      return next;
    });
  }, []);

  const archiveDraft = useCallback((draft: ContractDraft) => {
    setStudio((prev) => {
      const entry = {
        id: draft.id,
        type: draft.type,
        niche: draft.niche,
        title: draft.service.title || `Contrat ${new Date(draft.updatedAt).toLocaleDateString("fr-FR")}`,
        updatedAt: draft.updatedAt,
      };
      const dedup = prev.drafts.filter((d) => d.id !== draft.id);
      const drafts = [entry, ...dedup].slice(0, 3);
      const next: StudioProfile = { ...prev, drafts };
      write(next);
      return next;
    });
  }, []);

  const setLastPreset = useCallback((presetId: string) => {
    setStudio((prev) => {
      const next = { ...prev, lastPresetId: presetId };
      write(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
      setCookie(COOKIE, "", -1);
    } catch {}
    setStudio(EMPTY);
  }, []);

  return { studio, hydrated, saveProfile, archiveDraft, setLastPreset, reset };
}

export function isConfigured(s: StudioProfile): boolean {
  return !!s.photographer?.fullName && !!s.photographer?.email;
}
