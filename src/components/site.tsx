import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { vehicles } from "@/lib/vehicles";

export function Mark({ light = true }: { light?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-3", light ? "text-ivory" : "text-obsidian")}>
      <svg viewBox="0 0 48 48" className="size-8" aria-hidden="true">
        <circle cx="22" cy="24" r="11" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M28 31.5 L36 40" fill="none" stroke="currentColor" strokeWidth="1.7" />
      </svg>
      <span className="text-sm tracking-widest">QORVEX</span>
    </span>
  );
}

const links = [
  { to: "/collection", label: "Collection" },
  { to: "/about", label: "The House" },
  { to: "/enquiries", label: "Enquiries" },
  { to: "/reservations", label: "Reservations" },
] as const;

export function Header() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const solid = scrolled || pathname !== "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-200",
        solid || open ? "border-b border-line bg-obsidian/95" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
        <Link to="/" aria-label="QORVEX home" className="shrink-0">
          <Mark />
        </Link>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "text-xs tracking-widest uppercase",
                pathname === link.to ? "text-champagne-2" : "text-ivory/80 hover:text-ivory",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/collection" className={cn(buttonClass("solid"), "hidden sm:inline-flex")}>
            Reserve
          </Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>
      {open ? (
        <nav id="mobile-nav" className="border-t border-line bg-obsidian px-5 py-6 lg:hidden" aria-label="Mobile">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="flex min-h-11 items-center text-lg font-display">
                  {link.label}
                </Link>
              </li>
            ))}
            {vehicles.map((vehicle) => (
              <li key={vehicle.slug}>
                <Link
                  to="/vehicles/$slug"
                  params={{ slug: vehicle.slug }}
                  className="flex min-h-11 items-center text-muted"
                >
                  {vehicle.name}
                </Link>
              </li>
            ))}
            <li className="pt-3">
              <Link to="/collection" className={buttonClass("solid")}>
                Reserve a car
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Mark />
          <p className="mt-4 max-w-sm font-display text-3xl italic text-ivory">Born to Lead.</p>
          <p className="mt-3 text-xs tracking-widest text-champagne uppercase">Pure Engineering</p>
          <p className="mt-3 max-w-sm text-sm text-muted">
            Four automobiles. Electric grand tourer, electric grand SUV, six-wheel diesel, supercharged hypercar.
          </p>
        </div>
        <div>
          <p className="text-xs tracking-widest uppercase text-faint">Collection</p>
          <ul className="mt-4 space-y-2">
            {vehicles.map((vehicle) => (
              <li key={vehicle.slug}>
                <Link
                  to="/vehicles/$slug"
                  params={{ slug: vehicle.slug }}
                  className="text-sm text-ivory hover:text-champagne-2"
                >
                  {vehicle.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-widest uppercase text-faint">House</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-champagne-2">The House</Link></li>
            <li><Link to="/contact" className="hover:text-champagne-2">Contact</Link></li>
            <li><Link to="/enquiries" className="hover:text-champagne-2">Enquiries</Link></li>
            <li><Link to="/reservations" className="hover:text-champagne-2">Your reservations</Link></li>
            <li><Link to="/privacy" className="hover:text-champagne-2">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-champagne-2">Terms</Link></li>
            <li><Link to="/cancellation" className="hover:text-champagne-2">Cancellation</Link></li>
            <li><Link to="/refund" className="hover:text-champagne-2">Refunds</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line px-5 py-4 text-xs text-faint">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:justify-between">
          <p>Prices in USD are indicative estimates for this preview. Not an offer.</p>
          <p>Policies on this site are samples, not a reviewed contract.</p>
        </div>
      </div>
    </footer>
  );
}

export function buttonClass(variant: "solid" | "ghost" | "line" = "solid") {
  const base =
    "inline-flex min-h-11 items-center justify-center px-5 text-xs tracking-widest uppercase transition-transform duration-150 ease-out active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50";
  if (variant === "ghost") return cn(base, "border border-ivory/30 text-ivory hover:border-champagne hover:text-champagne-2");
  if (variant === "line") return cn(base, "border-b border-champagne px-0 text-champagne-2 hover:text-ivory");
  return cn(base, "bg-ivory text-obsidian hover:bg-champagne-2");
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="border border-line bg-panel px-4 py-3 text-sm leading-relaxed text-muted">{children}</p>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return <p className="text-xs tracking-widest uppercase text-champagne">{children}</p>;
}

export function Money({ value }: { value: number }) {
  return <span className="tabular-nums">{formatMoney(value)}</span>;
}

export function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="text-xs tracking-widest uppercase text-faint">{label}</span>
      <div className="mt-2">{children}</div>
      {error ? (
        <span id={`${id}-error`} className="mt-2 block text-sm text-champagne-2">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export const fieldClass =
  "w-full min-h-11 border border-line bg-ink px-3 text-sm text-ivory outline-none placeholder:text-faint focus:border-champagne";

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const [on, setOn] = useState(false);
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setOn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return (
    <div
      ref={setNode}
      className={cn(
        "reveal transition-[opacity,transform,filter] duration-700 ease-out",
        on ? "translate-y-0 opacity-100 blur-none" : "translate-y-3 opacity-0 blur-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
