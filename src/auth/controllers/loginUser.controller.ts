import { Request, Response } from "express";
import { LoginInputDto, LoginSuccessViewModel } from "../types";
import { NotFoundException } from "../../common/exceptions";
import { APIErrorResult } from "../../common/types";
import { authService, jwtService } from "../application";
import { MultipleUsersDuringLoginException } from "../exceptions";
import { REFRESH_TOKEN_COOKIE_OPTIONS } from "../constants";
import { TokenType } from "../application/jwt.service";
import { ObjectId } from "mongodb";
import { authCommandRepository } from "../repositories";

export const loginUser = async (
  req: Request<{}, {}, LoginInputDto>,
  res: Response<LoginSuccessViewModel | APIErrorResult>,
) => {
  const ip = req.ip;
  const deviceName = req.get("User-Agent") ?? "Unknown device";

  if (!ip) return res.sendStatus(500);

  const credentials = req.body;

  try {
    const findedUser = await authService.login(credentials);

    const accessToken = await jwtService.createToken(
      { uuid: findedUser.id },
      TokenType.Access,
    );
    const refreshToken = await jwtService.createToken(
      {
        uuid: findedUser.id,
        deviceId: new ObjectId().toString(),
        deviceName,
        ip,
      },
      TokenType.Refresh,
    );

    const decodedToken = await jwtService.decodeToken(refreshToken);

    if (
      !decodedToken ||
      !decodedToken.deviceId ||
      !decodedToken.deviceName ||
      !decodedToken.ip ||
      !decodedToken.uuid ||
      decodedToken.iat == null
    ) {
      return res.sendStatus(500);
    }

    await authCommandRepository.createSession({
      deviceId: decodedToken.deviceId,
      deviceName: decodedToken.deviceName,
      ip: decodedToken.ip,
      iat: decodedToken.iat,
      userId: decodedToken.uuid,
    });

    res
      .status(200)
      .cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)
      .json({ accessToken });
  } catch (error) {
    if (
      error instanceof NotFoundException ||
      error instanceof MultipleUsersDuringLoginException
    ) {
      return res.sendStatus(401);
    }
  }
};
