import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import type { Shot, View } from "@/lib/vehicles";

export function Gallery({ shots }: { shots: Shot[] }) {
  const [view, setView] = useState<View | "all">("all");
  const filtered = view === "all" ? shots : shots.filter((shot) => shot.view === view);
  const [index, setIndex] = useState(0);
  const safe = filtered[Math.min(index, filtered.length - 1)] ?? shots[0];

  useEffect(() => {
    setIndex(0);
  }, [view]);

  if (!safe) return null;

  function step(delta: number) {
    setIndex((current) => {
      const count = filtered.length || 1;
      return (current + delta + count) % count;
    });
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "exterior", "interior"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setView(item)}
            className={cn(
              "min-h-11 px-4 text-xs tracking-widest uppercase",
              view === item ? "bg-ivory text-obsidian" : "border border-line text-muted",
            )}
          >
            {item}
          </button>
        ))}
      </div>
      <div
        className="relative bg-ink"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Vehicle images"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
        }}
      >
        {safe.frame === "banner" ? (
          <img
            src={safe.src}
            alt={safe.alt}
            width={safe.width}
            height={safe.height}
            className="mx-auto block h-auto w-full max-w-4xl object-contain"
          />
        ) : (
          <img
            src={safe.src}
            alt={safe.alt}
            width={safe.width}
            height={safe.height}
            className="aspect-[3/2] w-full object-cover"
          />
        )}
        {filtered.length > 1 ? (
          <>
            <button
              type="button"
              className="absolute top-1/2 left-3 inline-flex size-11 -translate-y-1/2 items-center justify-center bg-obsidian/80"
              onClick={() => step(-1)}
              aria-label="Previous image"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              className="absolute top-1/2 right-3 inline-flex size-11 -translate-y-1/2 items-center justify-center bg-obsidian/80"
              onClick={() => step(1)}
              aria-label="Next image"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        ) : null}
      </div>
      <p className="mt-3 text-xs tracking-widest text-faint uppercase">
        {Math.min(index, filtered.length - 1) + 1} / {filtered.length} · {safe.view}
      </p>
      <ul className="mt-4 flex gap-3 overflow-x-auto pb-1">
        {filtered.map((shot, shotIndex) => (
          <li key={shot.src} className="shrink-0">
            <button
              type="button"
              onClick={() => setIndex(shotIndex)}
              className={cn(
                "block h-16 w-28 overflow-hidden border",
                shot.src === safe.src ? "border-champagne" : "border-line",
              )}
              aria-label={`Show image ${shotIndex + 1}`}
            >
              <img src={shot.src} alt="" className="h-full w-full object-cover" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
