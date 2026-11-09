import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { formatMoney } from "@/lib/format";

const customer = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(7).max(40),
  country: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(80),
  address: z.string().trim().min(8).max(240),
});

const payload = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("reservation"),
    reference: z.string().trim().min(4).max(24),
    vehicleName: z.string().trim().min(2).max(80),
    configuration: z.string().trim().min(2).max(400),
    totalBeforeTax: z.number().int().nonnegative().max(20_000_000),
    customer,
  }),
  z.object({
    kind: z.literal("cancel"),
    reference: z.string().trim().min(4).max(24),
    vehicleName: z.string().trim().min(2).max(80),
    customerName: z.string().trim().min(2).max(120),
  }),
  z.object({
    kind: z.literal("purchase"),
    phase: z.enum(["opened", "demo_recorded"]),
    reference: z.string().trim().min(4).max(24),
    vehicleName: z.string().trim().min(2).max(80),
    totalBeforeTax: z.number().int().nonnegative().max(20_000_000),
    customerName: z.string().trim().min(2).max(120),
  }),
  z.object({
    kind: z.literal("enquiry"),
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(160),
    phone: z.string().trim().min(7).max(40),
    topic: z.string().trim().min(2).max(80),
    vehicle: z.string().trim().max(80),
    message: z.string().trim().min(8).max(2000),
  }),
]);

export type NotifyInput = z.infer<typeof payload>;

export type NotifyResult = {
  acceptedAt: number;
  state: "sent" | "not_configured" | "failed" | "partial" | "rate_limited";
  detail: string;
};

const hits: number[] = [];

function rateLimited() {
  const now = Date.now();
  while (hits.length && now - hits[0]! > 60_000) hits.shift();
  if (hits.length >= 8) return true;
  hits.push(now);
  return false;
}

function money(value: number) {
  return formatMoney(value);
}

function messagesFor(data: NotifyInput): { event: string; body: string }[] {
  if (data.kind === "reservation") {
    const who = `${data.customer.fullName} · ${data.customer.email} · ${data.customer.phone}`;
    const where = `${data.customer.address}, ${data.customer.city}, ${data.customer.country}`;
    const price = `${money(data.totalBeforeTax)} indicative total before local tax`;
    return [
      {
        event: "booking_received",
        body: `QORVEX booking received\nRef ${data.reference}\n${data.vehicleName}\n${data.configuration}\n${price}\n${who}\n${where}`,
      },
      {
        event: "booking_confirmation",
        body: `QORVEX booking confirmation\nRef ${data.reference} is logged for ${data.customer.fullName}.\n${data.vehicleName}. ${data.configuration}.\nThis is a website reservation, not a paid order.`,
      },
      {
        event: "waiting_period",
        body: `QORVEX 24-hour hold\nRef ${data.reference} stays in a waiting period for 24 hours before the purchase stage opens.\nNo payment has been taken.`,
      },
    ];
  }
  if (data.kind === "cancel") {
    return [
      {
        event: "waiting_period",
        body: `QORVEX hold update\nRef ${data.reference} was cancelled by ${data.customerName} during the reservation flow.\n${data.vehicleName}. No payment was taken.`,
      },
    ];
  }
  if (data.kind === "purchase") {
    const line =
      data.phase === "opened"
        ? `Purchase stage opened for ref ${data.reference}. The checkout is a demonstration. No payment has been received.`
        : `Demonstration checkout recorded for ref ${data.reference}. No card was charged and no payment was received.`;
    return [
      {
        event: "purchase_stage",
        body: `QORVEX purchase-stage update\n${line}\n${data.vehicleName} · ${data.customerName} · ${money(data.totalBeforeTax)} indicative, before tax.`,
      },
    ];
  }
  return [
    {
      event: "enquiry",
      body: `QORVEX enquiry\n${data.topic}${data.vehicle ? ` · ${data.vehicle}` : ""}\n${data.name} · ${data.email} · ${data.phone}\n${data.message}`,
    },
  ];
}

async function postWhatsApp(token: string, phoneId: string, to: string, body: string) {
  const response = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { preview_url: false, body },
    }),
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) {
    console.error("[qorvex] WhatsApp API status", response.status);
    return false;
  }
  return true;
}

export const notifyDesk = createServerFn({ method: "POST" })
  .validator((input: unknown) => payload.parse(input))
  .handler(async ({ data }): Promise<NotifyResult> => {
    const acceptedAt = Date.now();
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const to = process.env.WHATSAPP_NOTIFY_TO?.replace(/[^\d]/g, "");

    if (!token || !phoneId || !to) {
      return {
        acceptedAt,
        state: "not_configured",
        detail:
          "WhatsApp Business is not configured. Set WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_NOTIFY_TO on the server. Nothing was sent.",
      };
    }

    if (rateLimited()) {
      return {
        acceptedAt,
        state: "rate_limited",
        detail: "Too many notification attempts in a short time. Nothing further was sent.",
      };
    }

    const messages = messagesFor(data);
    let sent = 0;
    for (const message of messages) {
      try {
        const ok = await postWhatsApp(token, phoneId, to, message.body);
        if (ok) sent += 1;
      } catch (error) {
        console.error("[qorvex] WhatsApp request failed", error instanceof Error ? error.name : "error");
      }
    }

    if (sent === messages.length) {
      return {
        acceptedAt,
        state: "sent",
        detail: `${sent} WhatsApp message${sent === 1 ? "" : "s"} accepted by the API.`,
      };
    }
    if (sent === 0) {
      return {
        acceptedAt,
        state: "failed",
        detail: "The WhatsApp API did not accept the message. Check the token, phone number ID, and recipient.",
      };
    }
    return {
      acceptedAt,
      state: "partial",
      detail: `${sent} of ${messages.length} WhatsApp messages were accepted.`,
    };
  });
