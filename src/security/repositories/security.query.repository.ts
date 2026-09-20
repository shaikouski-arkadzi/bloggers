import { ObjectId } from "mongodb";
import { db } from "../../db";
import { mapSessionsDBToDevice } from "../utils";
import { DeviceViewModel } from "../types";

export const securityQueryRepository = {
  async getUserDevices(userId: string): Promise<DeviceViewModel[] | null> {
    const result = await db
      .getCollections()
      .sessionsCollection.find({ userId: new ObjectId(userId) })
      .toArray();

    if (!result) {
      return null;
    }

    return result.map(mapSessionsDBToDevice);
  },
};
