import { Types } from "mongoose";
import { injectable } from "inversify";
import { mapSessionsDBToSession, mapUserDbToAuth } from "../utils";
import { IAuthCode, Session } from "../types";
import { UserModel } from "../../users/db/user.model";
import { SessionModel } from "../db/session.model";

@injectable()
export class AuthQueryRepository {
  async getUserAuthCode(email: string): Promise<IAuthCode | null> {
    const result = await UserModel.findOne({ email });

    if (!result) {
      return null;
    }

    return mapUserDbToAuth(result);
  }

  async getUserByConfirmaionCode(code: string): Promise<IAuthCode | null> {
    const result = await UserModel.findOne({ confirmaionCode: code });

    if (!result) {
      return null;
    }

    return mapUserDbToAuth(result);
  }

  async getUserByRecoveryCode(code: string): Promise<IAuthCode | null> {
    const result = await UserModel.findOne({ recoveryCode: code });

    if (!result) {
      return null;
    }

    return mapUserDbToAuth(result);
  }

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

  async getSessionByDeviceId(deviceId: string): Promise<Session | null> {
    const result = await SessionModel.findOne({
      deviceId: new Types.ObjectId(deviceId),
    });

    if (!result) {
      return null;
    }

    return mapSessionsDBToSession(result);
  }

  async getSessionsByUserId(userId: string): Promise<Session[] | null> {
    const result = await SessionModel.find({
      userId: new Types.ObjectId(userId),
    });

    if (!result.length) {
      return null;
    }

    return result.map(mapSessionsDBToSession);
  }
}
