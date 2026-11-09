import { createFileRoute, Link } from "@tanstack/react-router";
import { Kicker } from "@/components/site";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "The House — QORVEX" }] }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <article>
      <div className="bg-ink pt-16">
        <img
          src={`${import.meta.env.BASE_URL}vehicles/xt-front.jpg`}
          alt="QORVEX X-T on a mountain road, used as the house portrait."
          className="h-[58svh] w-full object-cover object-center"
        />
      </div>
      <div className="mx-auto max-w-3xl px-5 py-16">
        <Kicker>The House</Kicker>
        <h1 className="mt-3 font-display text-6xl">Born to Lead.</h1>
        <div className="mt-8 space-y-5 text-muted">
          <p>
            QORVEX is a short line of automobiles: the V9 electric grand tourer, the V09 electric grand SUV, the X-T
            six-wheel diesel, and AWK Soul, a supercharged V12 hypercar. The point is not a ladder of trims. Each car
            has a job.
          </p>
          <p>
            V9 and V09 share a hydraulic fully active suspension and a battery-electric drivetrain, with different
            bodies and different outputs. The X-T does not follow them. It keeps a V8 diesel and six wheels because
            the work is different. AWK Soul does not follow them either. It is a circuit hypercar, not a softened
            version of the coupe.
          </p>
          <p>
            The photographs on this site are the supplied studies. Wide boards are shown whole. Colours you can select
            in the configurator are labelled as samples when they are not the finish in the photograph. Prices are
            indicative estimates in US dollars. They are not a quote.
          </p>
          <p>
            A reservation on this website holds a configuration for 24 hours in your browser, then opens a
            demonstration checkout. The demonstration does not take payment. WhatsApp alerts to the house are sent
            only when the WhatsApp Business Platform is configured on the server.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/collection" className="inline-flex min-h-11 items-center bg-ivory px-5 text-xs tracking-widest text-obsidian uppercase">
            The collection
          </Link>
          <Link to="/enquiries" className="inline-flex min-h-11 items-center border border-ivory/30 px-5 text-xs tracking-widest uppercase">
            Enquire
          </Link>
        </div>
      </div>
    </article>
  );
}
