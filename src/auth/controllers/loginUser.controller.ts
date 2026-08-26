import { Request, Response } from "express";
import { LoginInputDto, LoginSuccessViewModel } from "../types";
import { NotFoundException } from "../../common/exceptions";
import { APIErrorResult } from "../../common/types";
import { authService, jwtService } from "../application";
import { MultipleUsersDuringLoginException } from "../exceptions";

export const loginUser = async (
  req: Request<{}, {}, LoginInputDto>,
  res: Response<LoginSuccessViewModel | APIErrorResult>,
) => {
  const credentials = req.body;

  try {
    const findedUser = await authService.login(credentials);

    const token = await jwtService.createToken(findedUser.id);

    res.status(200).json({ accessToken: token });
  } catch (error) {
    if (
      error instanceof NotFoundException ||
      error instanceof MultipleUsersDuringLoginException
    ) {
      return res.sendStatus(401);
    }
  }
};
