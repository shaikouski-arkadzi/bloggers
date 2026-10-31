import { Types } from "mongoose";
import { Session, SessionsDB } from "../types";

export const mapSessionToSessionDB = (session: Session): SessionsDB => ({
  deviceId: new Types.ObjectId(session.deviceId),
  deviceName: session.deviceName,
  iat: session.iat,
  ip: session.ip,
  userId: new Types.ObjectId(session.userId),
});
