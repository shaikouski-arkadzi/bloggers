import { MongoClient } from "mongodb";
import { MONGO_URI } from "../settings/config";
import { Blog } from "../blogs/types";
import { Post } from "../posts/types";

if (!MONGO_URI) console.error("Not found mongo uri");

const client = new MongoClient(MONGO_URI!);

export const database = client.db();

export const blogsCollection = database.collection<Blog>("blogs");

export const postsCollection = database.collection<Post>("posts");

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
