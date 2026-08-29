import { Request, Response } from "express";
import { MeViewModel } from "../types";
import { NotFoundException } from "../../common/exceptions";
import { APIErrorResult } from "../../common/types";
import { authService } from "../application";
import { UnauthorizedException } from "../exceptions";

export const userInfo = async (
  req: Request,
  res: Response<MeViewModel | APIErrorResult>,
) => {
  try {
    const userId = req.userId;

    if (!userId) return new UnauthorizedException();

    const userInfo = await authService.userInfo(userId);

    res.status(200).json(userInfo);
  } catch (error) {
    if (error instanceof UnauthorizedException) {
      return res.sendStatus(401);
    }
    if (error instanceof NotFoundException) {
      return res.sendStatus(401);
    }
  }
};
