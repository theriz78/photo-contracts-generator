"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/providers";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Activer le thème clair" : "Activer le thème sombre"}
      className="btn btn-ghost btn-icon"
    >
      <span
        key={theme}
        style={{
          display: "inline-flex",
          animation: "cp-spin-in 280ms cubic-bezier(.2,.7,.2,1)",
        }}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </span>
    </button>
  );
}
