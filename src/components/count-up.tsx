"use client";

import { useEffect, useState } from "react";
import { DAY_TOTALS } from "@/lib/sample-day";

const FORMAT = {
  km: (t: number) => `${(DAY_TOTALS.km * t).toFixed(1)} km`,
  motion: (t: number) => {
    const minutes = Math.round(DAY_TOTALS.minutesInMotion * t);
    return `${Math.floor(minutes / 60)} h ${minutes % 60} m`;
  },
  places: (t: number) => String(Math.round(DAY_TOTALS.places * t)),
};

/** A total of the sample day that counts up after the hero routes start to draw. */
export function CountUp({ total }: { total: keyof typeof FORMAT }) {
  const [t, setT] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setT(1);
      return;
    }
    let frame = 0;
    const timer = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / 1600);
        // Ease out cubic.
        setT(1 - (1 - p) ** 3);
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, 900);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, []);

  return FORMAT[total](t);
}
