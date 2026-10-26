import { Types } from "mongoose";
import { User, UserDb } from "../types";

export const mapUserDbToUser = (
  userDb: UserDb & { _id: Types.ObjectId },
): User => ({
  id: userDb._id.toString(),
  login: userDb.login,
  email: userDb.email,
  createdAt: userDb.createdAt,
});
