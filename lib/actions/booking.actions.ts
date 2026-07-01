'use server';

import { Booking } from "@/database";
import connectToDatabase from "../mongodb";
import { error } from "console";

export const createBooking = async ({ eventId, slug, email }: { eventId: string, slug: string, email: string }) => {
    try {
        await connectToDatabase();
        await Booking.create({ eventId, slug, email });

        return { success: true };
    } catch (e) {
        console.error('create booking failed', e);
        return { success: false };
    }
}

export const getBookingsCount = async ({ eventId }: { eventId: string }) => {
    try {
        await connectToDatabase();
        const count = await Booking.countDocuments({ eventId });
        return { success: true, count };
    } catch (e) {
        console.error('get bookings count failed', e);
        return { success: false, count: 0 };
    }
}

export const checkBookingByEmail = async ({ eventId, email }: { eventId: string, email: string }) => {
    try {
        await connectToDatabase();
        const booking = await Booking.findOne({ eventId, email });
        return { success: true, exists: !!booking };
    } catch (e) {
        console.error('check booking by email failed', e);
        return { success: false, exists: false };
    }
}
