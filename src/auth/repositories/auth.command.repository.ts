import { ObjectId } from "mongodb";
import { db } from "../../db";
import { RefreshTokensDBCollection, SessionModel } from "../types";
import { mapSessionToSessionDB } from "../utils";

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
  async createSession(session: SessionModel): Promise<void> {
    const sessionDB = mapSessionToSessionDB(session);

    await db.getCollections().sessionsCollection.insertOne(sessionDB);
  },
};
