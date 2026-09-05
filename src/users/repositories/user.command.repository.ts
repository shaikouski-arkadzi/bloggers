import { ObjectId } from "mongodb";
import { db } from "../../db";
import { UserDb } from "../types";

export const userCommandRepository = {
  async create(user: UserDb): Promise<ObjectId> {
    const result = await db.getCollections().usersCollection.insertOne(user);
    return result.insertedId;
  },
  async delete(id: string): Promise<void> {
    await db
      .getCollections()
      .usersCollection.deleteOne({ _id: new ObjectId(id) });
  },
};
