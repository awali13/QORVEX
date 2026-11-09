import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { buttonClass, Field, fieldClass, Kicker, Money, Note } from "@/components/site";
import { notifyDesk } from "@/lib/notify";
import { quoteVehicle, readConfig, configurationLine } from "@/lib/pricing";
import { makeReference, saveReservation, type Customer, type WhatsAppState } from "@/lib/reservations";
import { emptyCustomer, validateCustomer, type FieldErrors } from "@/lib/validate";
import { getVehicle, type Vehicle } from "@/lib/vehicles";

export const Route = createFileRoute("/reserve/$slug")({
  loader: ({ params }) => {
    if (!getVehicle(params.slug)) throw notFound();
    return { slug: params.slug };
  },
  head: () => ({ meta: [{ title: "Reserve — QORVEX" }] }),
  component: ReservePage,
});

function ReservePage() {
  const { slug } = Route.useParams();
  const vehicle = getVehicle(slug);
  if (!vehicle) return null;
  return <ReserveForm vehicle={vehicle} />;
}

function ReserveForm({ vehicle }: { vehicle: Vehicle }) {
  const navigate = useNavigate();
  const send = useServerFn(notifyDesk);
  const [customer, setCustomer] = useState<Customer>(emptyCustomer);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [configReady, setConfigReady] = useState(false);
  const [config, setConfig] = useState(() => ({
    exteriorId: vehicle.exteriors[0]?.id ?? "",
    interiorId: vehicle.interiors[0]?.id ?? "",
    packageIds: [] as string[],
  }));

  useEffect(() => {
    setConfig(readConfig(vehicle));
    setConfigReady(true);
  }, [vehicle]);

  const quote = useMemo(() => quoteVehicle(vehicle, config), [vehicle, config]);
  const line = configurationLine(quote);
  const shot = vehicle.shots[0];

  function set<K extends keyof Customer>(key: K, value: string) {
    setCustomer((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validateCustomer(customer, consent);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setPending(true);
    const reference = makeReference();
    let acceptedAt = Date.now();
    let whatsappBooking: WhatsAppState = "failed";
    let whatsappDetail = "The notification service did not respond.";
    try {
      const result = await send({
        data: {
          kind: "reservation",
          reference,
          vehicleName: vehicle.name,
          configuration: line,
          totalBeforeTax: quote.totalBeforeTax,
          customer: {
            fullName: customer.fullName.trim(),
            email: customer.email.trim(),
            phone: customer.phone.trim(),
            country: customer.country.trim(),
            city: customer.city.trim(),
            address: customer.address.trim(),
          },
        },
      });
      acceptedAt = result.acceptedAt;
      whatsappBooking = result.state;
      whatsappDetail = result.detail;
    } catch {
      whatsappBooking = "failed";
      whatsappDetail = "The notification service did not respond. The reservation is still saved on this device.";
    }
    saveReservation({
      reference,
      createdAt: acceptedAt,
      vehicleSlug: vehicle.slug,
      vehicleName: vehicle.name,
      configuration: line,
      exteriorName: quote.exterior.name,
      interiorName: quote.interior.name,
      packageNames: quote.packages.map((item) => item.name),
      pricing: {
        base: quote.base,
        options: quote.options,
        delivery: quote.delivery,
        registration: quote.registration,
        documentation: quote.documentation,
        totalBeforeTax: quote.totalBeforeTax,
      },
      customer: {
        fullName: customer.fullName.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim(),
        country: customer.country.trim(),
        city: customer.city.trim(),
        address: customer.address.trim(),
      },
      whatsappBooking,
      whatsappDetail,
    });
    setPending(false);
    void navigate({ to: "/confirmation/$ref", params: { ref: reference } });
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-5 pt-28 pb-24 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <Kicker>Reservation</Kicker>
        <h1 className="mt-3 font-display text-5xl">Review, then hold.</h1>
        <p className="mt-4 text-muted">
          Submitting starts a 24-hour waiting period. The purchase stage stays closed until that hold ends. Nothing is charged.
        </p>
        {!configReady ? <p className="mt-6 text-sm text-faint">Reading your configuration…</p> : null}
        <div className="mt-6 bg-ink">
          {shot ? (
            <img
              src={shot.src}
              alt={shot.alt}
              className={shot.frame === "banner" ? "mx-auto block h-auto w-full max-w-4xl object-contain" : "aspect-[3/2] w-full object-cover"}
            />
          ) : null}
        </div>
        <div className="mt-4 border border-line p-5">
          <p className="text-xs tracking-widest text-faint uppercase">{vehicle.name}</p>
          <p className="mt-2">{line}</p>
          <ul className="mt-4 space-y-2 text-sm">
            <Row label="Vehicle estimate" value={quote.base} />
            <Row label="Sample options" value={quote.options} />
            <Row label="Delivery estimate" value={quote.delivery} />
            <Row label="Registration estimate" value={quote.registration} />
            <Row label="Documentation estimate" value={quote.documentation} />
            <li className="flex justify-between gap-4 border-t border-line pt-2 text-base">
              <span>Before local tax</span>
              <Money value={quote.totalBeforeTax} />
            </li>
          </ul>
          <p className="mt-3 text-sm text-faint">Tax is not included and is not estimated. Not an invoice.</p>
          <Link to="/configure/$slug" params={{ slug: vehicle.slug }} className="mt-4 inline-flex min-h-11 items-center text-xs tracking-widest text-champagne uppercase">
            Edit configuration
          </Link>
        </div>
      </div>

      <form className="space-y-5 lg:col-span-7" onSubmit={onSubmit} noValidate>
        <Note>
          Sample choices and sample fees travel with this reservation. A live QORVEX desk would confirm them before any
          purchase. WhatsApp alerts are sent only when the Business Platform credentials are configured on the server.
        </Note>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="fullName" label="Full name" error={errors.fullName}>
            <input id="fullName" autoComplete="name" className={fieldClass} value={customer.fullName} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "fullName-error" : undefined} onChange={(event) => set("fullName", event.target.value)} />
          </Field>
          <Field id="email" label="Email" error={errors.email}>
            <input id="email" type="email" autoComplete="email" className={fieldClass} value={customer.email} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} onChange={(event) => set("email", event.target.value)} />
          </Field>
          <Field id="phone" label="Phone" error={errors.phone}>
            <input id="phone" type="tel" autoComplete="tel" className={fieldClass} value={customer.phone} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} onChange={(event) => set("phone", event.target.value)} />
          </Field>
          <Field id="country" label="Country" error={errors.country}>
            <input id="country" autoComplete="country-name" className={fieldClass} value={customer.country} aria-invalid={Boolean(errors.country)} aria-describedby={errors.country ? "country-error" : undefined} onChange={(event) => set("country", event.target.value)} />
          </Field>
          <Field id="city" label="City" error={errors.city}>
            <input id="city" autoComplete="address-level2" className={fieldClass} value={customer.city} aria-invalid={Boolean(errors.city)} aria-describedby={errors.city ? "city-error" : undefined} onChange={(event) => set("city", event.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <Field id="address" label="Delivery address" error={errors.address}>
              <textarea id="address" autoComplete="street-address" rows={3} className={fieldClass} value={customer.address} aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? "address-error" : undefined} onChange={(event) => set("address", event.target.value)} />
            </Field>
          </div>
        </div>
        <label className="flex gap-3 text-sm text-muted">
          <input type="checkbox" className="mt-1 size-4 accent-champagne" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
          <span>
            I understand this starts a 24-hour hold, that prices and fees shown are estimates, and that this website
            does not take payment.
          </span>
        </label>
        {errors.consent ? <p className="text-sm text-champagne-2">{errors.consent}</p> : null}
        <button type="submit" className={buttonClass("solid")} disabled={pending}>
          {pending ? "Holding the car…" : "Submit reservation"}
        </button>
      </form>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <li className="flex justify-between gap-4">
      <span className="text-muted">{label}</span>
      <Money value={value} />
    </li>
  );
}
