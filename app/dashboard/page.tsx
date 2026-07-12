import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getBookingsByEmail } from "@/lib/actions/booking.actions";
import { Event } from "@/database";
import { IEvent } from "@/database/event.model";
import { Link } from "lucide-react";


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
                  <li key={index}>{event.date} | {event.title}</li>
                ))}
              </ul>
            ) : (
              <p>No bookings found</p>
            )}
          </div>

          {session.user.role === "creator" || session.user.role === "admin" && (
            <div className="col-span-4">
              <Link href="/create-event" className="bg-primary hover:bg-primary/90 cursor-pointer items-center justify-center rounded-[6px] px-2 py-1 font-semibold text-black">
                Create Event
              </Link>
            </div>
          )}

        </div>

      ) : (
        <p>Please sign in to view your dashboard</p>
      )}

    </section>
  );
}
