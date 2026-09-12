import jwt from "jsonwebtoken";
import { AC_SECRET, AC_TIME, RT_SECRET, RT_TIME } from "../../settings/config";

export type JwtPayload = {
  uuid: string;
  tokenType: TokenType;
};

export enum TokenType {
  Access = "access",
  Refresh = "refresh",
}

export const jwtService = {
  async createToken(
    uuid: string,
    tokenType: TokenType = TokenType.Access,
  ): Promise<string> {
    if (!AC_SECRET || !AC_TIME) {
      throw new Error("AC_SECRET or AC_TIME is not defined");
    }
    if (!RT_SECRET || !RT_TIME) {
      throw new Error("RT_SECRET or RT_TIME is not defined");
    }

    const options = {
      expiresIn: tokenType === "access" ? AC_TIME : RT_TIME,
    } as jwt.SignOptions;

    const secret: jwt.Secret = tokenType === "access" ? AC_SECRET : RT_SECRET;

    return jwt.sign({ uuid, tokenType: tokenType }, secret, options);
  },

  async decodeToken(token: string): Promise<JwtPayload | null> {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (e: unknown) {
      console.error("Can't decode token", e);
      return null;
    }
  },

  async verifyToken(
    token: string,
    tokenType: TokenType = TokenType.Access,
  ): Promise<JwtPayload | null> {
    if (!AC_SECRET || !AC_TIME) {
      throw new Error("AC_SECRET or AC_TIME is not defined");
    }
    if (!RT_SECRET || !RT_TIME) {
      throw new Error("RT_SECRET or RT_TIME is not defined");
    }

    const secret: jwt.Secret = tokenType === "access" ? AC_SECRET : RT_SECRET;

    try {
      return jwt.verify(token, secret) as JwtPayload;
    } catch (error) {
      console.error("Token verify some error");
      return null;
    }
  },
};
