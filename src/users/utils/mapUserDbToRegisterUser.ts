import { randomUUID } from "node:crypto";
import { UserDb } from "../types";

export const mapUserDbToRegisterUser = (newUser: UserDb): UserDb => ({
  ...newUser,
  confirmaionCode: randomUUID(),
  confirmationCodeExpiration: new Date(
    Date.now() + 24 * 60 * 60 * 1000,
  ).toISOString(), // tomorrow
  isConfirmed: false,
});
