import { ObjectId } from "mongodb";
import { db } from "../../db";
import { PostDb, UpdatedPost } from "../types";

export const postsCommandRepository = {
  async create(post: PostDb): Promise<ObjectId> {
    const result = await db.getCollections().postsCollection.insertOne(post);

    return result.insertedId;
  },

  async update(id: string, post: UpdatedPost): Promise<void> {
    await db.getCollections().postsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: post,
      },
    );
  },

  async delete(id: string): Promise<void> {
    await db
      .getCollections()
      .postsCollection.deleteOne({ _id: new ObjectId(id) });
  },
};
