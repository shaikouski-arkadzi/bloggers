import { Request, Response } from "express";
import { LoginInputDto, LoginSuccessViewModel } from "../types";
import { NotFoundException } from "../../common/exceptions";
import { APIErrorResult } from "../../common/types";
import { authService } from "../application";
import { MultipleUsersDuringLoginException } from "../exceptions";
import { REFRESH_TOKEN_COOKIE_OPTIONS } from "../constants";

export const loginUser = async (
  req: Request<{}, {}, LoginInputDto>,
  res: Response<LoginSuccessViewModel | APIErrorResult>,
) => {
  const ip = req.ip;
  const deviceName = req.get("User-Agent") ?? "Unknown device";

  if (!ip) throw new Error();

  const credentials = req.body;

  try {
    const findedUser = await authService.login(credentials);

    const { accessToken, refreshToken } = await authService.createTokens(
      findedUser.id,
      ip,
      deviceName,
    );

    return res
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

    return res.sendStatus(500);
  }
};
