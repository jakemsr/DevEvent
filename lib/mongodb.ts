import mongoose, { ConnectOptions, Mongoose } from "mongoose";

const MONGODB_URI = (() => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Missing environment variable: MONGODB_URI");
  }

  return uri;
})();

type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

// Reuse the cached connection across hot reloads in development.
const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<Mongoose> {
  // Return an existing connection immediately when available.
  if (cached.conn) {
    return cached.conn;
  }

  // Create a single in-flight connection promise to avoid duplicate connects.
  if (!cached.promise) {
    const options: ConnectOptions = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, options);
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // Reset promise so future calls can retry after a failed attempt.
    cached.promise = null;
    throw error;
  }
}

export default connectToDatabase;
