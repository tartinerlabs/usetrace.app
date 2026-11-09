"use client";

import { type CSSProperties, useState } from "react";
import { GET_NOTE, GET_URL, PERKS, PLANS, PLUS } from "@/lib/pricing";

const CONTOURS = [1, 1.35, 1.7, 2.05, 2.4, 2.75, 3.1, 3.45, 3.8];

// Map contours with one route across them, as a journal draws a day.
function RouteArt() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 520"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
      fill="none"
    >
      <g
        stroke="var(--on-sun)"
        strokeOpacity="0.16"
        vectorEffect="non-scaling-stroke"
      >
        {CONTOURS.map((scale) => (
          <path
            key={scale}
            transform={`translate(300 95) scale(${scale})`}
            vectorEffect="non-scaling-stroke"
            d="M-62 -18C-58 -52 -18 -66 16 -58C52 -50 74 -22 66 12C58 46 22 62 -14 56C-46 50 -66 16 -62 -18Z"
          />
        ))}
      </g>
      <path
        d="M-10 205C60 160 95 220 160 180C225 140 225 85 285 120C325 143 345 90 352 55"
        pathLength="1"
        stroke="var(--peach)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="1"
        className="route-draw"
        style={
          {
            "--draw-delay": "0.2s",
            "--draw-duration": "1.6s",
          } as CSSProperties
        }
      />
      <circle
        cx="352"
        cy="55"
        r="9"
        fill="var(--sun)"
        stroke="var(--peach)"
        strokeWidth="4"
      />
    </svg>
  );
}

export function PricingPlans() {
  const [selected, setSelected] = useState(PLANS[0].name);
  const plan = PLANS.find((item) => item.name === selected) ?? PLANS[0];

  return (
    <div className="grid overflow-hidden rounded-card border border-line bg-surface md:grid-cols-5">
      {/* The price, on the route. */}
      <div className="relative isolate flex min-h-96 flex-col justify-between gap-16 overflow-hidden bg-sun p-7 text-on-sun md:col-span-2">
        <RouteArt />
        <p className="relative font-extrabold text-4xl uppercase tracking-tight">
          Plus
        </p>
        <div className="relative" aria-live="polite">
          <p className="font-extrabold text-[clamp(40px,4.4vw,54px)] leading-none tracking-tight">
            {plan.price}
          </p>
          <p className="mt-2 font-semibold text-lg">{plan.period}</p>
          <p className="mt-1 min-h-10 max-w-64 text-sm">{plan.note}</p>
          <a
            href={GET_URL}
            data-ph-capture-attribute-cta="app-store"
            className="mt-5 inline-flex min-h-12 w-full items-center justify-between gap-3 rounded-full bg-peach px-6 font-semibold text-night motion-safe:transition-opacity hover:opacity-85"
          >
            Get {PLUS}
            <span aria-hidden="true" className="icon text-xl">
              arrow_forward
            </span>
          </a>
          <p className="mt-3 text-center text-xs">{GET_NOTE}</p>
        </div>
      </div>

      {/* The plans and what they give. */}
      <div className="flex flex-col gap-8 p-7 md:col-span-3 md:p-9">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <fieldset className="flex rounded-full bg-night p-1">
            <legend className="sr-only">Plan</legend>
            {PLANS.map((item) => (
              <button
                key={item.name}
                type="button"
                aria-pressed={item.name === selected}
                onClick={() => setSelected(item.name)}
                className={`min-h-10 rounded-full px-4 font-semibold text-sm motion-safe:transition-colors ${
                  item.name === selected
                    ? "bg-accent text-on-accent"
                    : "text-secondary hover:text-ink"
                }`}
              >
                {item.name}
              </button>
            ))}
          </fieldset>
          {plan.badge && (
            <p className="rounded-full bg-line px-3 py-1.5 font-semibold text-ink text-sm">
              {plan.badge}
            </p>
          )}
        </div>

        <ul className="flex flex-col gap-4">
          {PERKS.map((perk) => (
            <li key={perk.title} className="flex gap-3 text-lg leading-snug">
              <span aria-hidden="true" className="icon text-peach text-2xl">
                check_circle
              </span>
              <span>
                <span className="font-semibold">{perk.title}</span>{" "}
                <span className="text-secondary">{perk.text}</span>
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-auto text-secondary text-sm">
          All plans unlock the same features. Subscriptions renew automatically
          until you cancel. Prices are for the United States.
        </p>
      </div>
    </div>
  );
}
