import { Request, Response } from "express";
import { NotFoundException } from "../../common/exceptions";
import { APIErrorResult } from "../../common/types";
import { authService } from "../application";
import { RefreshTokenExistInBlackListException } from "../exceptions";
import { REFRESH_TOKEN_COOKIE_OPTIONS } from "../constants";

export const logout = async (
  req: Request,
  res: Response<void | APIErrorResult>,
) => {
  const iat = req.iat;

  if (!iat) throw new Error();

  try {
    await authService.logout(iat);

    res
      .clearCookie("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS)
      .sendStatus(204);
  } catch (error) {
    if (
      error instanceof NotFoundException ||
      error instanceof RefreshTokenExistInBlackListException
    ) {
      return res.sendStatus(401);
    }
    if (error instanceof Error) {
      return res.sendStatus(500);
    }
  }
};
