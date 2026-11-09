import { createFileRoute } from "@tanstack/react-router";
import { Legal } from "@/components/legal";

export const Route = createFileRoute("/refund")({
  head: () => ({ meta: [{ title: "Refunds — QORVEX" }] }),
  component: () => (
    <Legal title="Refunds">
      <p>
        This website does not collect deposits, cards, or transfers. A demonstration checkout that says “recorded” has
        not received money. There is nothing for this preview to refund.
      </p>
      <p>
        Sample delivery, registration, documentation and vehicle prices are not charges. If a later, real QORVEX sale
        takes a deposit, the refund rule has to be the one in that sale’s reviewed terms — not this page.
      </p>
      <p>
        If you typed card details anywhere despite the warning, treat them as exposed and contact your bank. The form
        is not a payment field and is not a secure card vault.
      </p>
    </Legal>
  ),
});
