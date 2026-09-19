import { SessionsDBCollection, SessionModel } from "../types";

export const mapSessionsDBToSession = (
  sessionDB: SessionsDBCollection,
): SessionModel => ({
  deviceId: sessionDB.deviceId.toString(),
  userId: sessionDB.userId.toString(),
  deviceName: sessionDB.deviceName,
  iat: sessionDB.iat,
  ip: sessionDB.ip,
});
