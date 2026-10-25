import { Schema, model } from "mongoose";
import { UserDb } from "../types";

const userSchema = new Schema<UserDb>({
  login: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  confirmaionCode: {
    type: String,
    required: false,
  },
  confirmationCodeExpiration: {
    type: String,
    required: false,
  },
  isConfirmed: {
    type: Boolean,
    required: false,
  },
  recoveryCode: {
    type: String,
    required: false,
  },
  recoveryCodeExpiration: {
    type: String,
    required: false,
  },
});

export const UserModel = model<UserDb>("User", userSchema);
