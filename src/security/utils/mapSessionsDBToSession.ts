import { SessionsDBCollection } from "../../auth/types";
import { timestampToIso } from "../../common/utils/dates";
import { DeviceViewModel } from "../types";

export const mapSessionsDBToDevice = (
  sessionDB: SessionsDBCollection,
): DeviceViewModel => ({
  deviceId: sessionDB.deviceId.toString(),
  title: sessionDB.deviceName,
  lastActiveDate: timestampToIso(sessionDB.iat),
  ip: sessionDB.ip,
});
