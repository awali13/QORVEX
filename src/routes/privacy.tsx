import { createFileRoute } from "@tanstack/react-router";
import { Legal } from "@/components/legal";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy — QORVEX" }] }),
  component: () => (
    <Legal title="Privacy">
      <p>
        This preview keeps reservations and enquiries in your browser (local storage). They are not written to a
        shared database. Another person on another device cannot see them. Clearing the browser removes them.
      </p>
      <p>
        When you submit a reservation, cancellation, purchase-stage event, or enquiry, the details you typed are sent
        to the site server so it can try a WhatsApp Business message to a single house number. That number is set
        with server environment variables and is never chosen by the page. If those variables are missing, the server
        returns without sending anything.
      </p>
      <p>
        The server is not designed to store that message. Do not type card numbers, identity documents, or passwords
        into any field. This preview does not ask for them.
      </p>
      <p>
        Sample contact addresses published on the contact page are not live inboxes. Do not send sensitive information
        to enquiries@qorvex.example.
      </p>
    </Legal>
  ),
});
