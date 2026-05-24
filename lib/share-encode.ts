import type { ContractDraft } from "./types";

function utf8ToBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToUtf8(input: string): string {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

const STORAGE_KEYS_TO_DROP = ["createdAt", "updatedAt"] as const;

export function encodeDraftToHash(draft: ContractDraft, signature?: string): string {
  const compact: Partial<ContractDraft> & { sig?: string } = { ...draft };
  for (const k of STORAGE_KEYS_TO_DROP) delete (compact as Record<string, unknown>)[k];
  if (signature) (compact as { sig?: string }).sig = signature;
  const json = JSON.stringify(compact);
  return utf8ToBase64Url(json);
}

export function decodeDraftFromHash(hash: string): { draft: ContractDraft; signature?: string } | null {
  try {
    const clean = hash.replace(/^#/, "");
    if (!clean) return null;
    const json = base64UrlToUtf8(clean);
    const parsed = JSON.parse(json) as ContractDraft & { sig?: string };
    const { sig, ...draft } = parsed;
    return { draft: draft as ContractDraft, signature: sig };
  } catch {
    return null;
  }
}

export function buildShareUrl(origin: string, encoded: string): string {
  return `${origin}/sign#${encoded}`;
}
