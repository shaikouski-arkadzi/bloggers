import { db } from "../../db";
import { SessionModel } from "../types";
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
  async deleteSession(iat: string): Promise<void> {
    await db.getCollections().sessionsCollection.deleteOne({
      iat: Number(iat),
    });
  },
};
