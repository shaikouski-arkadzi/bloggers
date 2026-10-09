import { ObjectId } from "mongodb";
import { injectable } from "inversify";
import { db } from "../../db";
import { mapSessionsDBToDevice } from "../utils";
import { DeviceViewModel } from "../types";

@injectable()
export class SecurityQueryRepository {
  async getUserDevices(userId: string): Promise<DeviceViewModel[] | null> {
    const result = await db
      .getCollections()
      .sessionsCollection.find({ userId: new ObjectId(userId) })
      .toArray();

    if (!result) {
      return null;
    }

    return result.map(mapSessionsDBToDevice);
  }
}
