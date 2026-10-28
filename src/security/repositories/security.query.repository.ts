import { Types } from "mongoose";
import { injectable } from "inversify";
import { SessionModel } from "../../auth/db/session.model";
import { mapSessionsDBToDevice } from "../utils";
import { DeviceViewModel } from "../types";

@injectable()
export class SecurityQueryRepository {
  async getUserDevices(userId: string): Promise<DeviceViewModel[] | null> {
    const result = await SessionModel.find({
      userId: new Types.ObjectId(userId),
    });

    if (!result) {
      return null;
    }

    return result.map(mapSessionsDBToDevice);
  }
}
