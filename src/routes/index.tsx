import { createFileRoute, Link } from "@tanstack/react-router";
import { Film } from "@/components/film";
import { Kicker, Money, Reveal } from "@/components/site";
import { vehicles, type Vehicle } from "@/lib/vehicles";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <Film />
      <section className="mx-auto max-w-7xl px-5 py-20 md:py-28">
        <Reveal>
          <Kicker>The line</Kicker>
          <h2 className="mt-4 max-w-3xl font-display text-5xl sm:text-6xl">Four cars. Nothing else on the floor.</h2>
          <p className="mt-6 max-w-2xl text-muted">
            V9 and V09 are battery electric, with hydraulic fully active suspension. The X-T remains a V8 diesel 6×6.
            AWK Soul remains a supercharged V12 hypercar. Power, weight and USD prices below are the official figures.
          </p>
        </Reveal>
      </section>
      <div>
        {vehicles.map((vehicle, index) => (
          <Chapter key={vehicle.slug} vehicle={vehicle} flip={index % 2 === 1} />
        ))}
      </div>
      <section className="border-t border-line">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-20 md:grid-cols-2 md:items-end">
          <div>
            <Kicker>Reservation</Kicker>
            <h2 className="mt-4 font-display text-5xl">Hold the car for 24 hours.</h2>
          </div>
          <div className="text-muted">
            <p>
              Choose a configuration, leave your details, and the purchase stage stays closed until the hold ends.
              Checkout on this site is a demonstration. No card is charged.
            </p>
            <Link
              to="/collection"
              className="mt-6 inline-flex min-h-11 items-center bg-ivory px-5 text-xs tracking-widest text-obsidian uppercase"
            >
              Choose a car
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function spec(vehicle: Vehicle, label: string) {
  return vehicle.specs.find((item) => item.label === label)?.value ?? "—";
}

function Chapter({ vehicle, flip }: { vehicle: Vehicle; flip: boolean }) {
  const shot = vehicle.shots[0];
  if (!shot) return null;
  const image = (
    <div className="bg-ink">
      <img
        src={shot.src}
        alt={shot.alt}
        width={shot.width}
        height={shot.height}
        className={shot.frame === "banner" ? "mx-auto block h-auto w-full max-w-4xl object-contain" : "aspect-[3/2] h-full w-full object-cover"}
      />
    </div>
  );
  const copy = (
    <div className="flex flex-col justify-center px-5 py-10 md:px-10 md:py-16">
      <Kicker>{vehicle.category}</Kicker>
      <h3 className="mt-3 font-display text-5xl">{vehicle.name}</h3>
      <p className="mt-2 font-display text-2xl text-champagne-2 italic">{vehicle.epithet}</p>
      <p className="mt-5 text-muted">{vehicle.summary}</p>
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <p>
          <span className="block text-xs tracking-widest text-faint uppercase">Power</span>
          {spec(vehicle, "Power")}
        </p>
        <p>
          <span className="block text-xs tracking-widest text-faint uppercase">Weight</span>
          {spec(vehicle, "Weight")}
        </p>
        <p>
          <span className="block text-xs tracking-widest text-faint uppercase">Price</span>
          <Money value={vehicle.basePrice} />
        </p>
      </div>
      <Link
        to="/vehicles/$slug"
        params={{ slug: vehicle.slug }}
        className="mt-8 inline-flex min-h-11 items-center text-xs tracking-widest text-champagne-2 uppercase"
      >
        View {vehicle.code}
      </Link>
    </div>
  );

  return (
    <Reveal>
      <article className="border-t border-line">
        <div className="grid md:grid-cols-2">
          <div className={flip ? "md:order-2" : undefined}>{image}</div>
          <div className={flip ? "md:order-1" : undefined}>{copy}</div>
        </div>
      </article>
    </Reveal>
  );
}
