import jwt from "jsonwebtoken";
import { AC_SECRET, AC_TIME } from "../../settings/config";

export type JwtPayload = {
  uuid: string;
};

export const jwtService = {
  async createToken(uuid: string): Promise<string> {
    if (!AC_SECRET || !AC_TIME) {
      throw new Error("AC_SECRET or AC_TIME is not defined");
    }

    const options = {
      expiresIn: AC_TIME,
    } as jwt.SignOptions;

    return jwt.sign({ uuid }, AC_SECRET, options);
  },

  async decodeToken(token: string): Promise<JwtPayload | null> {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (e: unknown) {
      console.error("Can't decode token", e);
      return null;
    }
  },

  async verifyToken(token: string): Promise<JwtPayload | null> {
    if (!AC_SECRET || !AC_TIME) {
      throw new Error("AC_SECRET or AC_TIME is not defined");
    }

    try {
      return jwt.verify(token, AC_SECRET) as JwtPayload;
    } catch (error) {
      console.error("Token verify some error");
      return null;
    }
  },
};
