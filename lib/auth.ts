
import mongoose from "mongoose";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import connectToDatabase from "@/lib/mongodb"

connectToDatabase();

// Extract the native db and client from the mongoose instance
const client = mongoose.connection.getClient();
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
      strategy: "compact",
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
      mapProfileToUser: (profile) => {
        return {
          firstName: profile.name.split(" ")[0],
          lastName: profile.name.split(" ")[1],
        };
      },
    },
  },
  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: true,
        defaultValue: "",
        input: true,
      },
      lastName: {
        type: "string",
        required: true,
        defaultValue: "",
        input: true,
      },
      role: {
        type: ["user", "creator", "admin"],
        required: true,
        defaultValue: "user",
        input: false,  // don't allow user to set role
      },
    },
  },
});
