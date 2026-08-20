import { Request, Response } from "express";
import { LoginInputDto } from "../types";
import { NotFoundException } from "../../common/exceptions";
import { authService } from "../application";

export const loginUser = async (
  req: Request<{}, {}, LoginInputDto>,
  res: Response<{}>,
) => {
  const credentials = req.body;

  try {
    const result = await authService.login(credentials);

    if (!result) throw new NotFoundException();

    res.sendStatus(204);
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.sendStatus(401);
    }
  }
};
