import { Types } from "mongoose";
import { injectable } from "inversify";
import { SessionDocument, SessionModel } from "../db/session.model";
import { UserModel } from "../../users/db/user.model";
import { SessionsDB } from "../types";
import { UserDb } from "../../users/types";

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

  async save(session: SessionDocument): Promise<string> {
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

  async getSessionByDeviceId(
    deviceId: string,
  ): Promise<SessionDocument | null> {
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
