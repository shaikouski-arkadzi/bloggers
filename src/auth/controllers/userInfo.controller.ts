import { Request, Response } from "express";
import { MeViewModel } from "../types";
import { NotFoundException } from "../../common/exceptions";
import { APIErrorResult } from "../../common/types";
import { authService } from "../application";

export const userInfo = async (
  req: Request,
  res: Response<MeViewModel | APIErrorResult>,
) => {
  try {
    // Ожидаем строке в authorization заголовке вида 'Bearer xxxx'
    const auth = req.headers["authorization"] as string;

    const userInfo = await authService.userInfo(auth);

    res.status(200).json(userInfo);
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.sendStatus(401);
    }
  }
};
