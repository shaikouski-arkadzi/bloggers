import { Types } from "mongoose";
import { injectable } from "inversify";
import { SessionModel } from "../db/session.model";
import { Session } from "../types";
import { mapSessionToSessionDB } from "../utils";

@injectable()
export class AuthCommandRepository {
  async save(session: Session): Promise<string> {
    const sessionDB = mapSessionToSessionDB(session);

    const sessionModel = new SessionModel(sessionDB);

    const savedSession = await sessionModel.save();

    return savedSession._id.toString();
  }

  async deleteSessionByIATAndDeviceId(
    iat: string,
    deviceId: string,
  ): Promise<void> {
    await SessionModel.deleteOne({
      iat: Number(iat),
      deviceId: new Types.ObjectId(deviceId),
    });
  }

  async deleteSessionByDeviceId(deviceId: string): Promise<void> {
    await SessionModel.deleteOne({
      deviceId: new Types.ObjectId(deviceId),
    });
  }
}
