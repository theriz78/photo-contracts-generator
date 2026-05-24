import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
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

const libertinusSerif = {
  variable: "--font-libertinus",
};

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
      <body className={`${bricolage.variable} ${figtree.variable}`} style={{ ['--font-libertinus' as never]: 'Libertinus Serif, Bacasime Antique, Georgia, serif' }}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
