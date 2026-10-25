import { Types } from "mongoose";
import { UserDb } from "../../users/types";
import { IAuthCode } from "../types";

export const mapUserDbToAuth = (
  userDb: UserDb & { _id: Types.ObjectId },
): IAuthCode => ({
  id: userDb._id.toString(),
  confirmaionCode: userDb.confirmaionCode,
});
