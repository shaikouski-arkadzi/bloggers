import { db } from "../../db";
import { mapSessionsDBToSession, mapUserDbToAuth } from "../utils";
import { IAuthCode, SessionModel } from "../types";
import { ObjectId } from "mongodb";

export const authQueryRepository = {
  async getUserAuthCode(email: string): Promise<IAuthCode | null> {
    const result = await db.getCollections().usersCollection.findOne({ email });

    if (!result) {
      return null;
    }

    return mapUserDbToAuth(result);
  },
  async getUserByCode(code: string): Promise<IAuthCode | null> {
    const result = await db
      .getCollections()
      .usersCollection.findOne({ confirmaionCode: code });

    if (!result) {
      return null;
    }

    return mapUserDbToAuth(result);
  },
  async getSessionByIAT(iat: number): Promise<SessionModel | null> {
    const result = await db
      .getCollections()
      .sessionsCollection.findOne({ iat });

    if (!result) {
      return null;
    }

    return mapSessionsDBToSession(result);
  },
  async getSessionByDeviceId(deviceId: string): Promise<SessionModel | null> {
    const result = await db
      .getCollections()
      .sessionsCollection.findOne({ deviceId: new ObjectId(deviceId) });

    if (!result) {
      return null;
    }

    return mapSessionsDBToSession(result);
  },
};
