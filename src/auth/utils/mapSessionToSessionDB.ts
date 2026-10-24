import { ObjectId } from "mongodb";
import { Session, SessionsDB } from "../types";

export const mapSessionToSessionDB = (session: Session): SessionsDB => ({
  deviceId: new ObjectId(session.deviceId),
  deviceName: session.deviceName,
  iat: session.iat,
  ip: session.ip,
  userId: new ObjectId(session.userId),
});
