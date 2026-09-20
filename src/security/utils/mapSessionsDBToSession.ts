import { SessionsDBCollection } from "../../auth/types";
import { DeviceViewModel } from "../types";

export const mapSessionsDBToDevice = (
  sessionDB: SessionsDBCollection,
): DeviceViewModel => ({
  deviceId: sessionDB.deviceId.toString(),
  title: sessionDB.deviceName,
  lastActiveDate: sessionDB.iat.toString(),
  ip: sessionDB.ip,
});
