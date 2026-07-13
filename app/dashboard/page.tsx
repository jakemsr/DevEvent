import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getBookingsByEmail } from "@/lib/actions/booking.actions";
import { Event } from "@/database";
import { IEvent } from "@/database/event.model";


export default async function DashboardPage() {

  const session = await auth.api.getSession({
    headers: await headers()
  })

  let events: IEvent[] = [];

  if (session?.user?.email) {
    const { success, exists, bookings: fetchedBookings } = await getBookingsByEmail({ email: session.user.email });
    if (success && exists) {
      for (const booking of fetchedBookings) {
        const event = await Event.findById(booking.eventId);
        if (event) {
          events.push(event);
        }
      }
      events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }

  interface Actions {
    page: string;
    text: string;
  }

  let actions: Actions[] = [];
  if (session?.user?.role === "creator" || session?.user?.role === "admin") {
    actions.push({ page: "/create-event", text: "Create Event" });
  }
  if (session?.user?.role === "admin") {
    actions.push({ page: "/admin", text: "Admin Panel" });
  }


  return (
    <section id="dashboard">
      <h1 className="mb-8">Dashboard</h1>

      {session ? (

        <div className="grid grid-cols-4 gap-4">

          <div className="font-bold col-span-1">
            Name
          </div>
          <div className="col-span-3">
            {session.user.firstName} {session.user.lastName}
          </div>

          <div className="font-bold col-span-1">
            Email
          </div>
          <div className="col-span-3">
            {session.user.email}
          </div>

          <div className="font-bold col-span-1">
            Bookings
          </div>
          <div className="col-span-3">
            {events.length > 0 ? (
              <ul>
                {events.map((event, index) => (
                  <li key={index}>
                    {event.date} | <Link href={`/events/${event.slug}`}>{event.title}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No bookings found</p>
            )}
          </div>

          <div className="font-bold col-span-1">
            Actions
          </div>
          <div className="col-span-3">
            {actions.length > 0 ? (
              <ul>
                {actions.map((action, index) => (
                  <li key={index}>
                    <Link href={action.page}>{action.text}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No actions available</p>
            )}
          </div>

        </div>

      ) : (
        <p>Please sign in to view your dashboard</p>
      )}

    </section>
  );
}
