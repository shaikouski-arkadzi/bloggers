import { NextFunction, Request, Response } from "express";
import { jwtService } from "../application";
import { TokenType } from "../application/jwt.service";

export const refreshTokenValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res.sendStatus(401);
    return;
  }

  const verified = await jwtService.verifyToken(
    refreshToken,
    TokenType.Refresh,
  );

  if (verified) {
    req.userId = verified.uuid;
  } else {
    res.sendStatus(401);
    return;
  }

  next();
};
