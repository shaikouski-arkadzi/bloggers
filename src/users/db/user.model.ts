import { HydratedDocument, Model, model } from "mongoose";
import { UserDb } from "../types";
import { userSchema } from "./user.schema";
import { UserEntity } from "../domain/User.entity";

export interface UserMethods {
  updateConfirmaionCode(): void;
  confirmUser(): void;
  deleteConfirmaionCode(): void;
}

type UserStatics = typeof UserEntity;

export type TUserModel = Model<UserDb, {}, UserMethods> & UserStatics;

export type UserDocument = HydratedDocument<UserDb, UserMethods>;

userSchema.loadClass(UserEntity);

export const UserModel = model<UserDb, TUserModel>("User", userSchema);
