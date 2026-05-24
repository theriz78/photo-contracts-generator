import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree, Fraunces, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "./providers";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const jbmono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Contrats Photo",
  description: "",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true, "max-video-preview": -1, "max-image-preview": "none", "max-snippet": -1 },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${bricolage.variable} ${figtree.variable} ${fraunces.variable} ${jbmono.variable}`}
        style={{ ['--font-libertinus' as never]: 'Libertinus Serif, Bacasime Antique, Georgia, serif' }}
      >
        <svg style={{ position: "fixed", width: 0, height: 0, pointerEvents: "none" }} aria-hidden>
          <filter id="cp-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" />
          </filter>
        </svg>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
