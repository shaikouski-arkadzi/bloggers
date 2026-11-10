import { HydratedDocument, Model, model } from "mongoose";
import { UserDb } from "../types";
import { userSchema } from "./user.schema";
import { UserEntity } from "../domain/User.entity";

type UserStatics = typeof UserEntity;

export type TUserModel = Model<UserDb> & UserStatics;

export type UserDocument = HydratedDocument<UserDb>;

userSchema.loadClass(UserEntity);

export const UserModel = model<UserDb, TUserModel>("User", userSchema);
