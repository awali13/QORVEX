import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type FormEvent } from "react";
import { buttonClass, Field, fieldClass, Note } from "@/components/site";
import { formatWhen } from "@/lib/format";
import { notifyDesk } from "@/lib/notify";
import { listEnquiries, saveEnquiry, type Enquiry, type WhatsAppState } from "@/lib/reservations";
import { digits } from "@/lib/validate";
import { vehicles } from "@/lib/vehicles";

const topics = ["Model question", "Reservation", "Ownership", "Press", "Other"];

export function EnquiryDesk({ heading, lede }: { heading: string; lede: string }) {
  const send = useServerFn(notifyDesk);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState(topics[0] ?? "Model question");
  const [vehicle, setVehicle] = useState("General");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [items, setItems] = useState<Enquiry[]>([]);
  const [banner, setBanner] = useState("");

  useEffect(() => {
    setItems(listEnquiries());
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Enter a valid email.";
    if (digits(phone).length < 7) next.phone = "Enter a phone number with at least 7 digits.";
    if (message.trim().length < 8) next.message = "Write a short message, at least a sentence.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setPending(true);
    let whatsapp: WhatsAppState = "failed";
    let whatsappDetail = "The notification service did not respond.";
    let createdAt = Date.now();
    try {
      const result = await send({
        data: {
          kind: "enquiry",
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          topic,
          vehicle: vehicle === "General" ? "" : vehicle,
          message: message.trim(),
        },
      });
      createdAt = result.acceptedAt;
      whatsapp = result.state;
      whatsappDetail = result.detail;
    } catch {
      whatsapp = "failed";
    }
    const enquiry: Enquiry = {
      id: `ENQ-${createdAt.toString(36).toUpperCase()}`,
      createdAt,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      topic,
      vehicle,
      message: message.trim(),
      whatsapp,
      whatsappDetail,
    };
    saveEnquiry(enquiry);
    setItems(listEnquiries());
    setMessage("");
    setBanner(
      whatsapp === "sent"
        ? "Enquiry saved on this device. WhatsApp accepted the notification."
        : `Enquiry saved on this device. ${whatsappDetail}`,
    );
    setPending(false);
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-5 pt-28 pb-24 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <p className="text-xs tracking-widest text-champagne uppercase">Desk</p>
        <h1 className="mt-3 font-display text-5xl sm:text-6xl">{heading}</h1>
        <p className="mt-4 text-muted">{lede}</p>
        <div className="mt-6">
          <Note>
            Sample desk for this preview: enquiries@qorvex.example. Messages stay in this browser. A WhatsApp Business
            notification is attempted only when server credentials are set. No payment is discussed or taken here.
          </Note>
        </div>
        {items.length ? (
          <ul className="mt-8 space-y-4">
            {items.map((item) => (
              <li key={item.id} className="border-t border-line pt-4 text-sm">
                <p className="text-xs tracking-widest text-faint uppercase">
                  {item.topic} · {formatWhen(item.createdAt)}
                </p>
                <p className="mt-2">{item.message}</p>
                <p className="mt-1 text-muted">
                  {item.vehicle} · WhatsApp {item.whatsapp.replaceAll("_", " ")}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 text-sm text-faint">No enquiries stored on this device yet.</p>
        )}
      </div>
      <form className="space-y-5 lg:col-span-7" onSubmit={onSubmit} noValidate>
        {banner ? <Note>{banner}</Note> : null}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="name" label="Name" error={errors.name}>
            <input id="name" className={fieldClass} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field id="email" label="Email" error={errors.email}>
            <input id="email" type="email" className={fieldClass} autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </Field>
          <Field id="phone" label="Phone" error={errors.phone}>
            <input id="phone" type="tel" className={fieldClass} autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
          </Field>
          <Field id="topic" label="Topic">
            <select id="topic" className={fieldClass} value={topic} onChange={(event) => setTopic(event.target.value)}>
              {topics.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Field id="vehicle" label="Vehicle">
              <select id="vehicle" className={fieldClass} value={vehicle} onChange={(event) => setVehicle(event.target.value)}>
                <option>General</option>
                {vehicles.map((item) => (
                  <option key={item.slug}>{item.name}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field id="message" label="Message" error={errors.message}>
              <textarea id="message" rows={6} className={fieldClass} value={message} onChange={(event) => setMessage(event.target.value)} />
            </Field>
          </div>
        </div>
        <button type="submit" className={buttonClass("solid")} disabled={pending}>
          {pending ? "Sending…" : "Send enquiry"}
        </button>
      </form>
    </div>
  );
}
