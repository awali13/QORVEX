import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { buttonClass, Kicker, Money, Note } from "@/components/site";
import { cn } from "@/lib/cn";
import { quoteVehicle, readConfig, writeConfig, type SavedConfig } from "@/lib/pricing";
import { getVehicle, type Choice, type Vehicle } from "@/lib/vehicles";

export const Route = createFileRoute("/configure/$slug")({
  loader: ({ params }) => {
    if (!getVehicle(params.slug)) throw notFound();
    return { slug: params.slug };
  },
  head: ({ params }) => {
    const vehicle = getVehicle(params.slug);
    return { meta: [{ title: vehicle ? `Configure ${vehicle.code} — QORVEX` : "Configure — QORVEX" }] };
  },
  component: ConfigurePage,
});

function ConfigurePage() {
  const { slug } = Route.useParams();
  const vehicle = getVehicle(slug);
  if (!vehicle) return null;
  return <Configurator vehicle={vehicle} />;
}

function Configurator({ vehicle }: { vehicle: Vehicle }) {
  const navigate = useNavigate();
  const [config, setConfig] = useState<SavedConfig>(() => ({
    exteriorId: vehicle.exteriors[0]?.id ?? "",
    interiorId: vehicle.interiors[0]?.id ?? "",
    packageIds: [],
  }));
  const [ready, setReady] = useState(false);
  const [showInterior, setShowInterior] = useState(false);

  useEffect(() => {
    setConfig(readConfig(vehicle));
    setReady(true);
  }, [vehicle]);

  useEffect(() => {
    if (ready) writeConfig(vehicle.slug, config);
  }, [config, ready, vehicle.slug]);

  const quote = useMemo(() => quoteVehicle(vehicle, config), [vehicle, config]);
  const exteriorShot = vehicle.shots.find((shot) => shot.view === "exterior") ?? vehicle.shots[0];
  const interiorShot = vehicle.shots.find((shot) => shot.view === "interior") ?? exteriorShot;
  const shot = showInterior ? interiorShot : exteriorShot;

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-5 pt-28 pb-32 lg:grid-cols-12 lg:pb-20">
      <div className="lg:col-span-7">
        <Kicker>Configure · sample choices</Kicker>
        <h1 className="mt-3 font-display text-5xl sm:text-6xl">{vehicle.name}</h1>
        <p className="mt-4 text-muted">{vehicle.epithet}. The image does not recolour. It stays the reference study.</p>
        <div className="mt-6 bg-ink">
          {shot ? (
            <img
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              className={shot.frame === "banner" ? "mx-auto block h-auto w-full max-w-4xl object-contain" : "aspect-[3/2] w-full object-cover"}
            />
          ) : null}
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className={cn("min-h-11 px-4 text-xs tracking-widest uppercase", !showInterior ? "bg-ivory text-obsidian" : "border border-line")}
            onClick={() => setShowInterior(false)}
          >
            Exterior study
          </button>
          <button
            type="button"
            className={cn("min-h-11 px-4 text-xs tracking-widest uppercase", showInterior ? "bg-ivory text-obsidian" : "border border-line")}
            onClick={() => setShowInterior(true)}
          >
            Interior study
          </button>
        </div>
        <div className="mt-6">
          <Note>
            Every colour, hide and package on this page is a sample choice. Only the reference finish has a photograph.
            Selecting another swatch changes the written configuration and the indicative price, not the picture.
          </Note>
        </div>
      </div>

      <form
        className="lg:col-span-5"
        onSubmit={(event) => {
          event.preventDefault();
          writeConfig(vehicle.slug, config);
          void navigate({ to: "/reserve/$slug", params: { slug: vehicle.slug } });
        }}
      >
        <fieldset>
          <legend className="text-xs tracking-widest text-faint uppercase">Exterior colour · sample</legend>
          <div className="mt-3 space-y-2">
            {vehicle.exteriors.map((choice) => (
              <Swatch
                key={choice.id}
                choice={choice}
                name="exterior"
                checked={config.exteriorId === choice.id}
                onChange={() => setConfig((current) => ({ ...current, exteriorId: choice.id }))}
              />
            ))}
          </div>
        </fieldset>
        <fieldset className="mt-8">
          <legend className="text-xs tracking-widest text-faint uppercase">Interior · sample</legend>
          <div className="mt-3 space-y-2">
            {vehicle.interiors.map((choice) => (
              <Swatch
                key={choice.id}
                choice={choice}
                name="interior"
                checked={config.interiorId === choice.id}
                onChange={() => setConfig((current) => ({ ...current, interiorId: choice.id }))}
              />
            ))}
          </div>
        </fieldset>
        <fieldset className="mt-8">
          <legend className="text-xs tracking-widest text-faint uppercase">Packages · sample</legend>
          <div className="mt-3 space-y-2">
            {vehicle.packages.map((choice) => {
              const checked = config.packageIds.includes(choice.id);
              return (
                <label key={choice.id} className="flex cursor-pointer gap-3 border border-line px-3 py-3">
                  <input
                    type="checkbox"
                    className="mt-1 size-4 accent-champagne"
                    checked={checked}
                    onChange={() =>
                      setConfig((current) => ({
                        ...current,
                        packageIds: checked
                          ? current.packageIds.filter((id) => id !== choice.id)
                          : [...current.packageIds, choice.id],
                      }))
                    }
                  />
                  <span>
                    <span className="block">{choice.name}</span>
                    <span className="block text-sm text-muted">{choice.detail}</span>
                    <span className="mt-1 block text-sm tabular-nums text-champagne-2">+ <Money value={choice.price} /></span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-8 border border-line bg-panel p-5">
          <p className="text-xs tracking-widest text-faint uppercase">Indicative total before tax</p>
          <p className="mt-2 font-display text-5xl">
            <Money value={quote.totalBeforeTax} />
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li className="flex justify-between gap-4"><span>Vehicle</span><Money value={quote.base} /></li>
            <li className="flex justify-between gap-4"><span>Options</span><Money value={quote.options} /></li>
            <li className="flex justify-between gap-4"><span>Delivery estimate</span><Money value={quote.delivery} /></li>
            <li className="flex justify-between gap-4"><span>Registration estimate</span><Money value={quote.registration} /></li>
            <li className="flex justify-between gap-4"><span>Documentation estimate</span><Money value={quote.documentation} /></li>
            <li className="flex justify-between gap-4 text-ivory"><span>Before local tax</span><Money value={quote.totalBeforeTax} /></li>
          </ul>
          <p className="mt-4 text-sm text-faint">
            Local tax is not calculated. These fees are sample estimates, not confirmed QORVEX charges.
          </p>
          <button type="submit" className={`${buttonClass("solid")} mt-6 w-full`}>
            Review reservation
          </button>
        </div>
      </form>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-obsidian/95 px-5 py-3 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs tracking-widest text-faint uppercase">Before tax</p>
            <p className="font-display text-3xl">
              <Money value={quote.totalBeforeTax} />
            </p>
          </div>
          <button
            type="button"
            className={buttonClass("solid")}
            onClick={() => {
              writeConfig(vehicle.slug, config);
              void navigate({ to: "/reserve/$slug", params: { slug: vehicle.slug } });
            }}
          >
            Review
          </button>
        </div>
      </div>
    </div>
  );
}

function Swatch({
  choice,
  name,
  checked,
  onChange,
}: {
  choice: Choice;
  name: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className={cn("flex cursor-pointer items-center gap-3 border px-3 py-3", checked ? "border-champagne" : "border-line")}>
      <input type="radio" name={name} className="sr-only" checked={checked} onChange={onChange} />
      <span className="size-11 shrink-0 border border-line" style={{ background: choice.hex }} aria-hidden />
      <span className="min-w-0">
        <span className="block">{choice.name}</span>
        <span className="block text-sm text-muted">{choice.detail}</span>
      </span>
      <span className="ml-auto text-sm tabular-nums text-champagne-2">
        {choice.price === 0 ? "Included" : <Money value={choice.price} />}
      </span>
    </label>
  );
}
