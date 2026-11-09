import { createFileRoute } from "@tanstack/react-router";
import { Legal } from "@/components/legal";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms — QORVEX" }] }),
  component: () => (
    <Legal title="Terms">
      <p>
        Using this preview does not create a contract to buy a car. Indicative prices, sample colours, sample
        packages, and sample delivery, registration and documentation figures are illustrations. They are not an
        offer, an invoice, or a confirmed fee.
      </p>
      <p>
        Specifications labelled on the V9 and V09 as power, torque, top speed, range, battery and suspension follow
        the model sheet used to build this site. The X-T is described as a V8 diesel 6×6. AWK Soul is described as a
        supercharged V12 hypercar. Figures that were not in that sheet are not filled in.
      </p>
      <p>
        A reservation starts a 24-hour waiting period measured from the server time returned when you submit. Until
        that period ends, demonstration checkout stays closed. After it ends, checkout only records a demonstration.
        No payment is collected, and no factory build slot is promised.
      </p>
      <p>
        Photographs remain the reference studies supplied with the site. A swatch that is not the photographed finish
        does not represent a manufactured colour that QORVEX has confirmed.
      </p>
    </Legal>
  ),
});
