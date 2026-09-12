import { Request, Response } from "express";
import { LoginSuccessViewModel } from "../types";
import { NotFoundException } from "../../common/exceptions";
import { APIErrorResult } from "../../common/types";
import { authService, jwtService } from "../application";
import { RefreshTokenExistInBlackListException } from "../exceptions";

export const updateTokens = async (
  req: Request,
  res: Response<LoginSuccessViewModel | APIErrorResult>,
) => {
  const userId = req.userId!;
  const refreshToken = req.cookies?.refreshToken!;

  try {
    await authService.updateTokens(userId, refreshToken);

    const accessToken = await jwtService.createToken(userId, "access");
    const refreshTokenNew = await jwtService.createToken(userId, "refresh");

    res
      .status(200)
      .cookie("refreshToken", refreshTokenNew, {
        secure: true,
        httpOnly: true,
      })
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
