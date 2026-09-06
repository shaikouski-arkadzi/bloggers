import { Request, Response } from "express";
import { UserInputDto } from "../../users/types";
import { APIErrorResult } from "../../common/types";
import { userService } from "../../users/application";
import { SavingException } from "../../users/exceptions";

export const registerUser = async (
  req: Request<{}, {}, UserInputDto>,
  res: Response<void | APIErrorResult>,
) => {
  const user = req.body;

  try {
    await userService.create(user, true);

    res.sendStatus(204);
  } catch (error) {
    if (error instanceof SavingException) {
      return res.status(400).json({
        errorsMessages: [
          {
            message: "Произошла ошибка при сохранении пользователя",
            field: "data",
          },
        ],
      });
    }
  }
};
