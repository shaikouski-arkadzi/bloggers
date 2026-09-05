import { Request, Response } from "express";
import { User, UserInputDto } from "../../users/types";
import { APIErrorResult } from "../../common/types";
import { userService } from "../../users/application";
import { userQueryRepository } from "../../users/repositories";
import { SavingException } from "../../users/exceptions";

export const registerUser = async (
  req: Request<{}, {}, UserInputDto>,
  res: Response<User | APIErrorResult>,
) => {
  const user = req.body;

  try {
    const createdUserId = await userService.create(user, true);

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
