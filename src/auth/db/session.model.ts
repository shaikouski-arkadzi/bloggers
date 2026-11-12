import { HydratedDocument, Model, model } from "mongoose";
import { SessionsDB } from "../types";
import { sessionSchema } from "./session.schema";
import { SessionEntity } from "../domain/Session.entity";

type SessionStatics = typeof SessionEntity;

export type TBlogModel = Model<SessionsDB> & SessionStatics;

export type SessionDocument = HydratedDocument<SessionsDB>;

sessionSchema.loadClass(SessionEntity);

export const SessionModel = model<SessionsDB, TBlogModel>(
  "Session",
  sessionSchema,
);
