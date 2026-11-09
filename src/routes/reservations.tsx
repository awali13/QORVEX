import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Kicker, Money } from "@/components/site";
import { formatDuration, holdRemaining } from "@/lib/format";
import { listReservations, reservationPhase, type Reservation } from "@/lib/reservations";

export const Route = createFileRoute("/reservations")({
  head: () => ({ meta: [{ title: "Reservations — QORVEX" }] }),
  component: ReservationsPage,
});

function ReservationsPage() {
  const [items, setItems] = useState<Reservation[] | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setItems(listReservations());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-5 pt-28 pb-24">
      <Kicker>This device</Kicker>
      <h1 className="mt-3 font-display text-5xl sm:text-6xl">Your reservations.</h1>
      <p className="mt-4 text-muted">
        Stored in this browser only. Clearing site data removes them. They are not an account and not a paid order.
      </p>
      {items === null ? <p className="mt-8 text-sm text-faint">Loading…</p> : null}
      {items && items.length === 0 ? (
        <p className="mt-10 text-muted">
          None yet.{" "}
          <Link to="/collection" className="text-champagne-2">
            Choose a car
          </Link>
          .
        </p>
      ) : null}
      <ul className="mt-10 space-y-6">
        {items?.map((item) => {
          const phase = reservationPhase(item, now);
          return (
            <li key={item.reference} className="border border-line p-5">
              <p className="text-xs tracking-widest text-faint uppercase">{item.reference}</p>
              <h2 className="mt-2 font-display text-4xl">{item.vehicleName}</h2>
              <p className="mt-2 text-sm text-muted">{item.configuration}</p>
              <p className="mt-3 text-sm">
                {phase === "holding"
                  ? `Hold · ${formatDuration(holdRemaining(item.createdAt, now))} left`
                  : phase === "open"
                    ? "Purchase stage open · demonstration checkout"
                    : "Demonstration recorded · no payment"}
              </p>
              <p className="mt-1 text-sm tabular-nums">
                <Money value={item.pricing.totalBeforeTax} /> before tax, indicative
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs tracking-widest uppercase">
                <Link to="/confirmation/$ref" params={{ ref: item.reference }} className="text-champagne-2">
                  Details
                </Link>
                {phase !== "holding" ? (
                  <Link to="/checkout/$ref" params={{ ref: item.reference }} className="text-champagne-2">
                    Checkout
                  </Link>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
