import { model } from "mongoose";
import { SessionsDB } from "../types";
import { sessionSchema } from "./session.schema";

export const SessionModel = model<SessionsDB>("Session", sessionSchema);
