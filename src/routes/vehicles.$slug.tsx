import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Gallery } from "@/components/gallery";
import { buttonClass, Kicker, Money, Note } from "@/components/site";
import { formatMoney } from "@/lib/format";
import { getVehicle } from "@/lib/vehicles";

export const Route = createFileRoute("/vehicles/$slug")({
  loader: ({ params }) => {
    const vehicle = getVehicle(params.slug);
    if (!vehicle) throw notFound();
    return { slug: vehicle.slug };
  },
  head: ({ params }) => {
    const vehicle = getVehicle(params.slug);
    return { meta: [{ title: vehicle ? `${vehicle.name} — QORVEX` : "QORVEX" }] };
  },
  component: VehiclePage,
  notFoundComponent: Missing,
});

function Missing() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-32 pb-24">
      <h1 className="font-display text-5xl">That model is not in the line.</h1>
      <Link to="/collection" className="mt-6 inline-flex min-h-11 items-center text-xs tracking-widest text-champagne uppercase">
        Back to the collection
      </Link>
    </div>
  );
}

function VehiclePage() {
  const { slug } = Route.useParams();
  const vehicle = getVehicle(slug);
  if (!vehicle) return null;
  const hero = vehicle.shots[0];

  return (
    <article>
      <header className="mx-auto max-w-7xl px-5 pt-24">
        <Kicker>{vehicle.category}</Kicker>
        <h1 className="mt-3 font-display text-5xl sm:text-7xl">{vehicle.name}</h1>
        <p className="mt-3 font-display text-3xl text-champagne-2 italic">{vehicle.epithet}</p>
      </header>
      <div className="mt-6 bg-ink">
        {hero?.frame === "banner" ? (
          <img src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} className="mx-auto block h-auto w-full max-w-4xl object-contain" />
        ) : hero ? (
          <img src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} className="h-[58svh] w-full object-cover sm:h-[72svh]" />
        ) : null}
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="max-w-2xl text-muted">{vehicle.story}</p>
        </div>
        <aside className="border border-line bg-panel p-6 lg:col-span-5">
          <p className="text-xs tracking-widest text-faint uppercase">Price</p>
          <p className="mt-2 font-display text-5xl">
            <Money value={vehicle.basePrice} />
          </p>
          <p className="mt-3 text-sm text-muted">
            Catalogue price in USD, before options and before the sample delivery, registration and documentation
            estimates.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/configure/$slug" params={{ slug: vehicle.slug }} className={buttonClass("solid")}>
              Configure
            </Link>
            <Link to="/reserve/$slug" params={{ slug: vehicle.slug }} className={buttonClass("ghost")}>
              Reserve
            </Link>
          </div>
        </aside>
      </div>

      <section className="mx-auto max-w-7xl px-5 pb-16">
        <h2 className="font-display text-4xl">Gallery</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Original QORVEX studies only. Wide boards are shown in full, not cropped. Other colours do not change these photographs.
        </p>
        <div className="mt-6">
          <Gallery shots={vehicle.shots} />
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <h2 className="font-display text-4xl">Performance and specification</h2>
          <dl className="mt-8 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {vehicle.specs.map((spec) => (
              <div key={spec.label} className="bg-obsidian px-4 py-5">
                <dt className="text-xs tracking-widest text-faint uppercase">{spec.label}</dt>
                <dd className="mt-2 text-lg">{spec.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {vehicle.highlights.map((item) => (
              <div key={item.title}>
                <h3 className="font-display text-3xl">{item.title}</h3>
                <p className="mt-3 text-sm text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <h2 className="font-display text-4xl">Configurations</h2>
          <div className="mt-4 max-w-3xl">
            <Note>
              Exterior colours, interiors and packages below are sample choices for this preview. They are not a confirmed
              QORVEX option list. The photograph always shows the reference finish.
            </Note>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <ChoiceList title="Exterior" items={vehicle.exteriors} />
            <ChoiceList title="Interior" items={vehicle.interiors} />
            <ChoiceList title="Packages" items={vehicle.packages} />
          </div>
          <Link to="/configure/$slug" params={{ slug: vehicle.slug }} className={`${buttonClass("solid")} mt-10`}>
            Build this car
          </Link>
        </div>
      </section>
    </article>
  );
}

function ChoiceList({
  title,
  items,
}: {
  title: string;
  items: { id: string; name: string; price: number; detail?: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs tracking-widest text-faint uppercase">{title}</h3>
      <ul className="mt-4 space-y-4">
        {items.map((item) => (
          <li key={item.id} className="border-t border-line pt-3">
            <p>{item.name}</p>
            <p className="text-sm text-muted">{item.detail}</p>
            <p className="mt-1 text-sm tabular-nums text-champagne-2">
              {item.price === 0 ? "No sample premium" : `+ ${formatMoney(item.price)} sample`}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
