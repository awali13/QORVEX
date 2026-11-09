import { createFileRoute } from "@tanstack/react-router";
import { EnquiryDesk } from "@/components/enquiry-desk";

export const Route = createFileRoute("/enquiries")({
  head: () => ({ meta: [{ title: "Enquiries — QORVEX" }] }),
  component: () => (
    <EnquiryDesk
      heading="Ask the house."
      lede="Questions about a model, a reservation, or ownership. This desk does not start the 24-hour hold — use Reserve on the car for that."
    />
  ),
});
