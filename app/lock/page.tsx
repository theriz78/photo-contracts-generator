import { Lock } from "lucide-react";
import { unlockAction } from "./actions";

export const metadata = {
  title: "Accès protégé",
  robots: { index: false, follow: false },
};

export default async function LockPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const errored = sp.error === "1";
  const next = sp.next ?? "/";

  return (
    <div className="min-h-screen grid place-items-center px-6">
      <div className="bento-card w-full" style={{ maxWidth: 420 }}>
        <div className="flex flex-col items-center gap-3 mb-5">
          <div
            className="grid place-items-center"
            style={{ width: 48, height: 48, background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: 12 }}
          >
            <Lock size={20} className="text-accent" />
          </div>
          <div className="display-md text-center">Accès protégé</div>
          <p className="text-xs text-mute text-center">Entre le mot de passe pour accéder au générateur.</p>
        </div>

        <form action={unlockAction} className="flex flex-col gap-3">
          <input type="hidden" name="next" value={next} />
          <label className="flex flex-col gap-1">
            <span className="label-eyebrow">Mot de passe</span>
            <input
              type="password"
              name="password"
              autoFocus
              required
              className="field-input"
              autoComplete="current-password"
              style={errored ? { borderColor: "var(--color-rose-ink)" } : undefined}
            />
            {errored && <span className="text-xs" style={{ color: "var(--color-rose-ink)" }}>Mot de passe incorrect.</span>}
          </label>
          <button type="submit" className="btn btn-primary mt-1">Déverrouiller</button>
        </form>
      </div>
    </div>
  );
}
