import { Db, MongoClient } from "mongodb";
import { MONGO_URI } from "../settings/config";
import { BlogDb } from "../blogs/types";
import { PostDb } from "../posts/types";

if (!MONGO_URI) console.error("Not found mongo uri");

export const db = {
  client: {} as MongoClient,

  getDbName(): Db {
    return this.client.db();
  },

  async connect(url: string = MONGO_URI!): Promise<boolean> {
    try {
      this.client = new MongoClient(url);
      await this.client.connect();
      console.log("Connected successfully to mongo server");
      return true;
    } catch (e: unknown) {
      console.error("Can't connect to mongo server", e);
      await this.client.close();
      return false;
    }
  },

  async disconnect() {
    await this.client.close();
    console.log("Connection successful closed");
  },

  getCollections() {
    return {
      blogsCollection: this.getDbName().collection<BlogDb>("blogs"),
      postsCollection: this.getDbName().collection<PostDb>("posts"),
    };
  },
};
