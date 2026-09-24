import { Request, Response } from "express";
import { LoginSuccessViewModel } from "../types";
import { NotFoundException } from "../../common/exceptions";
import { APIErrorResult } from "../../common/types";
import { authService } from "../application";
import { RefreshTokenExistInBlackListException } from "../exceptions";
import { REFRESH_TOKEN_COOKIE_OPTIONS } from "../constants";

export const updateTokens = async (
  req: Request,
  res: Response<LoginSuccessViewModel | APIErrorResult>,
) => {
  const ip = req.ip;
  const deviceName = req.get("User-Agent") ?? "Unknown device";

  const { userId, deviceId } = req.auth;

  if (!ip || !userId || !deviceId) throw new Error();

  try {
    const { accessToken, refreshToken } = await authService.createTokens(
      userId,
      ip,
      deviceName,
      deviceId,
    );

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)
      .json({ accessToken });
  } catch (error) {
    if (
      error instanceof NotFoundException ||
      error instanceof RefreshTokenExistInBlackListException
    ) {
      return res.sendStatus(401);
    }

    return res.sendStatus(500);
  }
};
