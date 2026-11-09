import { createFileRoute, Link } from "@tanstack/react-router";
import { Kicker, Money, Note } from "@/components/site";
import { vehicles } from "@/lib/vehicles";

export const Route = createFileRoute("/collection")({
  head: () => ({ meta: [{ title: "Collection — QORVEX" }] }),
  component: Collection,
});

function readSpec(vehicle: (typeof vehicles)[number], label: string) {
  return vehicle.specs.find((spec) => spec.label === label)?.value ?? "Not stated";
}

function Collection() {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-28 pb-24">
      <Kicker>Collection</Kicker>
      <h1 className="mt-3 max-w-3xl font-display text-5xl sm:text-7xl">The cars QORVEX will talk about.</h1>
      <p className="mt-5 max-w-2xl text-muted">
        Four current models. Power, weight and USD catalogue prices are the official figures. Colours and packages
        remain sample choices for this preview.
      </p>
      <div className="mt-12 grid gap-10">
        {vehicles.map((vehicle) => {
          const shot = vehicle.shots[0];
          return (
            <article key={vehicle.slug} className="grid gap-6 border-t border-line pt-8 md:grid-cols-12">
              <Link to="/vehicles/$slug" params={{ slug: vehicle.slug }} className="bg-ink md:col-span-7">
                {shot ? (
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    width={shot.width}
                    height={shot.height}
                    className={shot.frame === "banner" ? "mx-auto block h-auto w-full max-w-4xl object-contain" : "aspect-[3/2] w-full object-cover"}
                  />
                ) : null}
              </Link>
              <div className="flex flex-col justify-center md:col-span-5">
                <p className="text-xs tracking-widest text-champagne uppercase">{vehicle.category}</p>
                <h2 className="mt-2 font-display text-5xl">{vehicle.name}</h2>
                <p className="mt-3 text-muted">{vehicle.summary}</p>
                <p className="mt-4 text-sm">
                  <span className="text-faint">{readSpec(vehicle, "Power")}</span>
                  <span className="text-faint"> · {readSpec(vehicle, "Weight")}</span>
                </p>
                <p className="mt-2 text-sm text-ivory">
                  <Money value={vehicle.basePrice} />
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/vehicles/$slug"
                    params={{ slug: vehicle.slug }}
                    className="inline-flex min-h-11 items-center bg-ivory px-5 text-xs tracking-widest text-obsidian uppercase"
                  >
                    Details
                  </Link>
                  <Link
                    to="/configure/$slug"
                    params={{ slug: vehicle.slug }}
                    className="inline-flex min-h-11 items-center border border-ivory/30 px-5 text-xs tracking-widest uppercase"
                  >
                    Configure
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-16 overflow-x-auto border border-line">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <caption className="sr-only">Collection comparison</caption>
          <thead className="bg-panel text-xs tracking-widest uppercase text-faint">
            <tr>
              <th className="px-4 py-3 font-medium"> </th>
              {vehicles.map((vehicle) => (
                <th key={vehicle.slug} className="px-4 py-3 font-medium text-ivory">
                  {vehicle.code}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(
              [
                ["Category", (v: (typeof vehicles)[number]) => v.category],
                ["Powertrain", (v: (typeof vehicles)[number]) => readSpec(v, "Powertrain")],
                ["Power", (v: (typeof vehicles)[number]) => readSpec(v, "Power")],
                ["Weight", (v: (typeof vehicles)[number]) => readSpec(v, "Weight")],
                ["Price (USD)", (v: (typeof vehicles)[number]) => ""],
                ["Top speed", (v: (typeof vehicles)[number]) => readSpec(v, "Top speed")],
                ["Range", (v: (typeof vehicles)[number]) => readSpec(v, "Range")],
              ] as const
            ).map(([label, read]) => (
              <tr key={label} className="border-t border-line">
                <th className="px-4 py-3 font-normal text-faint">{label}</th>
                {vehicles.map((vehicle) => (
                  <td key={vehicle.slug} className="px-4 py-3">
                    {label === "Price (USD)" ? <Money value={vehicle.basePrice} /> : read(vehicle)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <Note>
          Power, weight and the USD catalogue price are official. Where another figure is “Not stated”, it was not on
          the official sheet and has been left blank. Delivery, registration and documentation lines in checkout are
          still sample estimates, added on top of the catalogue price.
        </Note>
      </div>
    </div>
  );
}
