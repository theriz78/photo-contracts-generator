"use client";

import { useCallback, useEffect, useState } from "react";
import type { ContractDraft } from "./types";
import { DEFAULT_CLAUSES } from "./clauses-stub";

const STORAGE_KEY = "cp-draft-v1";

export function createEmptyDraft(): ContractDraft {
  return {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    type: "b2c",
    niche: "mariage",
    language: "fr",
    photographer: {
      fullName: "",
      brandName: "",
      logoDataUrl: "",
      siret: "",
      rcs: "",
      address: "",
      email: "",
      phone: "",
      iban: "",
      bic: "",
      insurance: "",
      microEntrepreneur: true,
      tvaExemption: true,
    },
    client: {
      legalForm: "personne-physique",
      fullName: "",
      representative: "",
      siret: "",
      birthDate: "",
      address: "",
      email: "",
      phone: "",
    },
    service: {
      niche: "mariage",
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      description: "",
      deliverables: {
        rawCount: undefined,
        retouchedCount: 50,
        formats: ["hd-jpg", "galerie-online"],
        deliveryDeadlineDays: 30,
        deliveryMethod: "galerie-privee",
      },
    },
    pricing: {
      mode: "forfait",
      amount: 1500,
      currency: "EUR",
      deposit: { type: "percent", value: 30 },
      balanceDueDays: 30,
      travelFee: 0,
      rushFee: 0,
    },
    tfpCounterparts: {
      retouchedCount: 15,
      modelUsageRights: "Usage non-commercial portfolio personnel + réseaux sociaux personnels.",
      creditMentionRequired: true,
      exclusivityMonths: 6,
      socialTagging: true,
      additionalCommitments: [
        "Disponibilité pour la séance entière, minimum 4 heures",
        "Mise à disposition de tenues personnelles selon brief",
      ],
    },
    cession: {
      rights: ["reproduction", "representation"],
      scope: "non-exclusive",
      destinations: ["editoriale"],
      territory: "monde",
      duration: "3-ans",
      customDuration: "",
      supports: ["print", "web", "social"],
      creditMention: "© {{photographerName}}",
    },
    penalties: {
      latePaymentEnabled: false,
      latePaymentRate: "3 fois le taux d'intérêt légal",
      recoveryFlatFee: 40,
      cancellationGraduated: false,
    },
    rightToImageAnnex: true,
    confidentiality: false,
    rgpdMinor: false,
    retractationB2C: true,
    forceMajeure: true,
    customClauses: DEFAULT_CLAUSES.map((c) => ({ ...c })),
    signaturePlace: "",
    signatureDate: new Date().toISOString().slice(0, 10),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function useDraft() {
  const [draft, setDraft] = useState<ContractDraft>(() => createEmptyDraft());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ContractDraft;
        setDraft({ ...createEmptyDraft(), ...parsed });
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...draft, updatedAt: Date.now() }));
    } catch {}
  }, [draft, hydrated]);

  const update = useCallback(<K extends keyof ContractDraft>(key: K, value: ContractDraft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  const patch = useCallback((patcher: (prev: ContractDraft) => ContractDraft) => {
    setDraft(patcher);
  }, []);

  const reset = useCallback(() => {
    setDraft(createEmptyDraft());
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return { draft, setDraft, update, patch, reset, hydrated };
}
