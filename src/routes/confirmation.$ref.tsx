import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { buttonClass, Kicker, Money, Note } from "@/components/site";
import { formatDuration, formatWhen, holdRemaining } from "@/lib/format";
import { notifyDesk } from "@/lib/notify";
import { getReservation, removeReservation, reservationPhase, type Reservation } from "@/lib/reservations";

export const Route = createFileRoute("/confirmation/$ref")({
  head: () => ({ meta: [{ title: "Reservation — QORVEX" }] }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { ref } = Route.useParams();
  const navigate = useNavigate();
  const send = useServerFn(notifyDesk);
  const [reservation, setReservation] = useState<Reservation | null | undefined>(undefined);
  const [now, setNow] = useState(() => Date.now());
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    setReservation(getReservation(ref) ?? null);
  }, [ref]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (reservation === undefined) {
    return <p className="px-5 pt-32 text-muted">Opening the reservation…</p>;
  }
  if (!reservation) {
    return (
      <div className="mx-auto max-w-3xl px-5 pt-32 pb-24">
        <h1 className="font-display text-5xl">No reservation under that reference on this device.</h1>
        <p className="mt-4 text-muted">Reservations are stored in this browser, not in a shared account.</p>
        <Link to="/reservations" className="mt-6 inline-flex min-h-11 items-center text-xs tracking-widest text-champagne uppercase">
          Your reservations
        </Link>
      </div>
    );
  }

  const current = reservation;
  const phase = reservationPhase(current, now);
  const remaining = holdRemaining(current.createdAt, now);
  const opens = current.createdAt + 24 * 60 * 60 * 1000;

  async function cancel() {
    setCancelling(true);
    try {
      await send({
        data: {
          kind: "cancel",
          reference: current.reference,
          vehicleName: current.vehicleName,
          customerName: current.customer.fullName,
        },
      });
    } catch {
      // Local cancellation still proceeds. WhatsApp is best-effort.
    }
    removeReservation(current.reference);
    void navigate({ to: "/reservations" });
  }

  return (
    <div className="mx-auto max-w-3xl px-5 pt-28 pb-24">
      <Kicker>Reservation {reservation.reference}</Kicker>
      <h1 className="mt-3 font-display text-5xl sm:text-6xl">
        {phase === "holding" ? "The car is held." : phase === "open" ? "The purchase stage is open." : "Demonstration recorded."}
      </h1>
      <p className="mt-4 text-muted">
        {phase === "holding"
          ? "A 24-hour waiting period is in force. Checkout stays closed until it ends. No payment has been taken."
          : phase === "open"
            ? "The hold has ended. You may open the demonstration checkout. It still does not take payment or place a factory order."
            : "A demonstration checkout was recorded on this device. No card was charged and no payment was received."}
      </p>

      <div className="mt-8 border border-line p-5">
        <p className="text-xs tracking-widest text-faint uppercase">Status</p>
        <p className="mt-2 font-display text-4xl">
          {phase === "holding" ? formatDuration(remaining) : phase === "open" ? "Ready" : "Demonstration only"}
        </p>
        <p className="mt-2 text-sm text-muted">
          {phase === "holding"
            ? `Purchase stage opens ${formatWhen(opens)}.`
            : phase === "open"
              ? `The hold ended ${formatWhen(opens)}.`
              : `Recorded ${formatWhen(reservation.demoRecordedAt ?? now)}.`}
        </p>
      </div>

      <section className="mt-8 space-y-3 text-sm">
        <h2 className="font-display text-3xl">What you reserved</h2>
        <p>{reservation.vehicleName}</p>
        <p className="text-muted">{reservation.configuration}</p>
        <p>
          {reservation.customer.fullName} · {reservation.customer.email} · {reservation.customer.phone}
        </p>
        <p className="text-muted">
          {reservation.customer.address}, {reservation.customer.city}, {reservation.customer.country}
        </p>
        <ul className="space-y-1">
          <li className="flex justify-between"><span>Vehicle estimate</span><Money value={reservation.pricing.base} /></li>
          <li className="flex justify-between"><span>Sample options</span><Money value={reservation.pricing.options} /></li>
          <li className="flex justify-between"><span>Delivery estimate</span><Money value={reservation.pricing.delivery} /></li>
          <li className="flex justify-between"><span>Registration estimate</span><Money value={reservation.pricing.registration} /></li>
          <li className="flex justify-between"><span>Documentation estimate</span><Money value={reservation.pricing.documentation} /></li>
          <li className="flex justify-between border-t border-line pt-2"><span>Before local tax</span><Money value={reservation.pricing.totalBeforeTax} /></li>
        </ul>
        <p className="text-faint">Local tax is not included. None of these amounts is a confirmed charge.</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-3xl">What happens next</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-muted">
          <li>The reservation is saved in this browser under {reservation.reference}.</li>
          <li>For 24 hours from {formatWhen(reservation.createdAt)} the purchase stage stays closed.</li>
          <li>When the timer ends, demonstration checkout opens. It asks you to confirm details again and records a demonstration. It does not process a card.</li>
          <li>A real purchase would wait for a written confirmation from QORVEX after that hold. This preview cannot issue one.</li>
        </ol>
      </section>

      <div className="mt-8">
        <Note>
          WhatsApp: {whatsAppCopy(reservation.whatsappBooking)} {reservation.whatsappDetail}
        </Note>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {phase === "open" ? (
          <Link to="/checkout/$ref" params={{ ref: reservation.reference }} className={buttonClass("solid")}>
            Open demonstration checkout
          </Link>
        ) : null}
        {phase === "demonstration" ? (
          <Link to="/checkout/$ref" params={{ ref: reservation.reference }} className={buttonClass("ghost")}>
            View demonstration record
          </Link>
        ) : null}
        {phase === "holding" ? (
          <button type="button" className={buttonClass("ghost")} onClick={() => void cancel()} disabled={cancelling}>
            {cancelling ? "Cancelling…" : "Cancel this hold"}
          </button>
        ) : (
          <button
            type="button"
            className={buttonClass("ghost")}
            onClick={() => {
              removeReservation(reservation.reference);
              void navigate({ to: "/reservations" });
            }}
          >
            Remove from this device
          </button>
        )}
        <Link to="/reservations" className={buttonClass("ghost")}>
          All reservations
        </Link>
      </div>
    </div>
  );
}

function whatsAppCopy(state: Reservation["whatsappBooking"]) {
  if (state === "sent") return "Messages were accepted by the WhatsApp Business API.";
  if (state === "partial") return "Only some WhatsApp messages were accepted.";
  if (state === "not_configured") return "Not sent.";
  if (state === "rate_limited") return "Not sent — the desk is rate limited.";
  return "Not sent — the API call failed.";
}
