import { ObjectId } from "mongodb";
import { db } from "../../db";
import { BlogDb, BlogInputDto } from "../types";

export const blogsCommandRepository = {
  async create(blog: BlogDb): Promise<void> {
    await db.getCollections().blogsCollection.insertOne(blog);
  },

  async update(id: ObjectId, blog: BlogInputDto): Promise<number> {
    const result = await db.getCollections().blogsCollection.updateOne(
      { _id: id },
      {
        $set: blog,
      },
    );

    return result.matchedCount;
  },

  async delete(id: string): Promise<number> {
    const result = await db
      .getCollections()
      .blogsCollection.deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount;
  },
};
