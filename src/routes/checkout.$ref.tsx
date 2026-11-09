import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type FormEvent } from "react";
import { buttonClass, Field, fieldClass, Kicker, Money, Note } from "@/components/site";
import { formatDuration, formatWhen, holdRemaining } from "@/lib/format";
import { notifyDesk } from "@/lib/notify";
import {
  getReservation,
  reservationPhase,
  saveReservation,
  type Customer,
  type Reservation,
} from "@/lib/reservations";
import { validateCustomer, type FieldErrors } from "@/lib/validate";

const purchasePings = new Set<string>();

export const Route = createFileRoute("/checkout/$ref")({
  head: () => ({ meta: [{ title: "Demonstration checkout — QORVEX" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { ref } = Route.useParams();
  const send = useServerFn(notifyDesk);
  const [reservation, setReservation] = useState<Reservation | null | undefined>(undefined);
  const [now, setNow] = useState(() => Date.now());
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const found = getReservation(ref) ?? null;
    setReservation(found);
    setCustomer(found?.customer ?? null);
  }, [ref]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!reservation || reservation.purchaseNotified) return;
    if (reservationPhase(reservation, Date.now()) !== "open") return;
    if (purchasePings.has(reservation.reference)) return;
    purchasePings.add(reservation.reference);
    const current = reservation;
    void (async () => {
      try {
        const result = await send({
          data: {
            kind: "purchase",
            phase: "opened",
            reference: current.reference,
            vehicleName: current.vehicleName,
            totalBeforeTax: current.pricing.totalBeforeTax,
            customerName: current.customer.fullName,
          },
        });
        const next = { ...current, purchaseNotified: true, whatsappDetail: result.detail };
        saveReservation(next);
        setReservation(next);
      } catch {
        purchasePings.delete(current.reference);
        setNotice("Purchase-stage WhatsApp update did not send.");
      }
    })();
  }, [reservation, send]);

  if (reservation === undefined || (reservation && !customer)) {
    return <p className="px-5 pt-32 text-muted">Opening checkout…</p>;
  }
  if (!reservation || !customer) {
    return (
      <div className="mx-auto max-w-3xl px-5 pt-32 pb-24">
        <h1 className="font-display text-5xl">Checkout needs a reservation on this device.</h1>
        <Link to="/collection" className="mt-6 inline-flex min-h-11 items-center text-champagne uppercase text-xs tracking-widest">
          Collection
        </Link>
      </div>
    );
  }

  const phase = reservationPhase(reservation, now);

  if (phase === "holding") {
    return (
      <div className="mx-auto max-w-3xl px-5 pt-28 pb-24">
        <Kicker>Purchase stage closed</Kicker>
        <h1 className="mt-3 font-display text-5xl">The 24-hour hold is still running.</h1>
        <p className="mt-4 font-display text-4xl tabular-nums">{formatDuration(holdRemaining(reservation.createdAt, now))}</p>
        <p className="mt-4 text-muted">
          Checkout opens {formatWhen(reservation.createdAt + 24 * 60 * 60 * 1000)}. The wait is part of the reservation,
          not a loading error.
        </p>
        <Link to="/confirmation/$ref" params={{ ref: reservation.reference }} className={`${buttonClass("solid")} mt-8`}>
          Back to the reservation
        </Link>
      </div>
    );
  }

  function set<K extends keyof Customer>(key: K, value: string) {
    setCustomer((current) => (current ? { ...current, [key]: value } : current));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!customer || !reservation) return;
    const nextErrors = validateCustomer(customer, consent);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length || reservation.demoRecordedAt) return;
    setPending(true);
    let detail = "Demonstration saved on this device. WhatsApp update did not send.";
    try {
      const result = await send({
        data: {
          kind: "purchase",
          phase: "demo_recorded",
          reference: reservation.reference,
          vehicleName: reservation.vehicleName,
          totalBeforeTax: reservation.pricing.totalBeforeTax,
          customerName: customer.fullName.trim(),
        },
      });
      detail = result.detail;
    } catch {
      detail = "Demonstration saved on this device. WhatsApp update did not send.";
    }
    const next: Reservation = {
      ...reservation,
      customer: {
        fullName: customer.fullName.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim(),
        country: customer.country.trim(),
        city: customer.city.trim(),
        address: customer.address.trim(),
      },
      demoRecordedAt: Date.now(),
      purchaseNotified: true,
      whatsappDetail: detail,
    };
    saveReservation(next);
    setReservation(next);
    setPending(false);
    setNotice("Demonstration recorded. No payment was received.");
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-5 pt-28 pb-24 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <Kicker>Demonstration checkout</Kicker>
        <h1 className="mt-3 font-display text-5xl">No payment is taken here.</h1>
        <p className="mt-4 text-muted">
          This screen records that you reviewed the reservation after the hold. It is not a payment processor, a card
          form, or a factory order.
        </p>
        <Note>
          Card numbers are not requested and must not be typed into any field. If a message claims a payment was
          received, it is wrong — this preview cannot receive one.
        </Note>
        <div className="mt-6 border border-line p-5 text-sm">
          <p className="text-xs tracking-widest text-faint uppercase">{reservation.reference}</p>
          <p className="mt-2 text-base">{reservation.vehicleName}</p>
          <p className="mt-1 text-muted">{reservation.configuration}</p>
          <ul className="mt-4 space-y-2">
            <Line label="Vehicle estimate" value={reservation.pricing.base} />
            <Line label="Sample options" value={reservation.pricing.options} />
            <Line label="Delivery estimate" value={reservation.pricing.delivery} />
            <Line label="Registration estimate" value={reservation.pricing.registration} />
            <Line label="Documentation estimate" value={reservation.pricing.documentation} />
            <li className="flex justify-between border-t border-line pt-2">
              <span>Before local tax</span>
              <Money value={reservation.pricing.totalBeforeTax} />
            </li>
          </ul>
          <p className="mt-3 text-faint">
            Delivery, registration and documentation lines are sample estimates. Tax is excluded until a jurisdiction
            is confirmed by QORVEX. None of this is an official fee schedule.
          </p>
        </div>
      </div>

      <form className="space-y-5 lg:col-span-7" onSubmit={onSubmit} noValidate>
        {reservation.demoRecordedAt ? (
          <Note>
            Already recorded {formatWhen(reservation.demoRecordedAt)}. {notice || reservation.whatsappDetail} No payment
            was received.
          </Note>
        ) : null}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="fullName" label="Full name" error={errors.fullName}>
            <input id="fullName" className={fieldClass} autoComplete="name" value={customer.fullName} onChange={(event) => set("fullName", event.target.value)} />
          </Field>
          <Field id="email" label="Email" error={errors.email}>
            <input id="email" type="email" className={fieldClass} autoComplete="email" value={customer.email} onChange={(event) => set("email", event.target.value)} />
          </Field>
          <Field id="phone" label="Phone" error={errors.phone}>
            <input id="phone" type="tel" className={fieldClass} autoComplete="tel" value={customer.phone} onChange={(event) => set("phone", event.target.value)} />
          </Field>
          <Field id="country" label="Country" error={errors.country}>
            <input id="country" className={fieldClass} autoComplete="country-name" value={customer.country} onChange={(event) => set("country", event.target.value)} />
          </Field>
          <Field id="city" label="City" error={errors.city}>
            <input id="city" className={fieldClass} autoComplete="address-level2" value={customer.city} onChange={(event) => set("city", event.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <Field id="address" label="Delivery address" error={errors.address}>
              <textarea id="address" rows={3} className={fieldClass} autoComplete="street-address" value={customer.address} onChange={(event) => set("address", event.target.value)} />
            </Field>
          </div>
        </div>
        <label className="flex gap-3 text-sm text-muted">
          <input type="checkbox" className="mt-1 size-4 accent-champagne" checked={consent} disabled={Boolean(reservation.demoRecordedAt)} onChange={(event) => setConsent(event.target.checked)} />
          <span>I understand this demonstration checkout does not take payment and does not confirm a purchase.</span>
        </label>
        {errors.consent ? <p className="text-sm text-champagne-2">{errors.consent}</p> : null}
        {notice ? <p className="text-sm text-champagne-2">{notice}</p> : null}
        <button type="submit" className={buttonClass("solid")} disabled={pending || Boolean(reservation.demoRecordedAt)}>
          {reservation.demoRecordedAt ? "Demonstration already recorded" : pending ? "Recording…" : "Record demonstration"}
        </button>
        <div>
          <Link to="/confirmation/$ref" params={{ ref: reservation.reference }} className="text-xs tracking-widest text-muted uppercase">
            Return to reservation
          </Link>
        </div>
      </form>
    </div>
  );
}

function Line({ label, value }: { label: string; value: number }) {
  return (
    <li className="flex justify-between gap-4">
      <span className="text-muted">{label}</span>
      <Money value={value} />
    </li>
  );
}
