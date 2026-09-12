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
  const userId = req.userId!;
  const refreshToken = req.cookies?.refreshToken!;

  try {
    await authService.logout(userId, refreshToken);

    res.status(204).clearCookie("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS);
  } catch (error) {
    if (
      error instanceof NotFoundException ||
      error instanceof RefreshTokenExistInBlackListException
    ) {
      return res.sendStatus(401);
    }
  }
};
