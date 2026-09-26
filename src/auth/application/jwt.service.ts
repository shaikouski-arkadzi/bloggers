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
    const isAccess = tokenType === TokenType.Access;

    const secret = isAccess ? AC_SECRET : RT_SECRET;
    const options = {
      expiresIn: Number(isAccess ? AC_TIME : RT_TIME),
    } as jwt.SignOptions;
    const expiresIn = Number(isAccess ? AC_TIME : RT_TIME);

    if (!secret) {
      throw new Error(`Secret for ${tokenType} token is not defined`);
    }

    if (!Number.isFinite(expiresIn) || expiresIn <= 0) {
      throw new Error(`Invalid lifetime for ${tokenType} token`);
    }

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

      if (typeof payload === "string") {
        throw new Error("Unexpected payload");
      }

      if (payload.tokenType !== tokenType) {
        throw new Error("Token type mismatch");
      }

      return payload as JwtPayload<T>;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        const now = Date.now();
        const expiredAt = error.expiredAt.getTime();

        throw new Error(
          `DEBUG: expired ${((now - expiredAt) / 1000).toFixed(3)} seconds ago`,
        );
      }

      throw new Error(
        error instanceof Error
          ? `DEBUG: ${error.name}: ${error.message}`
          : "DEBUG: Unknown verification error",
      );

      return null;
    }
  },
};
