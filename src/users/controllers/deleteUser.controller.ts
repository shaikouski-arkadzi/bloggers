import { Request, Response } from "express";
import { NotFoundException } from "../../common/exceptions";
import { userService } from "../composition-root";

export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response<null>,
) => {
  try {
    const { id } = req.params;

    await userService.delete(id);

    return res.sendStatus(204);
  } catch (error) {
    if (error instanceof NotFoundException) {
      return res.sendStatus(404);
    }

    return res.sendStatus(500);
  }
};
