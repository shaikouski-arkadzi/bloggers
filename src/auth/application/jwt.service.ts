import jwt from "jsonwebtoken";
import { AC_SECRET, AC_TIME, RT_SECRET, RT_TIME } from "../../settings/config";

export type JwtAccessPayload = {
  uuid: string;
  tokenType: TokenType;
  iat: number;
  exp: number;
};

export type JwtRefreshPayload = TokenInput & {
  tokenType: TokenType;
  iat: number;
  exp: number;
};

export type JwtPayload<T extends TokenType = TokenType.Access> =
  T extends TokenType.Access ? JwtAccessPayload : JwtRefreshPayload;

export enum TokenType {
  Access = "access",
  Refresh = "refresh",
}

type TokenInput = {
  uuid: string;
  deviceId?: string;
  deviceName?: string;
  ip?: string;
};

export const jwtService = {
  async createToken(
    data: TokenInput,
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

    return jwt.sign({ ...data, tokenType }, secret, options);
  },

  async verifyToken<T extends TokenType = TokenType.Access>(
    token: string,
    tokenType: T = TokenType.Access as T,
  ): Promise<JwtPayload<T> | null> {
    const secret = tokenType === TokenType.Access ? AC_SECRET : RT_SECRET;

    if (!secret) {
      throw new Error(`Secret for ${tokenType} token is not defined`);
    }

    try {
      const payload = jwt.verify(token, secret);

      if (typeof payload === "string" || payload.tokenType !== tokenType) {
        return null;
      }

      return payload as JwtPayload<T>;
    } catch (error) {
      console.error("Token verification failed");
      return null;
    }
  },
};
