import { MongoClient } from "mongodb";
import { MONGO_URI } from "../settings/config";
import { BlogDb } from "../blogs/types";
import { PostDb } from "../posts/types";

if (!MONGO_URI) console.error("Not found mongo uri");

const client = new MongoClient(MONGO_URI!);

export const database = client.db();

export const blogsCollection = database.collection<BlogDb>("blogs");

export const postsCollection = database.collection<PostDb>("posts");

export async function connectToDb(): Promise<boolean> {
  try {
    await client.connect();

    console.log("Connected to MongoDB");

    return true;
  } catch (e) {
    console.error("Failed to connect to MongoDB", e);

    await client.close();

    return false;
  }
}

export async function disconnectFromDb(): Promise<void> {
  try {
    await client.close();

    console.log("Disconnected from MongoDB");
  } catch (e) {
    console.error("Failed to disconnect from MongoDB", e);
  }
}
