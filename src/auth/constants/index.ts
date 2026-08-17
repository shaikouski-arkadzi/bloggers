import { User } from "../types";

export const USERS_PATH = "/users";

export const USERS_ROUTES = {
  ROOT: "",
  BY_ID: "/:id",
} as const;

export const USERS_FIELDS: (keyof User)[] = [
  "id",
  "login",
  "email",
  "createdAt",
];
