"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { onScrollFrame } from "@/components/chapter-rail";

/**
 * Holds the iPhone Duo in the middle of the window and unfolds it as the page
 * scrolls. It sets --duo-open (eased, 0 closed to 1 open) and --duo-fold (how
 * folded, 0 to 1) for its children.
 */
export function DuoStage({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = ref.current;
    if (!track || !stage) return;
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
      // The phone sticks at the middle of the window, and the extra height of
      // the track is the scroll that opens it.
      const top = Math.round((window.innerHeight - stage.offsetHeight) / 2);
      stage.style.top = `${top}px`;
      const distance = track.offsetHeight - stage.offsetHeight;
      const t = Math.min(
        1,
        Math.max(0, (top - track.getBoundingClientRect().top) / distance),
      );
      // Ease in-out cubic.
      apply(t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
    });
  }, []);

  return (
    <div ref={trackRef} className="w-full max-w-[1040px] self-center">
      <div
        ref={ref}
        className="sticky [--duo-fold:0] [--duo-open:0] [perspective:2600px]"
      >
        {children}
      </div>
      {/* Sticky stops at the track's content box, so the scroll room is a block, not padding. */}
      <div aria-hidden="true" className="motion-safe:h-[60vh]" />
    </div>
  );
}
