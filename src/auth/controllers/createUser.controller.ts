import { Request, Response } from "express";
import { User, UserInputDto } from "../types";
import { APIErrorResult } from "../../common/types";
import { userService } from "../application";
import { mapUserDbToUser } from "../utils";
import { SavingException } from "../exceptions";

export const createUser = async (
  req: Request<{}, {}, UserInputDto>,
  res: Response<User | APIErrorResult>,
) => {
  const user = req.body;

  try {
    const createdUser = await userService.create(user);

    if (!createdUser) throw new SavingException();

    const mappedUser = mapUserDbToUser(createdUser);

    res.status(201).json(mappedUser);
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
