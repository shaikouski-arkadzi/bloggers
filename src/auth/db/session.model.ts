import { HydratedDocument, Model, model } from "mongoose";
import { SessionsDB } from "../types";
import { sessionSchema } from "./session.schema";
import { SessionEntity } from "../domain/Session.entity";

export interface SessionMethods {
  updateIAT(newIAT: number): void;
}

type SessionStatics = typeof SessionEntity;

export type TBlogModel = Model<SessionsDB, {}, SessionMethods> & SessionStatics;

export type SessionDocument = HydratedDocument<SessionsDB, SessionMethods>;

sessionSchema.loadClass(SessionEntity);

export const SessionModel = model<SessionsDB, TBlogModel>(
  "Session",
  sessionSchema,
);
