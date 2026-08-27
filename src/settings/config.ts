import dotenv from "dotenv";

dotenv.config();

export const ADMIN_LOGIN = process.env.ADMIN_LOGIN;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export const MONGO_URI = process.env.MONGO_URI;

export const SALT_ROUND_COUNTS = Number(process.env.SALT_ROUND_COUNTS);

export const AC_SECRET = process.env.AC_SECRET;
export const AC_TIME = Number(process.env.AC_TIME);
