import type { Choice, Vehicle } from "@/lib/vehicles";

export type SavedConfig = {
  exteriorId: string;
  interiorId: string;
  packageIds: string[];
};

export type Quote = {
  exterior: Choice;
  interior: Choice;
  packages: Choice[];
  base: number;
  options: number;
  delivery: number;
  registration: number;
  documentation: number;
  totalBeforeTax: number;
};

export function defaultConfig(vehicle: Vehicle): SavedConfig {
  return {
    exteriorId: vehicle.exteriors[0]?.id ?? "",
    interiorId: vehicle.interiors[0]?.id ?? "",
    packageIds: [],
  };
}

export function sanitizeConfig(vehicle: Vehicle, raw: Partial<SavedConfig> | null): SavedConfig {
  const fallback = defaultConfig(vehicle);
  if (!raw) return fallback;
  const exteriorId = vehicle.exteriors.some((item) => item.id === raw.exteriorId)
    ? (raw.exteriorId as string)
    : fallback.exteriorId;
  const interiorId = vehicle.interiors.some((item) => item.id === raw.interiorId)
    ? (raw.interiorId as string)
    : fallback.interiorId;
  const packageIds = Array.isArray(raw.packageIds)
    ? raw.packageIds.filter((id) => vehicle.packages.some((item) => item.id === id))
    : [];
  return { exteriorId, interiorId, packageIds };
}

const storageKey = (slug: string) => `qorvex.config.${slug}`;

export function readConfig(vehicle: Vehicle): SavedConfig {
  if (typeof sessionStorage === "undefined") return defaultConfig(vehicle);
  try {
    const raw = sessionStorage.getItem(storageKey(vehicle.slug));
    if (!raw) return defaultConfig(vehicle);
    return sanitizeConfig(vehicle, JSON.parse(raw) as Partial<SavedConfig>);
  } catch {
    return defaultConfig(vehicle);
  }
}

export function writeConfig(slug: string, config: SavedConfig) {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(storageKey(slug), JSON.stringify(config));
}

export function quoteVehicle(vehicle: Vehicle, config: SavedConfig): Quote {
  const safe = sanitizeConfig(vehicle, config);
  const exterior = vehicle.exteriors.find((item) => item.id === safe.exteriorId) ?? vehicle.exteriors[0];
  const interior = vehicle.interiors.find((item) => item.id === safe.interiorId) ?? vehicle.interiors[0];
  const packages = vehicle.packages.filter((item) => safe.packageIds.includes(item.id));
  const options = exterior.price + interior.price + packages.reduce((sum, item) => sum + item.price, 0);
  const { delivery, registration, documentation } = vehicle.fees;
  return {
    exterior,
    interior,
    packages,
    base: vehicle.basePrice,
    options,
    delivery,
    registration,
    documentation,
    totalBeforeTax: vehicle.basePrice + options + delivery + registration + documentation,
  };
}

export function configurationLine(quote: Quote) {
  const packs = quote.packages.length
    ? quote.packages.map((item) => item.name).join(", ")
    : "No packages";
  return `${quote.exterior.name} exterior · ${quote.interior.name} interior · ${packs}`;
}
