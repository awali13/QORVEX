import { createFileRoute } from "@tanstack/react-router";
import { Legal } from "@/components/legal";

export const Route = createFileRoute("/cancellation")({
  head: () => ({ meta: [{ title: "Cancellation — QORVEX" }] }),
  component: () => (
    <Legal title="Cancellation">
      <p>
        During the 24-hour hold you can cancel from the reservation page. Cancellation deletes the reservation from
        this browser and attempts a WhatsApp update if the Business Platform is configured. Because no money is taken,
        cancellation does not create a refund.
      </p>
      <p>
        After the hold, you can remove a demonstration record from this device. That does not unwind a purchase,
        because this preview never makes one.
      </p>
      <p>
        A future QORVEX contract would need its own cancellation window, written in the currency and law of the sale.
        This page is not that contract.
      </p>
    </Legal>
  ),
});
