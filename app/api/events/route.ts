import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { File } from "buffer";
import { v2 as cloudinary } from 'cloudinary';
import { Event } from "@/database";
import connectToDatabase from "@/lib/mongodb";
import { auth } from "@/lib/auth";


export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || !session.user) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized' }), 
                    { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (session.user.role !== 'admin' && session.user.role !== 'creator') {
            return new Response(
                JSON.stringify({ error: 'Forbidden: Admins only' }), 
                    { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        await connectToDatabase();
        const formData = await req.formData();

        let event;

        try {
            event = Object.fromEntries(formData.entries());
        } catch (e) {
            return NextResponse.json({ message: 'Invalid JSON data format'}, { status: 400});
        }

        const file = (formData.get('image') as unknown) as File;
        if (!file) return NextResponse.json({ message: "Image file is required" }, { status: 400 });       

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'events'}, (error, results) => {
                if (error) return reject(error);

                resolve(results)
            }).end(buffer);
        });

        event.image = (uploadResult as { secure_url: string }).secure_url;

        let tags = JSON.parse(formData.get('tags') as string);
        let agenda = JSON.parse(formData.get('agenda') as string);

        const createdEvent = await Event.create({
            ...event,
            tags: tags,
            agenda: agenda,
        });

        return NextResponse.json({ message: 'Event created successfully', event: createdEvent}, { status: 201 });
    } catch(e) {
        console.error(e);
        return NextResponse.json({ message: 'Event Creation Failed', error: e instanceof Error? e.message : 'Unknown'}, { status: 500});
    }
}

export async function GET() {
    try {
        await connectToDatabase();

        const events = await Event.find().sort({ createdAt: -1 });

        return NextResponse.json({ message: "Events fetched successfully", events }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: "Event fetching failed", error: e }, { status: 500 });
    }

}