import type { ReactNode } from "react";

export function Legal({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-5 pt-28 pb-24">
      <p className="border border-champagne/40 bg-panel px-4 py-3 text-sm text-champagne-2">
        Sample policy for this website preview. It is not legal advice and it has not been reviewed as a QORVEX
        customer contract. Replace it before any real sale.
      </p>
      <h1 className="mt-8 font-display text-5xl sm:text-6xl">{title}</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted">{children}</div>
    </article>
  );
}
