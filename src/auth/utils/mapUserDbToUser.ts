import { WithId } from "mongodb";
import { User, UserDb } from "../types";

export const mapUserDbToUser = (userDb: WithId<UserDb>): User => ({
  id: userDb._id.toString(),
  login: userDb.login,
  email: userDb.email,
  createdAt: userDb.createdAt,
});
