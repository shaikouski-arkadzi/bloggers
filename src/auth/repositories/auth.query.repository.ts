import { Types } from "mongoose";
import { injectable } from "inversify";
import { mapSessionsDBToSession, mapUserDbToAuth } from "../utils";
import { Session } from "../types";
import { SessionModel } from "../db/session.model";

@injectable()
export class AuthQueryRepository {
  async getSessionByIATAndDeviceId(
    iat: number,
    deviceId: string,
  ): Promise<Session | null> {
    const result = await SessionModel.findOne({
      iat,
      deviceId: new Types.ObjectId(deviceId),
    });

    if (!result) {
      return null;
    }

    return mapSessionsDBToSession(result);
  }
}
