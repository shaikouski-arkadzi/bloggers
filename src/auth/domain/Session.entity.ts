import { Types } from "mongoose";
import { SessionDocument, SessionModel } from "../db/session.model";
import { Session } from "../types";

export class SessionEntity {
  static createSession(sessionInput: Session): SessionDocument {
    const session = new SessionModel(sessionInput);

    session.deviceId = new Types.ObjectId(session.deviceId);
    session.userId = new Types.ObjectId(session.userId);

    return session;
  }
}
