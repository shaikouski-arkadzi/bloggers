import { Types } from "mongoose";
import { injectable } from "inversify";
import { SessionModel } from "../db/session.model";
import { UserModel } from "../../users/db/user.model";
import { Session, SessionsDB } from "../types";
import { UserDb } from "../../users/types";
import { mapSessionToSessionDB } from "../utils";

@injectable()
export class AuthCommandRepository {
  async getUserAuthCode(
    email: string,
  ): Promise<(UserDb & { _id: Types.ObjectId }) | null> {
    const result = await UserModel.findOne({ email });

    if (!result) {
      return null;
    }

    return result;
  }

  async getUserByConfirmaionCode(
    code: string,
  ): Promise<(UserDb & { _id: Types.ObjectId }) | null> {
    const result = await UserModel.findOne({ confirmaionCode: code });

    if (!result) {
      return null;
    }

    return result;
  }

  async getUserByRecoveryCode(
    code: string,
  ): Promise<(UserDb & { _id: Types.ObjectId }) | null> {
    const result = await UserModel.findOne({ recoveryCode: code });

    if (!result) {
      return null;
    }

    return result;
  }

  async save(session: Session): Promise<string> {
    const sessionDB = mapSessionToSessionDB(session);

    const sessionModel = new SessionModel(sessionDB);

    const savedSession = await sessionModel.save();

    return savedSession._id.toString();
  }

  async update(session: any): Promise<string> {
    const savedSession = await session.save();

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

  async getSessionByDeviceId(deviceId: string): Promise<SessionsDB | null> {
    const result = await SessionModel.findOne({
      deviceId: new Types.ObjectId(deviceId),
    });

    if (!result) {
      return null;
    }

    return result;
  }

  async getSessionsByUserId(userId: string): Promise<SessionsDB[] | null> {
    const result = await SessionModel.find({
      userId: new Types.ObjectId(userId),
    });

    if (!result.length) {
      return null;
    }

    return result;
  }
}
