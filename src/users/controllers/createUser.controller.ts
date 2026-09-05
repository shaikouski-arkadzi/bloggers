import { Request, Response } from "express";
import { User, UserInputDto } from "../types";
import { APIErrorResult } from "../../common/types";
import { userService } from "../application";
import { SavingException } from "../exceptions";
import { userQueryRepository } from "../repositories";

export const createUser = async (
  req: Request<{}, {}, UserInputDto>,
  res: Response<User | APIErrorResult>,
) => {
  const user = req.body;

  try {
    const createdUserId = await userService.create(user);

    const newUser = await userQueryRepository.findByField({
      _id: createdUserId,
    });

    if (!newUser) throw new SavingException();

    res.status(201).json(newUser);
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
