import { ObjectId } from "mongodb";
import { db } from "../../db";
import { RefreshTokensDBCollection, SessionModel } from "../types";
import { mapSessionToSessionDB } from "../utils";

export const authCommandRepository = {
  async createSession(session: SessionModel): Promise<void> {
    const sessionDB = mapSessionToSessionDB(session);

    await db.getCollections().sessionsCollection.insertOne(sessionDB);
  },
  async updateSession(session: SessionModel): Promise<void> {
    const sessionDB = mapSessionToSessionDB(session);

    await db
      .getCollections()
      .sessionsCollection.updateOne(
        { deviceId: sessionDB.deviceId, userId: sessionDB.userId },
        { $set: sessionDB },
      );
  },
  async deleteSession(userId: string, deviceId: string): Promise<void> {
    await db.getCollections().sessionsCollection.deleteOne({
      deviceId: new ObjectId(deviceId),
      userId: new ObjectId(userId),
    });
  },
};
