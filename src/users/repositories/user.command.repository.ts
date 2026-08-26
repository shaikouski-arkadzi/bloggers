import { ObjectId } from "mongodb";
import { db } from "../../db";
import { UserDb } from "../types";

export const userCommandRepository = {
  async create(user: Omit<UserDb, "_id">): Promise<ObjectId> {
    const result = await db.getCollections().usersCollection.insertOne(user);
    return result.insertedId;
  },
  async delete(id: string): Promise<number> {
    const result = await db
      .getCollections()
      .usersCollection.deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount;
  },
};
