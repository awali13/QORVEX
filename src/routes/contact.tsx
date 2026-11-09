import { createFileRoute, Link } from "@tanstack/react-router";
import { EnquiryDesk } from "@/components/enquiry-desk";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — QORVEX" }] }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <EnquiryDesk
        heading="Contact."
        lede="There is no public studio address in the material supplied for this site. Use the form. The sample inbox below is for the preview only and is not a monitored QORVEX mailbox."
      />
      <div className="mx-auto -mt-10 max-w-7xl px-5 pb-16 text-sm text-muted">
        <p>Sample preview inbox: enquiries@qorvex.example</p>
        <p className="mt-2">Sample preview phone: +1 000 000 0190 — not a live line.</p>
        <p className="mt-4">
          Reservations already started live under <Link to="/reservations" className="text-champagne-2">Your reservations</Link>.
          Policies: <Link to="/privacy" className="text-champagne-2">Privacy</Link>,{" "}
          <Link to="/terms" className="text-champagne-2">Terms</Link>.
        </p>
      </div>
    </>
  );
}
