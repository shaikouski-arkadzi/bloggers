import { NextFunction, Request, Response } from "express";
import { jwtService } from "../application";
import { TokenType } from "../application/jwt.service";

export const getUserIdFromJWTMiddleware = async (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  const auth = req.headers["authorization"] as string;

  if (auth) {
    const [authType, token] = auth.split(" ");

    if (authType === "Bearer" && token) {
      const verified = await jwtService.verifyToken(token, TokenType.Access);

      if (verified) {
        req.auth = {
          userId: verified.uuid,
          deviceId: null,
          iat: null,
        };
      }
    }
  }

  next();
};
