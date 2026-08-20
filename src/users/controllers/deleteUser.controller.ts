import { Request, Response } from "express";
import { userService } from "../application";
import { NotFoundException } from "../../common/exceptions";

export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response<null>,
) => {
  try {
    const { id } = req.params;

    const result = await userService.delete(id);

    if (result) {
      return res.sendStatus(204);
    }
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.sendStatus(404);
    }
  }
};
