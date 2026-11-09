export type Frame = "poster" | "banner";
export type View = "exterior" | "interior";

export type Shot = {
  src: string;
  alt: string;
  frame: Frame;
  view: View;
  width: number;
  height: number;
};

export type Choice = {
  id: string;
  name: string;
  price: number;
  /** Every selectable finish and package on this preview is a sample, not a factory option list. */
  sample: true;
  detail?: string;
  hex?: string;
};

export type Spec = {
  label: string;
  value: string;
  confirmed: boolean;
};

export type Vehicle = {
  slug: "v9" | "v09" | "x-t" | "awk-soul";
  code: string;
  name: string;
  category: string;
  epithet: string;
  summary: string;
  story: string;
  /** Official USD catalogue price. Options and sample fees are added on top. */
  basePrice: number;
  shots: Shot[];
  specs: Spec[];
  highlights: { title: string; body: string }[];
  exteriors: Choice[];
  interiors: Choice[];
  packages: Choice[];
  fees: { delivery: number; registration: number; documentation: number };
};

const sample = true as const;

export const vehicles: Vehicle[] = [
  {
    slug: "v9",
    code: "V9",
    name: "QORVEX V9",
    category: "Luxury electric coupe",
    epithet: "Four-seater grand tourer",
    summary:
      "An electric grand tourer for four. Long bonnet, low roof, and a cabin finished for distance rather than display.",
    story:
      "The V9 is the house grand tourer. The supplied study shows a silver coupe with both cabin doors open onto four seats, a cashmere interior, and a calm, wide dash. Power, range and the chassis brief below are taken from the QORVEX model sheet and are not estimates.",
    basePrice: 500000,
    fees: { delivery: 1800, registration: 750, documentation: 420 },
    shots: [
      {
        src: `${import.meta.env.BASE_URL}vehicles/v9-exterior.jpg`,
        alt: "Silver QORVEX V9 four-seater grand tourer coupe with doors open, photographed at night outside a glass house.",
        frame: "banner",
        view: "exterior",
        width: 799,
        height: 328,
      },
      {
        src: `${import.meta.env.BASE_URL}vehicles/v9-interior.jpg`,
        alt: "QORVEX V9 front cabin in cashmere leather, with a wide display and a Q-marked steering wheel, at dusk.",
        frame: "banner",
        view: "interior",
        width: 729,
        height: 328,
      },
    ],
    specs: [
      { label: "Layout", value: "Four-seater grand tourer coupe", confirmed: true },
      { label: "Powertrain", value: "Battery electric", confirmed: true },
      { label: "Power", value: "620 hp", confirmed: true },
      { label: "Weight", value: "2.4 tons", confirmed: true },
      { label: "Torque", value: "850 Nm", confirmed: true },
      { label: "Top speed", value: "270 km/h", confirmed: true },
      { label: "Range", value: "680 km", confirmed: true },
      { label: "Battery", value: "110 kWh", confirmed: true },
      { label: "Suspension", value: "Hydraulic fully active", confirmed: true },
    ],
    highlights: [
      {
        title: "Grand touring, electric",
        body: "620 horsepower and 2.4 tons. Torque is 850 Nm, with a 110 kWh battery and a stated range of 680 km. Top speed is 270 km/h. Catalogue price is $500,000 USD.",
      },
      {
        title: "Active chassis",
        body: "Hydraulic fully active suspension is part of the V9 brief, aimed at keeping a low coupe composed on poor roads.",
      },
      {
        title: "Four seats, two rows",
        body: "The reference film is titled as a four-seater grand tourer. The open-door study shows a cashmere cabin and a Q-marked wheel.",
      },
    ],
    exteriors: [
      { id: "liquid-silver", name: "Liquid silver", price: 0, sample, hex: "#c5c7cb", detail: "Reference finish in the supplied exterior study." },
      { id: "obsidian", name: "Obsidian", price: 0, sample, hex: "#141414", detail: "Sample colour. No separate photograph." },
      { id: "glacier", name: "Glacier", price: 1400, sample, hex: "#e6e1d8", detail: "Sample colour. No separate photograph." },
    ],
    interiors: [
      { id: "cashmere", name: "Cashmere", price: 0, sample, hex: "#d7c6b0", detail: "Reference hide in the supplied cabin study." },
      { id: "nocturne", name: "Nocturne black", price: 0, sample, hex: "#1a1a1a", detail: "Sample hide. No separate photograph." },
    ],
    packages: [
      { id: "ppf", name: "Paint protection film", price: 4800, sample, detail: "Sample protection package. Not a confirmed factory fit." },
      { id: "sills", name: "Illuminated treadplates", price: 740, sample, detail: "Sample trim. Not shown as standard in the study." },
    ],
  },
  {
    slug: "v09",
    code: "V09",
    name: "QORVEX V09",
    category: "Luxury electric SUV",
    epithet: "Luxury grand SUV",
    summary:
      "A black grand SUV with an executive cabin: ivory leather, a full-width display, and screens for the rear seats.",
    story:
      "The V09 is the house grand SUV. Night studies show a dark body with a thin light signature, an ivory dash under a city skyline, and a rear cabin with entertainment screens. The performance figures below are from the model sheet.",
    basePrice: 490000,
    fees: { delivery: 1900, registration: 750, documentation: 420 },
    shots: [
      {
        src: `${import.meta.env.BASE_URL}vehicles/v09-exterior.jpg`,
        alt: "Black QORVEX V09 luxury grand SUV on a wet terrace at night, with a light signature across the nose.",
        frame: "banner",
        view: "exterior",
        width: 800,
        height: 313,
      },
      {
        src: `${import.meta.env.BASE_URL}vehicles/v09-dash.jpg`,
        alt: "QORVEX V09 ivory dashboard at night, with a Q steering mark and a wide display facing a city skyline.",
        frame: "banner",
        view: "interior",
        width: 717,
        height: 313,
      },
      {
        src: `${import.meta.env.BASE_URL}vehicles/v09-cabin.jpg`,
        alt: "QORVEX V09 rear cabin in ivory leather, with screens on the front seatbacks, overlooking a night city.",
        frame: "banner",
        view: "interior",
        width: 1523,
        height: 370,
      },
    ],
    specs: [
      { label: "Layout", value: "Luxury grand SUV", confirmed: true },
      { label: "Powertrain", value: "Battery electric", confirmed: true },
      { label: "Power", value: "680 hp", confirmed: true },
      { label: "Weight", value: "2.7 tons", confirmed: true },
      { label: "Torque", value: "920 Nm", confirmed: true },
      { label: "Top speed", value: "250 km/h", confirmed: true },
      { label: "Range", value: "650 km", confirmed: true },
      { label: "Battery", value: "120 kWh", confirmed: true },
      { label: "Suspension", value: "Hydraulic fully active", confirmed: true },
      { label: "Cabin", value: "Executive, front and rear seating", confirmed: true },
    ],
    highlights: [
      {
        title: "The stronger electric SUV",
        body: "680 horsepower and 2.7 tons. Torque is 920 Nm, with a 120 kWh battery, 650 km of stated range, and a top speed of 250 km/h. Catalogue price is $490,000 USD.",
      },
      {
        title: "Executive cabin",
        body: "Ivory leather, a continuous front display, and rear seatback screens are in the supplied interior studies. One cabin board carries the line “Beyond the ordinary.”",
      },
      {
        title: "Active chassis",
        body: "Hydraulic fully active suspension is specified for the V09, shared in principle with the V9 and tuned for the taller body.",
      },
    ],
    exteriors: [
      { id: "midnight", name: "Midnight black", price: 0, sample, hex: "#101114", detail: "Reference finish in the supplied exterior study." },
      { id: "graphite", name: "Graphite", price: 0, sample, hex: "#3c4046", detail: "Sample colour. No separate photograph." },
      { id: "pearl", name: "Pearl", price: 1600, sample, hex: "#efeae3", detail: "Sample colour. No separate photograph." },
    ],
    interiors: [
      { id: "ivory", name: "Ivory executive", price: 0, sample, hex: "#e4d8c6", detail: "Reference cabin in the supplied studies." },
      { id: "graphite-hide", name: "Graphite hide", price: 0, sample, hex: "#2a2a2a", detail: "Sample hide. No separate photograph." },
    ],
    packages: [
      { id: "ambient", name: "Champagne ambient light", price: 1600, sample, detail: "Sample lighting theme. The studies already show a thin cabin light line." },
      { id: "mats", name: "Executive floor set", price: 680, sample, detail: "Sample accessory. Not a confirmed factory option." },
    ],
  },
  {
    slug: "x-t",
    code: "X-T",
    name: "QORVEX X-T",
    category: "Extreme 6×6 off-roader",
    epithet: "Six wheels, V8 diesel",
    summary:
      "A six-wheel expedition machine. V8 diesel, a winch and recovery gear, a roof light bar, and a five-seat tactical cabin.",
    story:
      "The X-T keeps the original V8 diesel brief and the six-wheel layout. The photographs show a protected dark body, front and rear winches, a roof rack with cases, and a black leather cabin with two command seats and a three-place rear bench. Official output is 1,450 hp at 3.9 tons. Catalogue price is $1,200,000 USD.",
    basePrice: 1200000,
    fees: { delivery: 4600, registration: 900, documentation: 640 },
    shots: [
      {
        src: `${import.meta.env.BASE_URL}vehicles/xt-front.jpg`,
        alt: "Dark QORVEX X-T six-wheel off-roader facing forward on a rocky mountain track at dusk, with a light bar and front winch.",
        frame: "poster",
        view: "exterior",
        width: 1529,
        height: 1028,
      },
      {
        src: `${import.meta.env.BASE_URL}vehicles/xt-rear.jpg`,
        alt: "QORVEX X-T six-wheeler seen from the rear three-quarter on red desert rock at sunset, with vertical tail lamps and a Q mark.",
        frame: "poster",
        view: "exterior",
        width: 1537,
        height: 1023,
      },
      {
        src: `${import.meta.env.BASE_URL}vehicles/xt-interior.jpg`,
        alt: "QORVEX X-T cabin in black leather, with a digital cluster, Q-marked wheel, and a three-place rear bench, doors open to mountains.",
        frame: "poster",
        view: "interior",
        width: 1536,
        height: 1024,
      },
    ],
    specs: [
      { label: "Layout", value: "6×6, three axles", confirmed: true },
      { label: "Powertrain", value: "V8 diesel", confirmed: true },
      { label: "Power", value: "1,450 hp", confirmed: true },
      { label: "Weight", value: "3.9 tons", confirmed: true },
      { label: "Role", value: "Extreme off-roader", confirmed: true },
      { label: "Cabin", value: "Two command seats and a three-place rear bench", confirmed: true },
      { label: "Recovery", value: "Front and rear winch points, visible in the studies", confirmed: true },
      { label: "Roof", value: "Light bar and expedition cases", confirmed: true },
    ],
    highlights: [
      {
        title: "Six contact patches",
        body: "Three axles and six heavy off-road tyres. The stance is the point: ground clearance, approach, and a body that reads as equipment rather than trim.",
      },
      {
        title: "V8 diesel",
        body: "The powertrain brief is a V8 diesel. Official output is 1,450 horsepower. The vehicle weighs 3.9 tons. Catalogue price is $1,200,000 USD.",
      },
      {
        title: "Self-recovery",
        body: "Both the mountain study and the desert study show a winch, shackles, a roof light bar, and a loaded roof rack.",
      },
    ],
    exteriors: [
      { id: "stealth", name: "Stealth black", price: 0, sample, hex: "#1a1c1e", detail: "Reference finish in both exterior studies." },
      { id: "bronze", name: "Desert bronze", price: 2800, sample, hex: "#8a5a3c", detail: "Sample colour. No separate photograph." },
      { id: "rock", name: "Rock grey", price: 1800, sample, hex: "#6e6a65", detail: "Sample colour. No separate photograph." },
    ],
    interiors: [
      { id: "command", name: "Command black", price: 0, sample, hex: "#171717", detail: "Reference cabin." },
      { id: "sand", name: "Sand tactical", price: 1200, sample, hex: "#c2b39a", detail: "Sample hide. No separate photograph." },
    ],
    packages: [
      { id: "recovery-kit", name: "Additional recovery kit", price: 1150, sample, detail: "Sample kit beyond the winches already visible." },
      { id: "insulation", name: "Cabin insulation upgrade", price: 2900, sample, detail: "Sample comfort package. Not a confirmed factory fit." },
    ],
  },
  {
    slug: "awk-soul",
    code: "AWK Soul",
    name: "AWK Soul",
    category: "Hypercar",
    epithet: "V12 supercharged",
    summary:
      "An exclusive two-seat hypercar. Supercharged V12 architecture, a carbon cockpit, and a body shaped for a circuit.",
    story:
      "AWK Soul is presented as the house hypercar. The brief keeps a supercharged V12. Official output is 1,723 hp at 1.4 tons. Catalogue price is $4,500,000 USD. The studies show a black, low, winged car on a racetrack and a carbon cockpit with a sharply cut wheel.",
    basePrice: 4500000,
    fees: { delivery: 7200, registration: 1200, documentation: 880 },
    shots: [
      {
        src: `${import.meta.env.BASE_URL}vehicles/awk-exterior.jpg`,
        alt: "Black AWK Soul hypercar in profile on a racetrack, with a large rear wing, low nose, and yellow brake calipers.",
        frame: "poster",
        view: "exterior",
        width: 1536,
        height: 1024,
      },
      {
        src: `${import.meta.env.BASE_URL}vehicles/awk-interior.jpg`,
        alt: "AWK Soul carbon cockpit at sunset, with a faceted steering wheel, digital cluster, and deeply bolstered seats.",
        frame: "poster",
        view: "interior",
        width: 1536,
        height: 1024,
      },
    ],
    specs: [
      { label: "Layout", value: "Two-seat hypercar", confirmed: true },
      { label: "Powertrain", value: "V12, supercharged", confirmed: true },
      { label: "Power", value: "1,723 hp", confirmed: true },
      { label: "Weight", value: "1.4 tons", confirmed: true },
      { label: "Body", value: "Low coupe with a large rear wing", confirmed: true },
      { label: "Cockpit", value: "Carbon, circuit seating", confirmed: true },
    ],
    highlights: [
      {
        title: "Supercharged twelve",
        body: "The concept powertrain is a supercharged V12. Official output is 1,723 horsepower at 1.4 tons. Catalogue price is $4,500,000 USD.",
      },
      {
        title: "Circuit body",
        body: "The exterior study places the car on a track: long nose, cut surfaces, exposed mechanical detail at the wheels, and a full-width rear wing.",
      },
      {
        title: "Carbon cockpit",
        body: "The interior study is a two-seat carbon cabin, a faceted wheel, and a low digital cluster, shot toward a circuit at sunset.",
      },
    ],
    exteriors: [
      { id: "jet", name: "Jet black", price: 0, sample, hex: "#0c0c0c", detail: "Reference finish in the track study." },
      { id: "satin-carbon", name: "Satin carbon", price: 22000, sample, hex: "#2b2b2b", detail: "Sample finish. No separate photograph." },
    ],
    interiors: [
      { id: "carbon", name: "Carbon black", price: 0, sample, hex: "#141414", detail: "Reference cockpit." },
      { id: "alcantara", name: "Alcantara insert", price: 8500, sample, hex: "#3a342f", detail: "Sample trim. Not a confirmed factory option." },
    ],
    packages: [
      { id: "telemetry", name: "Circuit telemetry", price: 12000, sample, detail: "Sample electronics package." },
      { id: "mirrors", name: "Exposed carbon mirrors", price: 4200, sample, detail: "Sample exterior detail." },
    ],
  },
];

export function getVehicle(slug: string) {
  return vehicles.find((vehicle) => vehicle.slug === slug);
}

export function vehiclePath(slug: string) {
  return `/vehicles/${slug}` as const;
}
