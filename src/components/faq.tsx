import type { ReactNode } from "react";

export type FaqItem = { question: string; answer: ReactNode };

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium sm:px-6 [&::-webkit-details-marker]:hidden">
            {item.question}
            <span
              aria-hidden="true"
              className="text-secondary motion-safe:transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="space-y-3 px-5 pb-5 text-secondary leading-relaxed sm:px-6">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
