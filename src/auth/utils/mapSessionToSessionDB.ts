import { ObjectId } from "mongodb";
import { SessionModel, SessionsDB } from "../types";

export const mapSessionToSessionDB = (session: SessionModel): SessionsDB => ({
  deviceId: new ObjectId(session.deviceId),
  deviceName: session.deviceName,
  iat: session.iat,
  ip: session.ip,
  userId: new ObjectId(session.userId),
});
