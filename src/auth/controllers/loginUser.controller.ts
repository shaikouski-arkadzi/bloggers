import { Request, Response } from "express";
import { LoginInputDto, LoginSuccessViewModel } from "../types";
import { NotFoundException } from "../../common/exceptions";
import { APIErrorResult } from "../../common/types";
import { authService, jwtService } from "../application";
import { MultipleUsersDuringLoginException } from "../exceptions";
import { REFRESH_TOKEN_COOKIE_OPTIONS } from "../constants";
import { TokenType } from "../application/jwt.service";

export const loginUser = async (
  req: Request<{}, {}, LoginInputDto>,
  res: Response<LoginSuccessViewModel | APIErrorResult>,
) => {
  const credentials = req.body;

  try {
    const findedUser = await authService.login(credentials);

    const accessToken = await jwtService.createToken(
      findedUser.id,
      TokenType.Access,
    );
    const refreshToken = await jwtService.createToken(
      findedUser.id,
      TokenType.Refresh,
    );

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
