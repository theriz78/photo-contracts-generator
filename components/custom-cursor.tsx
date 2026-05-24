"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.documentElement.classList.add("cp-cursor-active");

    let targetX = 0;
    let targetY = 0;
    const dotXTo = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
    const dotYTo = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });
    const ringXTo = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const ringYTo = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      dotXTo(targetX);
      dotYTo(targetY);
      ringXTo(targetX);
      ringYTo(targetY);
    };

    const onEnter = () => {
      ring.classList.add("cp-cursor-hover");
    };
    const onLeave = () => {
      ring.classList.remove("cp-cursor-hover");
    };

    window.addEventListener("pointermove", onMove);

    const attach = () => {
      const interactive = document.querySelectorAll<HTMLElement>(
        "a, button, input, textarea, select, [data-cursor='hover'], summary, label",
      );
      interactive.forEach((el) => {
        el.addEventListener("pointerenter", onEnter);
        el.addEventListener("pointerleave", onLeave);
      });
      return interactive;
    };

    let attached = attach();
    const observer = new MutationObserver(() => {
      attached.forEach((el) => {
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointerleave", onLeave);
      });
      attached = attach();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.documentElement.classList.remove("cp-cursor-active");
      window.removeEventListener("pointermove", onMove);
      attached.forEach((el) => {
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointerleave", onLeave);
      });
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cp-cursor-dot" aria-hidden />
      <div ref={ringRef} className="cp-cursor-ring" aria-hidden />
    </>
  );
}
