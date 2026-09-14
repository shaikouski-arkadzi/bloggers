import { ObjectId } from "mongodb";
import { db } from "../../db";
import { BlogDb, BlogInputDto } from "../types";

export const blogsCommandRepository = {
  async create(blog: BlogDb): Promise<ObjectId> {
    const result = await db.getCollections().blogsCollection.insertOne(blog);

    return result.insertedId;
  },

  async update(id: string, blog: BlogInputDto): Promise<void> {
    await db.getCollections().blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: blog,
      },
    );
  },

  async delete(id: string): Promise<void> {
    await db
      .getCollections()
      .blogsCollection.deleteOne({ _id: new ObjectId(id) });
  },
};
