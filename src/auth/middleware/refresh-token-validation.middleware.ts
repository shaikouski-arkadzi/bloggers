import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { jwtService } from "../application";
import { TokenType } from "../application/jwt.service";
import { authQueryRepository } from "../repositories";
import { userQueryRepository } from "../../users/repositories";

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

  const verified = await jwtService
    .verifyToken(refreshToken, TokenType.Refresh)
    .catch((error: unknown) => {
      res
        .status(401)
        .send(
          error instanceof Error ? error.message : "Unknown verification error",
        );

      return null;
    });

  if (res.headersSent) {
    return;
  }

  if (verified) {
    const userId = verified.uuid;
    const { iat, deviceId } = verified;

    const user = await userQueryRepository.findByField({
      _id: new ObjectId(userId),
    });

    if (!user) {
      res.status(401).send("User not found");
      return;
    }

    if (!deviceId || !iat) {
      res.status(401).send("deviceId or iat missing");
      return;
    }

    const session = await authQueryRepository.getSessionByIATAndDeviceId(
      iat,
      deviceId,
    );

    if (!session) {
      res.status(401).send("session not found");
      return;
    }

    req.auth = {
      userId,
      deviceId,
      iat: iat.toString(),
    };
  } else {
    res.status(401).send("Refresh token verification failed");
    return;
  }

  next();
};
