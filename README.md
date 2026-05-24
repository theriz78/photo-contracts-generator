# Contrats Photographe FR

Générateur de contrats photographe pro français. **Zéro clé API à connecter.** Déployable Vercel zéro-config.

## Features

- **3 types de contrat** : B2B, B2C, TFP collaboration. Clauses auto-filtrées par type.
- **12 niches métier** : mariage, corporate, mode, immobilier, drone, événementiel, portrait, scolaire, sport, produit, animalier, artistique.
- **Cession granulaire L.131-3 CPI** : droits, étendue, destination, territoire, durée, supports.
- **15 clauses pré-écrites** activables, éditables inline.
- **Wizard 5 étapes** + live preview side-by-side desktop, drawer mobile.
- **Logo brand upload** : apparaît en en-tête du contrat PDF.
- **Mailto natif** : 5 templates pré-écrits (devis, rappel, livraison, facture, remerciements).
- **Print CSS @page A4** : PDF via le navigateur, zéro lib PDF.
- **Signature en ligne `/sign#<base64>`** : canvas tactile au doigt, QR code généré côté client, mailto retour. URL hash stateless, zéro base de données.
- **Bento UIUXpro MAX** : Bricolage Grotesque + Figtree (UI) + Libertinus Serif (contrat imprimé).
- **Dark / Light toggle**.
- **Auto-save draft** localStorage + export JSON.

## Zéro API externe

- **Aucune clé API à configurer**. Tout tourne en client / sur Vercel sans secrets.
- **Aucun service tiers** : QR code généré côté client par `qrcode` lib (pas d'appel `api.qrserver.com`).
- **Aucun serveur de signature** : tout encodé dans le hash de l'URL.
- **Aucun tracking, aucun analytics**.

## Stack

- **Next.js 15** App Router + TypeScript strict
- **React 19**
- **Tailwind CSS 4** (CSS-first, zéro `tailwind.config.ts`)
- **GSAP** + `@gsap/react` (animations stepper + modals)
- **Lucide React** (icons)
- **qrcode** (QR code client-side)
- **clsx + tailwind-merge** (className helpers)

Zéro lib PDF, zéro lib DOCX, zéro lib esign, zéro lib AI.

## Quick start

```bash
bun install
bun dev
# http://localhost:3000
```

## Deploy Vercel

```bash
cd ~/Projects/Eclectique/tools/contrats-photographe
bunx vercel              # preview
bunx vercel --prod       # prod
```

Aucune variable d'environnement à configurer. Région recommandée `cdg1` (vercel.json déjà réglé).

## Architecture

```
app/
  layout.tsx            ThemeProvider + Google fonts (Bricolage, Figtree)
  page.tsx              Wizard 5 steps + live preview bento + GSAP active pill
  globals.css           Tokens design + bento + @page print CSS + keyframes
  providers.tsx         ThemeProvider (dark/light persist localStorage)
  sign/page.tsx         Signature route : décodé URL hash + canvas tactile
components/
  topbar.tsx
  theme-toggle.tsx
  wizard-steps.tsx      5 steps + sub-components fields
  preview-panel.tsx     Render contract live + dynamic article numbering
  action-bar.tsx        Sticky bottom : Email + Send signature + PDF + GSAP modals
  signature-pad.tsx     Canvas pointer events tactile
lib/
  types.ts              ContractDraft TypeScript model
  clauses-stub.ts       15 clauses pré-écrites
  mail-templates.ts     5 templates email + interpolate + buildMailto
  draft-store.ts        useDraft hook avec localStorage persist
  share-encode.ts       base64url encode/decode draft pour URL hash
  utils.ts              cn, formatDateFR, formatMoney, slugify
```

## Cadre juridique couvert

- **Art. L.131-3 CPI** : cession droits granulaire (chaque droit mentionné distinctement, étendue, destination, lieu, durée). Clause générique = nulle.
- **Art. L.121-1 CPI** : droit moral inaliénable du photographe.
- **Art. 9 Code civil** : droit à l'image des personnes photographiées. Mineurs : autorisation 2 parents.
- **Art. 8 RGPD** : consentement parental pour mineurs.
- **Art. L.441-10 Code commerce** : pénalités B2B (3x taux intérêt légal) + indemnité forfaitaire 40 €.
- **Art. L.221-18 Code consommation** : droit de rétractation 14 jours B2C distance.
- **Art. 293 B CGI** : mention TVA non applicable micro-entrepreneur.
- **Art. 931 Code civil** : parade anti-donation TFP via licence avec contreparties non-financières exigibles.

## Roadmap (issue de 3 deep-research, ~3060 lignes)

V1.1 à intégrer :

1. **Bascule TVA 01/09/2026** : `Art. 293 B CGI` devient `Art. L. 223 et s. CIBS` (tolérance 31/12/2027). Switch automatique selon date du contrat.
2. **L.221-25 Code conso** : demande expresse écrite obligatoire pour shoot B2C avant 14 jours.
3. **L.132-31 CPI** : présomption cession publicité conditionnelle à décomposition tarifaire.
4. **Drone STS-01/STS-02 EASA** dès 01/01/2026 : caducité S1/S2/S3 et BAPD.
5. **URSSAF guichet unique artistes-auteurs** 01/04/2026.
6. **Annulation mariage 12 mois** vs 6 mois : barème configurable.
7. **Niches détaillées** : 12 niches métier (matrice 30 clauses × 12 niches).
8. **Multilingue FR/EN**.

Sources :

- `research/CONTRATS-PHOTOGRAPHE-DEEP-S88-2026-05-24.md` (1424 l.)
- `research/CONTRATS-PHOTOGRAPHE-NICHES-S88-2026-05-24.md` (969 l.)
- `research/CONTRATS-PHOTOGRAPHE-MARKET-UX-S88-2026-05-24.md` (670 l.)

## Signature en ligne (route /sign)

Le bouton **Envoyer signature** dans la barre d'actions génère un lien `/sign#<base64url>`. Toutes les données du contrat sont encodées dans le hash : aucun serveur ne voit le contenu.

1. Photographe rempli contrat sur `/`
2. Clique **Envoyer signature** → modal génère lien + QR + mailto pré-rempli
3. Client reçoit lien, ouvre sur téléphone
4. Voit le contrat en preview
5. Signe au doigt dans le canvas
6. Télécharge PDF signé OU régénère un lien signé pour renvoyer

Limite : signature manuscrite scannée = preuve simple (Art. 1366 Code civil). Pour enjeux importants → plateforme eIDAS qualifiée (Yousign, DocuSign, Universign).

## Disclaimer

Ce générateur produit des **modèles indicatifs** non substituables à un conseil juridique. Pour engagements à fort enjeu (cession exclusive longue durée, contrats > 5000 €), faire relire par un avocat spécialisé en propriété intellectuelle.

## Licence

MIT.
