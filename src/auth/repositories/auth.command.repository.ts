import { ObjectId } from "mongodb";
import { db } from "../../db";
import { RefreshTokensDBCollection } from "../types";

export const authCommandRepository = {
  async create(tokenModel: RefreshTokensDBCollection): Promise<ObjectId> {
    const result = await db
      .getCollections()
      .refreshTokensCollection.insertOne(tokenModel);
    return result.insertedId;
  },
  async update(
    id: string,
    tokenModel: RefreshTokensDBCollection,
  ): Promise<void> {
    await db.getCollections().refreshTokensCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: tokenModel,
      },
    );
  },
};
