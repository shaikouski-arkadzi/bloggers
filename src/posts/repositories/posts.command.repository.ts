import { ObjectId } from "mongodb";
import { db } from "../../db";
import { PostDb, UpdatedPost } from "../types";

export const postsCommandRepository = {
  async create(post: PostDb): Promise<boolean> {
    await db.getCollections().postsCollection.insertOne(post);

    return true;
  },

  async update(id: ObjectId, post: UpdatedPost): Promise<number> {
    const result = await db.getCollections().postsCollection.updateOne(
      { _id: id },
      {
        $set: post,
      },
    );

    return result.matchedCount;
  },

  async delete(id: string): Promise<boolean> {
    const result = await db
      .getCollections()
      .postsCollection.deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount === 1;
  },
};
