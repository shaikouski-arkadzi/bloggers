import { WithId } from "mongodb";
import { UserDb } from "../../users/types";
import { IAuthCode } from "../types";

export const mapUserDbToAuth = (userDb: WithId<UserDb>): IAuthCode => ({
  id: userDb._id.toString(),
  confirmaionCode: userDb.confirmaionCode,
});
