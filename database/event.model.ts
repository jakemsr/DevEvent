import mongoose, { HydratedDocument, Model, Schema } from "mongoose";

export interface IEvent {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

type EventDocument = HydratedDocument<IEvent>;

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const normalizeDateToIso = (value: string): string => {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Invalid event date format");
  }
  // Persist date in full ISO format for consistency.
  return parsedDate.toISOString();
};

const normalizeTime = (value: string): string => {
  const time = value.trim().toLowerCase();
  const meridiemMatch = time.match(/^(\d{1,2}):(\d{2})\s?(am|pm)$/);
  if (meridiemMatch) {
    const rawHours = Number(meridiemMatch[1]);
    const minutes = Number(meridiemMatch[2]);
    if (rawHours < 1 || rawHours > 12 || minutes > 59) {
      throw new Error("Invalid event time format");
    }

    let hours = rawHours % 12;
    if (meridiemMatch[3] === "pm") {
      hours += 12;
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }

  const twentyFourHourMatch = time.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFourHourMatch) {
    const hours = Number(twentyFourHourMatch[1]);
    const minutes = Number(twentyFourHourMatch[2]);
    if (hours > 23 || minutes > 59) {
      throw new Error("Invalid event time format");
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }

  throw new Error("Invalid event time format");
};

const assertNonEmptyString = (field: keyof IEvent, value: string): void => {
  if (!value || !value.trim()) {
    throw new Error(`${String(field)} is required`);
  }
};

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (items: string[]) => Array.isArray(items) && items.length > 0,
        message: "agenda must contain at least one item",
      },
    },
    organizer: { type: String, required: true, trim: true },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (items: string[]) => Array.isArray(items) && items.length > 0,
        message: "tags must contain at least one item",
      },
    },
  },
  { timestamps: true }
);

eventSchema.index({ slug: 1 }, { unique: true });

eventSchema.pre("save", async function () {
  // Ensure all required text fields are present and non-empty.
  assertNonEmptyString("title", this.title);
  assertNonEmptyString("description", this.description);
  assertNonEmptyString("overview", this.overview);
  assertNonEmptyString("image", this.image);
  assertNonEmptyString("venue", this.venue);
  assertNonEmptyString("location", this.location);
  assertNonEmptyString("date", this.date);
  assertNonEmptyString("time", this.time);
  assertNonEmptyString("mode", this.mode);
  assertNonEmptyString("audience", this.audience);
  assertNonEmptyString("organizer", this.organizer);

  if (this.agenda.some((item) => !item || !item.trim())) {
    throw new Error("agenda cannot contain empty values");
  }

  if (this.tags.some((item) => !item || !item.trim())) {
    throw new Error("tags cannot contain empty values");
  }

  // Only regenerate slug when the title changes.
  if (this.isModified("title")) {
    this.slug = slugify(this.title);
  }

  // Normalize date/time before persisting.
  if (this.isModified("date")) {
    this.date = normalizeDateToIso(this.date);
  }
  if (this.isModified("time")) {
    this.time = normalizeTime(this.time);
  }
});

const Event: Model<IEvent> =
  (mongoose.models.Event as Model<IEvent>) ||
  mongoose.model<IEvent>("Event", eventSchema);

export default Event;
export type { EventDocument };
