import type { Quote } from "@/lib/pricing";

export type Customer = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
};

export type WhatsAppState = "sent" | "not_configured" | "failed" | "partial" | "rate_limited";

export type Reservation = {
  reference: string;
  createdAt: number;
  vehicleSlug: string;
  vehicleName: string;
  configuration: string;
  exteriorName: string;
  interiorName: string;
  packageNames: string[];
  pricing: Pick<
    Quote,
    "base" | "options" | "delivery" | "registration" | "documentation" | "totalBeforeTax"
  >;
  customer: Customer;
  demoRecordedAt?: number;
  purchaseNotified?: boolean;
  whatsappBooking: WhatsAppState;
  whatsappDetail?: string;
};

export type Enquiry = {
  id: string;
  createdAt: number;
  name: string;
  email: string;
  phone: string;
  topic: string;
  vehicle: string;
  message: string;
  whatsapp: WhatsAppState;
  whatsappDetail?: string;
};

const RES_KEY = "qorvex.reservations.v1";
const ENQ_KEY = "qorvex.enquiries.v1";

function readList<T>(key: string): T[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList<T>(key: string, list: T[]) {
  localStorage.setItem(key, JSON.stringify(list));
}

export function listReservations() {
  return readList<Reservation>(RES_KEY).sort((a, b) => b.createdAt - a.createdAt);
}

export function getReservation(reference: string) {
  return listReservations().find((item) => item.reference === reference);
}

export function saveReservation(reservation: Reservation) {
  const next = listReservations().filter((item) => item.reference !== reservation.reference);
  next.push(reservation);
  writeList(RES_KEY, next);
}

export function removeReservation(reference: string) {
  writeList(
    RES_KEY,
    listReservations().filter((item) => item.reference !== reference),
  );
}

export function listEnquiries() {
  return readList<Enquiry>(ENQ_KEY).sort((a, b) => b.createdAt - a.createdAt);
}

export function saveEnquiry(enquiry: Enquiry) {
  const next = listEnquiries();
  next.push(enquiry);
  writeList(ENQ_KEY, next);
}

export function makeReference() {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const body = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
  return `QVX-${body}`;
}

export function reservationPhase(reservation: Reservation, now: number) {
  if (reservation.demoRecordedAt) return "demonstration" as const;
  if (now < reservation.createdAt + 24 * 60 * 60 * 1000) return "holding" as const;
  return "open" as const;
}
