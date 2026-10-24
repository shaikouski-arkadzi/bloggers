import { Session, SessionsDB } from "../types";

export const mapSessionsDBToSession = (sessionDB: SessionsDB): Session => ({
  deviceId: sessionDB.deviceId.toString(),
  userId: sessionDB.userId.toString(),
  deviceName: sessionDB.deviceName,
  iat: sessionDB.iat,
  ip: sessionDB.ip,
});
