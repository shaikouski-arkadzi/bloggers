import { Request, Response } from "express";
import { LoginSuccessViewModel } from "../types";
import { NotFoundException } from "../../common/exceptions";
import { APIErrorResult } from "../../common/types";
import { authService, jwtService } from "../application";
import { RefreshTokenExistInBlackListException } from "../exceptions";
import { REFRESH_TOKEN_COOKIE_OPTIONS } from "../constants";
import { TokenType } from "../application/jwt.service";

export const updateTokens = async (
  req: Request,
  res: Response<LoginSuccessViewModel | APIErrorResult>,
) => {
  const userId = req.userId!;
  const refreshToken = req.cookies?.refreshToken!;

  try {
    await authService.updateTokens(userId, refreshToken);

    const accessToken = await jwtService.createToken(userId, TokenType.Access);
    const refreshTokenNew = await jwtService.createToken(
      userId,
      TokenType.Refresh,
    );

    res
      .status(200)
      .cookie("refreshToken", refreshTokenNew, REFRESH_TOKEN_COOKIE_OPTIONS)
      .json({ accessToken });
  } catch (error) {
    if (
      error instanceof NotFoundException ||
      error instanceof RefreshTokenExistInBlackListException
    ) {
      return res.sendStatus(401);
    }
  }
};
