import { Schema, model } from "mongoose";
import { SessionsDB } from "../types";

const sessionSchema = new Schema<SessionsDB>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  iat: {
    type: Number,
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  deviceId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  deviceName: {
    type: String,
    required: true,
  },
});

export const SessionModel = model<SessionsDB>("Session", sessionSchema);
