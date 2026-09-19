import { ObjectId } from "mongodb";
import { SessionModel, SessionsDBCollection } from "../types";

export const mapSessionToSessionDB = (
  session: SessionModel,
): SessionsDBCollection => ({
  deviceId: new ObjectId(session.deviceId),
  deviceName: session.deviceName,
  iat: session.iat,
  ip: session.ip,
  userId: new ObjectId(session.userId),
});
