import type { Customer } from "@/lib/reservations";

export type FieldErrors = Partial<Record<keyof Customer | "consent" | "message" | "topic", string>>;

const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function digits(value: string) {
  return value.replace(/\D/g, "");
}

export function validateCustomer(input: Customer, consent: boolean): FieldErrors {
  const errors: FieldErrors = {};
  if (input.fullName.trim().length < 2) errors.fullName = "Enter the full name the reservation should use.";
  if (!emailOk.test(input.email.trim())) errors.email = "Enter a valid email address.";
  if (digits(input.phone).length < 7) errors.phone = "Enter a phone number with at least 7 digits.";
  if (input.country.trim().length < 2) errors.country = "Enter a country.";
  if (input.city.trim().length < 2) errors.city = "Enter a city.";
  if (input.address.trim().length < 8) errors.address = "Enter the full delivery address.";
  if (!consent) errors.consent = "Confirm the hold, the estimates, and that this preview takes no payment.";
  return errors;
}

export function emptyCustomer(): Customer {
  return { fullName: "", email: "", phone: "", country: "", city: "", address: "" };
}
