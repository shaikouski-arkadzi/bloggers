import { model } from "mongoose";
import { UserDb } from "../types";
import { userSchema } from "./user.schema";

export const UserModel = model<UserDb>("User", userSchema);
