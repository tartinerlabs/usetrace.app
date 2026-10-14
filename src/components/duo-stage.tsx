"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { onScrollFrame } from "@/components/chapter-rail";

/**
 * Unfolds the iPhone Duo as it scrolls into view. It sets --duo-open (eased,
 * 0 closed to 1 open) and --duo-fold (how folded, 0 to 1) for its children.
 */
export function DuoStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = ref.current;
    if (!stage) return;
    const apply = (open: number) => {
      const angle = Math.PI * (1 - open);
      stage.style.setProperty("--duo-open", open.toFixed(4));
      stage.style.setProperty("--duo-fold", Math.sin(angle).toFixed(4));
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(1);
      return;
    }
    return onScrollFrame(() => {
      const height = window.innerHeight;
      const top = stage.getBoundingClientRect().top;
      const t = Math.min(1, Math.max(0, (height * 0.5 - top) / (height * 0.4)));
      // Ease in-out cubic.
      apply(t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
    });
  }, []);

  return (
    <div
      ref={ref}
      className="w-full max-w-[1040px] self-center [--duo-fold:0] [--duo-open:0] [perspective:2600px]"
    >
      {children}
    </div>
  );
}
