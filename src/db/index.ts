import mongoose from "mongoose";
import { MONGO_URI } from "../settings/config";

if (!MONGO_URI) console.error("Not found mongo uri");

export const db = {
  async connect(url: string | undefined = MONGO_URI): Promise<boolean> {
    if (!url) {
      console.error("Not found mongo uri");
      return false;
    }

    try {
      await mongoose.connect(url);

      console.log("Connected successfully to mongo server");
      return true;
    } catch (error: unknown) {
      console.error("Can't connect to mongo server", error);
      return false;
    }
  },

  async disconnect(): Promise<void> {
    await mongoose.disconnect();

    console.log("Connection successfully closed");
  },
};
