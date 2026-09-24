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

  const verified = await jwtService.verifyToken(
    refreshToken,
    TokenType.Refresh,
  );

  if (verified) {
    const userId = verified.uuid;
    const { iat, deviceId } = verified;

    const user = await userQueryRepository.findByField({
      _id: new ObjectId(userId),
    });

    if (!user) {
      res.sendStatus(401);
      return;
    }

    if (!deviceId || !iat) {
      res.sendStatus(401);
      return;
    }

    const session = await authQueryRepository.getSessionByIATAndDeviceId(
      iat,
      deviceId,
    );

    if (!session) {
      res.sendStatus(401);
      return;
    }

    req.auth = {
      userId,
      deviceId,
      iat: iat.toString(),
    };
  } else {
    res.sendStatus(401);
    return;
  }

  next();
};
