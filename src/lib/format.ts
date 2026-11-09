export const HOLD_MS = 24 * 60 * 60 * 1000;

export function formatMoney(value: number) {
  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
  return `${amount} USD`;
}

export function holdRemaining(createdAt: number, now: number) {
  return Math.max(0, createdAt + HOLD_MS - now);
}

export function formatDuration(ms: number) {
  const total = Math.ceil(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}

export function formatWhen(ts: number) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(ts);
}
